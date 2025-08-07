'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  MapPin,
  Activity,
  Target,
  Zap
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts'

interface Project {
  id: string
  title: string
  client: string
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed'
  category: string
  budget: number
  deadline: string
  description: string
}

interface Stats {
  totalProjects: number
  totalIncome: number
  unpaidAmount: number
  completedProjects: number
}

const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalIncome: 0,
    unpaidAmount: 0,
    completedProjects: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (projectsData: Project[]) => {
    const totalProjects = projectsData.length
    const totalIncome = projectsData.reduce((sum, project) => sum + project.budget, 0)
    const completedProjects = projectsData.filter(p => p.status === 'Completed').length
    const unpaidAmount = projectsData
      .filter(p => p.status !== 'Completed')
      .reduce((sum, project) => sum + project.budget, 0)

    setStats({
      totalProjects,
      totalIncome,
      unpaidAmount,
      completedProjects
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/80">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-2xl text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">
            Export Data
          </button>
        </div>
      </div>

      {/* Overview Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overview</h2>
            <p className="text-purple-200">Your project performance this month</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${stats.totalIncome.toLocaleString()}</p>
            <p className="text-purple-200 text-sm">Total Earnings</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#1e293b'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ffffff" 
                strokeWidth={3}
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Total Earnings</h3>
          <p className="text-2xl font-bold text-slate-800">${stats.totalIncome.toLocaleString()}</p>
        </motion.div>

        {/* Projects Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Projects Completed</h3>
          <p className="text-2xl font-bold text-slate-800">{stats.completedProjects}</p>
        </motion.div>

        {/* Avg Project Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-purple-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Avg Project Value</h3>
          <p className="text-2xl font-bold text-slate-800">${stats.totalProjects > 0 ? Math.round(stats.totalIncome / stats.totalProjects).toLocaleString() : '0'}</p>
        </motion.div>

        {/* Pending Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600 text-sm font-medium">-3%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Pending Payment</h3>
          <p className="text-2xl font-bold text-slate-800">${stats.unpaidAmount.toLocaleString()}</p>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-indigo-600 text-sm font-medium">+15%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Active Projects</h3>
          <p className="text-2xl font-bold text-slate-800">{projects.filter(p => p.status === 'In Progress').length}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Projects */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Projects</h2>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.slice(0, 6).map((project, index) => {
                const progress = project.status === 'Completed' ? 100 : 
                                project.status === 'In Progress' ? 60 : 
                                project.status === 'On Hold' ? 30 : 10;
                const statusColor = project.status === 'Completed' ? 'from-green-500 to-emerald-500' :
                                   project.status === 'In Progress' ? 'from-blue-500 to-cyan-500' :
                                   project.status === 'On Hold' ? 'from-yellow-500 to-orange-500' :
                                   'from-gray-500 to-gray-600';
                const icon = project.category === 'Web Development' ? '💻' :
                            project.category === 'Mobile App' ? '📱' :
                            project.category === 'Design' ? '🎨' : '📁';
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 border border-slate-100/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl">{icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusColor} text-white`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <h4 className="text-slate-800 font-semibold text-lg mb-2">{project.title}</h4>
                    <p className="text-slate-600 text-sm mb-4">{project.client}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-slate-800 font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${statusColor}`}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {projects.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-600">No projects found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* My Clients Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">My Clients</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {/* Generate unique clients from projects */}
              {Array.from(new Set(projects.map(p => p.client))).slice(0, 5).map((clientName, index) => {
                const clientProjects = projects.filter(p => p.client === clientName);
                const totalEarnings = clientProjects.reduce((sum, p) => sum + p.budget, 0);
                const completedCount = clientProjects.filter(p => p.status === 'Completed').length;
                const avatars = ['👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎨', '👩‍🔬'];
                
                return (
                  <button
                    key={clientName}
                    onClick={() => {
                      // Navigate to client projects
                      console.log(`View projects for ${clientName}`);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {avatars[index % avatars.length]}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-800 text-sm">{clientName}</p>
                        <p className="text-xs text-slate-500">
                          {clientProjects.length} projects • ${totalEarnings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium">
                        {completedCount}/{clientProjects.length}
                      </span>
                      <div className="w-6 h-6 bg-slate-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                        <span className="text-slate-600 group-hover:text-purple-600 text-xs">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {projects.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No clients yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Live Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Live map</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View
              </button>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">🗺️</span>
                </div>
                <p className="text-orange-700 text-sm font-medium">Interactive Map</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard