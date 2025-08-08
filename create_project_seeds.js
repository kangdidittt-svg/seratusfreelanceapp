const { MongoClient } = require('mongodb');
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
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env.local file:', error.message);
    return {};
  }
}

const envVars = loadEnvFile();
const uri = envVars.MONGODB_URI;
const client = new MongoClient(uri);

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile App', 
  'UI/UX Design',
  'Branding',
  'Marketing',
  'Consulting',
  'Other'
];

// Sample projects data for each category
const projectsData = {
  'Web Development': [
    {
      title: 'E-commerce Website Development',
      client: 'TechStore Inc',
      description: 'Build a modern e-commerce platform with React and Node.js',
      budget: 5000,
      deadline: new Date('2024-03-15'),
      priority: 'high',
      status: 'In Progress'
    },
    {
      title: 'Corporate Website Redesign',
      client: 'Business Solutions Ltd',
      description: 'Redesign company website with modern UI/UX',
      budget: 3000,
      deadline: new Date('2024-02-28'),
      priority: 'medium',
      status: 'Pending'
    },
    {
      title: 'Portfolio Website',
      client: 'John Photography',
      description: 'Create a stunning portfolio website for photographer',
      budget: 1500,
      deadline: new Date('2024-02-10'),
      priority: 'low',
      status: 'Completed'
    }
  ],
  'Mobile App': [
    {
      title: 'Fitness Tracking App',
      client: 'HealthTech Startup',
      description: 'Develop iOS and Android app for fitness tracking',
      budget: 8000,
      deadline: new Date('2024-04-20'),
      priority: 'high',
      status: 'In Progress'
    },
    {
      title: 'Food Delivery App',
      client: 'QuickEats',
      description: 'Build a food delivery mobile application',
      budget: 12000,
      deadline: new Date('2024-05-15'),
      priority: 'high',
      status: 'Pending'
    }
  ],
  'UI/UX Design': [
    {
      title: 'Banking App UI Redesign',
      client: 'SecureBank',
      description: 'Redesign mobile banking app interface',
      budget: 4000,
      deadline: new Date('2024-03-01'),
      priority: 'high',
      status: 'In Progress'
    },
    {
      title: 'Dashboard Design System',
      client: 'Analytics Pro',
      description: 'Create comprehensive design system for analytics dashboard',
      budget: 3500,
      deadline: new Date('2024-02-25'),
      priority: 'medium',
      status: 'Pending'
    }
  ],
  'Branding': [
    {
      title: 'Startup Brand Identity',
      client: 'InnovateTech',
      description: 'Complete brand identity package including logo, colors, typography',
      budget: 2500,
      deadline: new Date('2024-02-20'),
      priority: 'medium',
      status: 'In Progress'
    },
    {
      title: 'Restaurant Rebranding',
      client: 'Bella Vista Restaurant',
      description: 'Rebrand restaurant with new logo and marketing materials',
      budget: 2000,
      deadline: new Date('2024-03-10'),
      priority: 'low',
      status: 'Pending'
    }
  ],
  'Marketing': [
    {
      title: 'Social Media Campaign',
      client: 'Fashion Forward',
      description: 'Design and execute social media marketing campaign',
      budget: 1800,
      deadline: new Date('2024-02-15'),
      priority: 'medium',
      status: 'In Progress'
    },
    {
      title: 'SEO Optimization Project',
      client: 'Local Business Hub',
      description: 'Improve website SEO and search rankings',
      budget: 1200,
      deadline: new Date('2024-03-05'),
      priority: 'low',
      status: 'Pending'
    }
  ],
  'Consulting': [
    {
      title: 'Digital Transformation Strategy',
      client: 'Traditional Corp',
      description: 'Provide digital transformation consulting and roadmap',
      budget: 6000,
      deadline: new Date('2024-04-01'),
      priority: 'high',
      status: 'Pending'
    },
    {
      title: 'Tech Stack Evaluation',
      client: 'Growing Startup',
      description: 'Evaluate and recommend optimal technology stack',
      budget: 2500,
      deadline: new Date('2024-02-28'),
      priority: 'medium',
      status: 'In Progress'
    }
  ],
  'Other': [
    {
      title: 'Data Migration Project',
      client: 'Enterprise Solutions',
      description: 'Migrate legacy data to new cloud infrastructure',
      budget: 4500,
      deadline: new Date('2024-03-20'),
      priority: 'high',
      status: 'Pending'
    },
    {
      title: 'API Integration',
      client: 'ConnectApp',
      description: 'Integrate third-party APIs for enhanced functionality',
      budget: 2200,
      deadline: new Date('2024-02-22'),
      priority: 'medium',
      status: 'In Progress'
    }
  ]
};

async function createProjectSeeds() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('freelance-tracker-new');
    const usersCollection = db.collection('users');
    const projectsCollection = db.collection('projects');
    
    // Get existing users
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('No users found. Please run create seed users first.');
      return;
    }
    
    // Clear existing projects (optional)
    await projectsCollection.deleteMany({});
    console.log('Cleared existing projects');
    
    let totalProjects = 0;
    const projectSummary = {};
    
    // Create projects for each category
    for (const category of DEFAULT_CATEGORIES) {
      const categoryProjects = projectsData[category] || [];
      projectSummary[category] = categoryProjects.length;
      
      for (let i = 0; i < categoryProjects.length; i++) {
        const project = categoryProjects[i];
        const userIndex = i % users.length; // Distribute projects among users
        const assignedUser = users[userIndex];
        
        const projectDoc = {
          ...project,
          category: category,
          userId: assignedUser._id,
          assignedTo: assignedUser.username,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await projectsCollection.insertOne(projectDoc);
        totalProjects++;
      }
    }
    
    console.log('\n=== PROJECT SEEDS CREATED SUCCESSFULLY ===');
    console.log(`Total projects created: ${totalProjects}`);
    console.log('\nProjects per category:');
    
    for (const [category, count] of Object.entries(projectSummary)) {
      console.log(`- ${category}: ${count} projects`);
    }
    
    console.log('\nProject distribution among users:');
    for (const user of users) {
      const userProjects = await projectsCollection.countDocuments({ userId: user._id });
      console.log(`- ${user.username}: ${userProjects} projects`);
    }
    
  } catch (error) {
    console.error('Error creating project seeds:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the script
createProjectSeeds();