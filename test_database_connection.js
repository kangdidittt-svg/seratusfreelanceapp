const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
  }
}

// Load environment variables
loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'freelance-tracker-new';

// Test users data
const testUsers = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@freelanceapp.com',
    role: 'admin'
  },
  {
    username: 'user1',
    password: 'user123',
    email: 'user1@freelanceapp.com',
    role: 'user'
  },
  {
    username: 'tester',
    password: 'test123',
    email: 'tester@freelanceapp.com',
    role: 'user'
  },
  {
    username: 'freelancer1',
    password: 'freelance123',
    email: 'freelancer1@freelanceapp.com',
    role: 'user'
  }
];

async function testDatabaseConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('Connection URI:', MONGODB_URI ? MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'Not found');
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return false;
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Test connection
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    const db = client.db(DB_NAME);
    
    // Test database operations
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test ping
    await db.admin().ping();
    console.log('🏓 Database ping successful!');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await client.close();
  }
}

async function createSeedUsers() {
  console.log('\n🌱 Creating seed users for testing...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');
    
    console.log('📝 Creating test users:');
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await users.findOne({ username: userData.username });
      
      if (existingUser) {
        console.log(`⚠️  User '${userData.username}' already exists - skipping`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const newUser = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      };
      
      const result = await users.insertOne(newUser);
      console.log(`✅ Created user '${userData.username}' (${userData.role}) - ID: ${result.insertedId}`);
    }
    
    // Display login credentials
    console.log('\n🔑 Login Credentials for Testing:');
    console.log('================================');
    testUsers.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}: ${user.username} / ${user.password}`);
    });
    
    // Also show demo account
    console.log('👤 DEMO: demo / demo123 (built-in account)');
    
    // Count total users
    const totalUsers = await users.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    
  } catch (error) {
    console.error('❌ Error creating seed users:', error.message);
  } finally {
    await client.close();
  }
}

async function testUserAuthentication() {
  console.log('\n🔐 Testing user authentication...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');
    
    // Test authentication for first user
    const testUser = testUsers[0];
    const user = await users.findOne({ username: testUser.username });
    
    if (user) {
      const isValid = await bcrypt.compare(testUser.password, user.password);
      console.log(`✅ Authentication test for '${testUser.username}': ${isValid ? 'SUCCESS' : 'FAILED'}`);
    } else {
      console.log(`❌ User '${testUser.username}' not found`);
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
  } finally {
    await client.close();
  }
}

async function main() {
  console.log('🚀 Database Integration Test & Seed Data Creation');
  console.log('================================================\n');
  
  // Test database connection
  const connectionSuccess = await testDatabaseConnection();
  
  if (!connectionSuccess) {
    console.log('\n❌ Database connection failed. Please check your MongoDB Atlas configuration.');
    return;
  }
  
  // Create seed users
  await createSeedUsers();
  
  // Test authentication
  await testUserAuthentication();
  
  console.log('\n🎉 Database integration test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Use the login credentials above to test the application');
  console.log('2. Visit http://localhost:3001 to access the application');
  console.log('3. Try logging in with different user roles to test functionality');
}

// Run the test
main().catch(console.error);