const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProjectAPI() {
  console.log('🧪 Testing /api/projects endpoint...');
  
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
  
  if (!setCookieHeader) {
    console.log('❌ No auth token received');
    return;
  }
  
  // Extract auth token
  const authTokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
  if (!authTokenMatch) {
    console.log('❌ Could not extract auth token');
    return;
  }
  
  const authToken = authTokenMatch[1];
  console.log('🔑 Auth token extracted:', authToken.substring(0, 20) + '...');
  
  // Test creating a project
  console.log('\n2. Testing project creation...');
  const projectData = {
    title: "Test API Project",
    client: "Test Client",
    description: "Testing project creation via API",
    category: "Web Development",
    budget: "1000",
    deadline: "2024-12-31",
    priority: "Medium",
    status: "Pending"
  };
  
  const createResponse = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `auth-token=${authToken}`
    },
    body: JSON.stringify(projectData)
  });
  
  console.log('Create response status:', createResponse.status);
  const createResult = await createResponse.text();
  console.log('Create response body:', createResult);
  
  if (createResponse.ok) {
    console.log('✅ Project created successfully!');
  } else {
    console.log('❌ Project creation failed');
  }
  
  // Test getting projects
  console.log('\n3. Testing project retrieval...');
  const getResponse = await fetch('http://localhost:3000/api/projects', {
    method: 'GET',
    headers: {
      'Cookie': `auth-token=${authToken}`
    }
  });
  
  console.log('Get response status:', getResponse.status);
  const getResult = await getResponse.text();
  console.log('Get response body:', getResult);
  
  if (getResponse.ok) {
    console.log('✅ Projects retrieved successfully!');
    try {
      const projects = JSON.parse(getResult);
      console.log('📊 Number of projects:', projects.projects?.length || 0);
    } catch (e) {
      console.log('⚠️ Could not parse projects response');
    }
  } else {
    console.log('❌ Project retrieval failed');
  }
}

testProjectAPI().catch(console.error);