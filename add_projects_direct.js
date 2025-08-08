const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          envVars[key.trim()] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    return {};
  }
}

async function addProjectsDirectly() {
  // Load environment variables from .env.local
  const envVars = loadEnvFile();
  const uri = envVars.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // Extract database name from URI or use default
    const dbName = envVars.DB_NAME || 'freelance-tracker-new';
    const db = client.db(dbName);
    
    // First, create an admin user if it doesn't exist
    const existingUser = await db.collection('users').findOne({ username: 'admin' });
    let adminUser;
    
    if (!existingUser) {
      console.log('👤 Creating admin user...');
      
      const userResult = await db.collection('users').insertOne({
        username: 'admin',
        password: '$2b$10$8K1p/a0dclxKoNqIfrHb2eIiUmOkfq6q1h2M3/fU4Js4kW5u6Nm1W', // admin123 hashed
        createdAt: new Date()
      });
      
      adminUser = { _id: userResult.insertedId, username: 'admin' };
      console.log('✅ Admin user created:', adminUser._id);
    } else {
      adminUser = existingUser;
      console.log('👤 Using existing admin user:', adminUser._id);
    }
    
    // Sample projects
    const projects = [
      {
        title: "E-commerce Website Development",
        client: "TechCorp Solutions",
        description: "Developing a modern e-commerce platform with React and Node.js",
        category: "Web Development",
        budget: 5000,
        deadline: new Date('2024-12-15'),
        priority: "High",
        status: "In Progress",
        progress: 45,
        paid: 2000,
        userId: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Mobile App UI/UX Design",
        client: "StartupXYZ",
        description: "Creating user interface and experience design for mobile application",
        category: "UI/UX Design",
        budget: 3500,
        deadline: new Date('2024-11-30'),
        priority: "Medium",
        status: "In Progress",
        progress: 70,
        paid: 1500,
        userId: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Corporate Website Redesign",
        client: "DataCorp Inc",
        description: "Complete redesign of corporate website with modern look",
        category: "Web Development",
        budget: 4200,
        deadline: new Date('2024-09-15'),
        priority: "High",
        status: "Completed",
        progress: 100,
        paid: 4200,
        userId: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Brand Identity Package",
        client: "Creative Agency Ltd",
        description: "Complete branding package including logo, colors, and guidelines",
        category: "Branding",
        budget: 2800,
        deadline: new Date('2024-10-25'),
        priority: "Low",
        status: "Pending",
        progress: 0,
        paid: 0,
        userId: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Marketing Campaign Graphics",
        client: "Local Business",
        description: "Design graphics for social media marketing campaign",
        category: "Graphic Design",
        budget: 1800,
        deadline: new Date('2024-11-10'),
        priority: "Medium",
        status: "On Hold",
        progress: 25,
        paid: 500,
        userId: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert projects
    const result = await db.collection('projects').insertMany(projects);
    console.log(`✅ Added ${result.insertedCount} projects successfully`);
    
    // Verify insertion
    const projectCount = await db.collection('projects').countDocuments();
    console.log(`📁 Total projects in database: ${projectCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addProjectsDirectly();