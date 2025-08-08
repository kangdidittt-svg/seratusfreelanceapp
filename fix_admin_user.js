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
const uri = envVars.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function fixAdminUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // Extract database name from URI or use default
    const dbName = envVars.DB_NAME || 'freelance-tracker-new';
    const db = client.db(dbName);
    const users = db.collection('users');
    
    // Delete existing admin user
    await users.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create new admin user with proper password hash
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date()
    };
    
    const result = await users.insertOne(adminUser);
    console.log('✅ Created new admin user:', result.insertedId);
    
    // Test password verification
    const testUser = await users.findOne({ username: 'admin' });
    const isValid = await bcrypt.compare('admin123', testUser.password);
    console.log('🔐 Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
    
    console.log('Final admin user:', {
      _id: testUser._id,
      username: testUser.username,
      email: testUser.email,
      role: testUser.role,
      createdAt: testUser.createdAt
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminUser();