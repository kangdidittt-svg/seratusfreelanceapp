#!/usr/bin/env node

/**
 * Login API Test Script
 * 
 * This script tests the login API endpoint to verify that
 * MongoDB SSL/TLS connection issues are resolved.
 */

const http = require('http');

const postData = JSON.stringify({
  username: 'demo',
  password: 'demo123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔄 Testing login API endpoint...');
console.log(`📍 URL: http://localhost:3000/api/auth/login`);
console.log(`📝 Payload: ${postData}`);

const req = http.request(options, (res) => {
  console.log(`\n📊 Response Status: ${res.statusCode}`);
  console.log(`📋 Response Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📄 Response Body:`);
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ Login API test successful! MongoDB connection is working.');
      } else {
        console.log('\n❌ Login API test failed with status:', res.statusCode);
      }
    } catch (error) {
      console.log('Raw response:', data);
      console.log('\n❌ Failed to parse JSON response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request failed:', error.message);
  console.log('\n🔧 Make sure the development server is running on http://localhost:3000');
});

req.write(postData);
req.end();