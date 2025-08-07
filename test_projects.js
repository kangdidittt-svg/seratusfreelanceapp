// Script untuk menambahkan test projects
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

console.log('Test projects data ready:', projects.length, 'projects');
module.exports = projects;