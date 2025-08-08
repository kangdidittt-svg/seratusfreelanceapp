const { MongoClient } = require('mongodb');
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
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env.local file:', error.message);
    return {};
  }
}

const envVars = loadEnvFile();
const uri = envVars.MONGODB_URI;
const client = new MongoClient(uri);

async function viewProjectSeeds() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('freelance-tracker-new');
    const projectsCollection = db.collection('projects');
    
    // Get all projects grouped by category
    const projects = await projectsCollection.find({}).toArray();
    
    console.log('\n=== DETAIL PROJECT SEEDS YANG TELAH DIBUAT ===\n');
    
    const categories = [...new Set(projects.map(p => p.category))];
    
    for (const category of categories) {
      console.log(`\n📁 KATEGORI: ${category.toUpperCase()}`);
      console.log('=' .repeat(50));
      
      const categoryProjects = projects.filter(p => p.category === category);
      
      categoryProjects.forEach((project, index) => {
        console.log(`\n${index + 1}. ${project.title}`);
        console.log(`   👤 Client: ${project.client}`);
        console.log(`   👨‍💻 Assigned to: ${project.assignedTo}`);
        console.log(`   💰 Budget: $${project.budget.toLocaleString()}`);
        console.log(`   📅 Deadline: ${project.deadline.toLocaleDateString()}`);
        console.log(`   🎯 Priority: ${project.priority}`);
        console.log(`   📊 Status: ${project.status}`);
        console.log(`   📝 Description: ${project.description}`);
      });
    }
    
    console.log('\n\n=== RINGKASAN ===');
    console.log(`Total projects: ${projects.length}`);
    console.log(`Total categories: ${categories.length}`);
    
    // Status summary
    const statusSummary = {};
    projects.forEach(p => {
      statusSummary[p.status] = (statusSummary[p.status] || 0) + 1;
    });
    
    console.log('\nStatus distribution:');
    Object.entries(statusSummary).forEach(([status, count]) => {
      console.log(`- ${status}: ${count} projects`);
    });
    
    // Priority summary
    const prioritySummary = {};
    projects.forEach(p => {
      prioritySummary[p.priority] = (prioritySummary[p.priority] || 0) + 1;
    });
    
    console.log('\nPriority distribution:');
    Object.entries(prioritySummary).forEach(([priority, count]) => {
      console.log(`- ${priority}: ${count} projects`);
    });
    
    // Budget summary
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const avgBudget = totalBudget / projects.length;
    
    console.log('\nBudget summary:');
    console.log(`- Total budget: $${totalBudget.toLocaleString()}`);
    console.log(`- Average budget: $${Math.round(avgBudget).toLocaleString()}`);
    
  } catch (error) {
    console.error('Error viewing project seeds:', error);
  } finally {
    await client.close();
    console.log('\n\nDatabase connection closed');
  }
}

// Run the script
viewProjectSeeds();