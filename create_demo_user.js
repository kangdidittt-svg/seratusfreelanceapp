const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'freelance-tracker-new';

async function createDemoUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const users = db.collection('users');
    
    // Check if demo user already exists
    const existingUser = await users.findOne({ username: 'demo' });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // Create demo user
    const demoUser = {
      username: 'demo',
      password: hashedPassword,
      email: 'demo@example.com',
      role: 'admin',
      createdAt: new Date()
    };
    
    const result = await users.insertOne(demoUser);
    console.log('Demo user created successfully:', result.insertedId);
    console.log('Login credentials:');
    console.log('Username: demo');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await client.close();
  }
}

createDemoUser();