const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
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

// Load environment variables
const envVars = loadEnvFile();
const MONGODB_URI = envVars.MONGODB_URI;
const DB_NAME = envVars.DB_NAME || 'freelance-tracker-new';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

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