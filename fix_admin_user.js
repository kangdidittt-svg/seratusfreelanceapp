const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://admin:admin123@localhost:27017/freelance-tracker-new?authSource=admin';

async function fixAdminUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('freelance-tracker-new');
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