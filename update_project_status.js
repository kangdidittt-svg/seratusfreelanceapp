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

// Status mapping from old format to new format
const statusMapping = {
  'in-progress': 'In Progress',
  'pending': 'Pending',
  'completed': 'Completed',
  'on-hold': 'On Hold'
};

async function updateProjectStatus() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('freelance-tracker-new');
    const projectsCollection = db.collection('projects');
    
    // Get all projects with old status format
    const projectsToUpdate = await projectsCollection.find({
      status: { $in: ['in-progress', 'pending', 'completed', 'on-hold'] }
    }).toArray();
    
    console.log(`Found ${projectsToUpdate.length} projects with old status format`);
    
    if (projectsToUpdate.length === 0) {
      console.log('No projects need status update');
      return;
    }
    
    // Update each project
    let updatedCount = 0;
    for (const project of projectsToUpdate) {
      const oldStatus = project.status;
      const newStatus = statusMapping[oldStatus] || oldStatus;
      
      if (newStatus !== oldStatus) {
        await projectsCollection.updateOne(
          { _id: project._id },
          { $set: { status: newStatus } }
        );
        console.log(`Updated project "${project.title}" status from "${oldStatus}" to "${newStatus}"`);
        updatedCount++;
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} projects`);
    
    // Verify the update by checking current status distribution
    const statusCounts = await projectsCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    
    console.log('\nCurrent status distribution:');
    statusCounts.forEach(status => {
      console.log(`- ${status._id}: ${status.count} projects`);
    });
    
  } catch (error) {
    console.error('Error updating project status:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB Atlas');
  }
}

// Run the update
updateProjectStatus().catch(console.error);