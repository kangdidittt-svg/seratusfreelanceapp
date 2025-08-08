const { MongoClient, ObjectId } = require('mongodb');

async function checkDatabase() {
  // Use the same URI as the application
  const uri = 'mongodb://admin:admin123@localhost:27017/freelance-tracker-new?authSource=admin';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB (freelance-tracker-new)');
    
    const db = client.db('freelance-tracker-new');
    
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