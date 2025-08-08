#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * 
 * This script tests the MongoDB connection with the same configuration
 * used by the application to help diagnose SSL/TLS connection issues.
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  console.log('Please check your .env.local file');
  process.exit(1);
}

const options = {
  // Modern TLS configuration for MongoDB Atlas
  tls: true,
  // Retry configuration
  retryWrites: true,
  // Connection timeout
  serverSelectionTimeoutMS: 5000,
  // Socket timeout
  socketTimeoutMS: 45000,
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 5,
  // Additional TLS options for production
  ...(process.env.NODE_ENV === 'production' && {
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  })
};

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
  
  const client = new MongoClient(uri, options);
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');
    
    console.log('⏳ Testing database ping...');
    const db = client.db('freelance-trackers');
    await db.admin().ping();
    console.log('✅ Database ping successful');
    
    console.log('⏳ Testing collections access...');
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('⏳ Testing users collection...');
    const users = db.collection('users');
    const userCount = await users.countDocuments();
    console.log(`✅ Users collection has ${userCount} documents`);
    
    console.log('\n🎉 All tests passed! MongoDB connection is working properly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.cause) {
      console.error('Underlying cause:', error.cause.message);
    }
    
    console.log('\n🔧 Troubleshooting suggestions:');
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('   - SSL/TLS connection issue detected');
      console.log('   - Check if MongoDB Atlas cluster is accessible');
      console.log('   - Verify SSL configuration in mongodb.ts');
    }
    
    if (error.message.includes('authentication')) {
      console.log('   - Check username and password in MONGODB_URI');
      console.log('   - Verify database user permissions in MongoDB Atlas');
    }
    
    if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.log('   - Check network connectivity');
      console.log('   - Verify IP whitelist in MongoDB Atlas');
      console.log('   - Check firewall settings');
    }
    
    console.log('   - Review MONGODB_SSL_TROUBLESHOOTING.md for detailed solutions');
    
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the test
testConnection();