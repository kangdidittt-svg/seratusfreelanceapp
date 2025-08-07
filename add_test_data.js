const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test projects data
const projects = [
  // 3 Project sedang dikerjakan (In Progress)
  {
    title: "E-commerce Website Development",
    client: "TechCorp Solutions",
    description: "Developing a modern e-commerce platform with React and Node.js",
    category: "Web Development",
    budget: "5000",
    deadline: "2024-12-15",
    priority: "High",
    status: "In Progress"
  },
  {
    title: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    description: "Creating user interface and experience design for mobile application",
    category: "UI/UX Design",
    budget: "3500",
    deadline: "2024-11-30",
    priority: "Medium",
    status: "In Progress"
  },
  {
    title: "Brand Identity Package",
    client: "Creative Agency Ltd",
    description: "Complete branding package including logo, colors, and guidelines",
    category: "Branding",
    budget: "2800",
    deadline: "2024-10-25",
    priority: "Low",
    status: "In Progress"
  },
  
  // 2 Project selesai (Completed)
  {
    title: "Corporate Website Redesign",
    client: "DataCorp Inc",
    description: "Complete redesign of corporate website with modern look",
    category: "Web Development",
    budget: "4200",
    deadline: "2024-09-15",
    priority: "High",
    status: "Completed"
  },
  {
    title: "Marketing Campaign Graphics",
    client: "Local Business",
    description: "Social media graphics and marketing materials",
    category: "Marketing",
    budget: "1500",
    deadline: "2024-08-30",
    priority: "Medium",
    status: "Completed"
  },
  
  // 2 Project pending
  {
    title: "Database Optimization Consulting",
    client: "Enterprise Solutions",
    description: "Performance optimization for large-scale database systems",
    category: "Consulting",
    budget: "6500",
    deadline: "2025-01-20",
    priority: "High",
    status: "Pending"
  },
  {
    title: "iOS App Development",
    client: "Mobile Startup",
    description: "Native iOS application development from scratch",
    category: "Mobile App",
    budget: "8000",
    deadline: "2025-02-28",
    priority: "Low",
    status: "Pending"
  }
];

async function addTestProjects() {
  console.log('🚀 Starting to add test projects...');
  
  try {
    // Login first
    console.log('🔐 Logging in...');
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
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    // Get cookies from login response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let authToken = '';
    
    if (setCookieHeader) {
      // Extract auth-token from set-cookie header
      const match = setCookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authToken = `auth-token=${match[1]}`;
      }
    }
    
    console.log('✅ Login successful!');
    console.log('🔍 Set-Cookie header:', setCookieHeader);
    console.log('🔑 Auth token extracted:', authToken ? 'Yes' : 'No');
    console.log('🔑 Auth token value:', authToken);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Add each project
    for (const project of projects) {
      try {
        console.log(`📝 Adding: ${project.title}`);
        
        const response = await fetch('http://localhost:3000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': authToken
          },
          body: JSON.stringify(project)
        });
        
        if (response.ok) {
          console.log(`✅ Added: ${project.title}`);
          successCount++;
        } else {
          const errorText = await response.text();
          console.log(`❌ Failed to add: ${project.title} - ${response.status}`);
          console.log(`   Error: ${errorText}`);
          errorCount++;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`❌ Error adding ${project.title}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added: ${successCount} projects`);
    console.log(`❌ Failed to add: ${errorCount} projects`);
    console.log(`📋 Total projects: ${projects.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Test projects have been added! You can now view them in the application.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addTestProjects();