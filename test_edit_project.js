const fetch = require('node-fetch');

async function testEditProject() {
  try {
    // First, login to get auth token
    console.log('Logging in...');
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
      console.error('Login failed:', loginResponse.status);
      return;
    }

    // Extract auth token from Set-Cookie header
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const authTokenMatch = setCookieHeader?.match(/auth-token=([^;]+)/);
    const authToken = authTokenMatch ? authTokenMatch[1] : null;

    if (!authToken) {
      console.error('No auth token found in response');
      return;
    }

    console.log('Login successful, auth token extracted');

    // Get list of projects first
    console.log('\nFetching projects list...');
    const projectsResponse = await fetch('http://localhost:3000/api/projects', {
      headers: {
        'Cookie': `auth-token=${authToken}`
      }
    });

    if (!projectsResponse.ok) {
      console.error('Failed to fetch projects:', projectsResponse.status);
      return;
    }

    const projectsData = await projectsResponse.json();
    console.log('Projects found:', projectsData.projects.length);

    if (projectsData.projects.length === 0) {
      console.log('No projects found to test edit functionality');
      return;
    }

    // Test fetching individual project data
    const firstProject = projectsData.projects[0];
    console.log('\nTesting edit for project:', firstProject.title);
    console.log('Project ID:', firstProject._id);

    const editResponse = await fetch(`http://localhost:3000/api/projects/${firstProject._id}`, {
      headers: {
        'Cookie': `auth-token=${authToken}`
      }
    });

    if (!editResponse.ok) {
      console.error('Failed to fetch project for edit:', editResponse.status);
      const errorText = await editResponse.text();
      console.error('Error response:', errorText);
      return;
    }

    const editData = await editResponse.json();
    console.log('\nProject data for editing:');
    console.log('- Title:', editData.project.title);
    console.log('- Client:', editData.project.client);
    console.log('- Description:', editData.project.description);
    console.log('- Category:', editData.project.category);
    console.log('- Priority:', editData.project.priority);
    console.log('- Budget:', editData.project.budget);
    console.log('- Deadline:', editData.project.deadline);
    console.log('- Status:', editData.project.status);

    console.log('\n✅ Edit project data fetch test completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEditProject();