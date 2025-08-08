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

async function checkDatabase() {
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
    
    // Check users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`👥 Users in database: ${usersCount}`);
    
    if (usersCount > 0) {
      const users = await db.collection('users').find({}).toArray();
      console.log('Users:', users.map(u => ({ id: u._id, username: u.username })));
    }
    
    // Check projects collection
    const projectsCount = await db.collection('projects').countDocuments();
    console.log(`📁 Projects in database: ${projectsCount}`);
    
    if (projectsCount > 0) {
      const projects = await db.collection('projects').find({}).toArray();
      console.log('Projects:', projects.map(p => ({ 
        id: p._id, 
        title: p.title, 
        client: p.client,
        userId: p.userId,
        status: p.status 
      })));
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();