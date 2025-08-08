const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugToken() {
  console.log('🔍 Debugging token issue...');
  
  // First, login to get auth token
  console.log('1. Logging in...');
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  if (!loginResponse.ok) {
    console.log('❌ Login failed:', await loginResponse.text());
    return;
  }
  
  const setCookieHeader = loginResponse.headers.get('set-cookie');
  console.log('✅ Login successful');
  console.log('Set-Cookie header:', setCookieHeader);
  
  // Extract auth token
  const authTokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
  if (!authTokenMatch) {
    console.log('❌ Could not extract auth token');
    return;
  }
  
  const authToken = authTokenMatch[1];
  console.log('🔑 Full auth token:', authToken);
  
  // Test /api/auth/me endpoint first
  console.log('\n2. Testing /api/auth/me...');
  const meResponse = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      'Cookie': `auth-token=${authToken}`
    }
  });
  
  console.log('Me response status:', meResponse.status);
  const meResult = await meResponse.text();
  console.log('Me response body:', meResult);
  
  if (meResponse.ok) {
    console.log('✅ /api/auth/me works!');
  } else {
    console.log('❌ /api/auth/me failed');
  }
  
  // Test projects endpoint
  console.log('\n3. Testing /api/projects...');
  const projectsResponse = await fetch('http://localhost:3000/api/projects', {
    method: 'GET',
    headers: {
      'Cookie': `auth-token=${authToken}`
    }
  });
  
  console.log('Projects response status:', projectsResponse.status);
  const projectsResult = await projectsResponse.text();
  console.log('Projects response body:', projectsResult);
  
  if (projectsResponse.ok) {
    console.log('✅ /api/projects works!');
  } else {
    console.log('❌ /api/projects failed');
  }
}

debugToken().catch(console.error);