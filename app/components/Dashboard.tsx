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
  Zap,
  Sun,
  Moon,
  Sunrise,
  Sunset
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
  _id: string
  title: string
  client: string
  status: 'Pending' | 'In Progress' | 'On Hold' | 'Completed'
  category: string
  budget: number
  deadline: string
  description: string
  priority: string
  progress: number
  paid: number
}

interface Stats {
  totalProjects: number
  totalIncome: number
  unpaidAmount: number
  completedProjects: number
}

const chartDataByPeriod = {
  monthly: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ],
  weekly: [
    { name: 'Week 1', value: 1200 },
    { name: 'Week 2', value: 1800 },
    { name: 'Week 3', value: 1400 },
    { name: 'Week 4', value: 2100 },
  ],
  yearly: [
    { name: '2021', value: 35000 },
    { name: '2022', value: 42000 },
    { name: '2023', value: 58000 },
    { name: '2024', value: 65000 },
  ]
}

// Edinburgh Clock Component
const EdinburghClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      // Edinburgh timezone (Europe/London)
      const edinburghTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/London"
      })
      setTime(new Date(edinburghTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTimeIcon = () => {
    const hour = time.getHours()
    if (hour >= 6 && hour < 8) return <Sunrise className="w-6 h-6 text-orange-500" />
    if (hour >= 8 && hour < 18) return <Sun className="w-6 h-6 text-yellow-500" />
    if (hour >= 18 && hour < 20) return <Sunset className="w-6 h-6 text-orange-600" />
    return <Moon className="w-6 h-6 text-blue-400" />
  }

  const getTimeOfDay = () => {
    const hour = time.getHours()
    if (hour >= 6 && hour < 8) return 'Dawn'
    if (hour >= 8 && hour < 18) return 'Day'
    if (hour >= 18 && hour < 20) return 'Dusk'
    return 'Night'
  }

  const getGradientColors = () => {
    const hour = time.getHours()
    if (hour >= 6 && hour < 8) return 'from-orange-100 to-yellow-100'
    if (hour >= 8 && hour < 18) return 'from-blue-100 to-cyan-100'
    if (hour >= 18 && hour < 20) return 'from-orange-100 to-red-100'
    return 'from-indigo-100 to-purple-100'
  }

  // Calculate angles for clock hands
  const secondAngle = (time.getSeconds() * 6) - 90
  const minuteAngle = (time.getMinutes() * 6) - 90
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90

  return (
    <div className={`bg-gradient-to-br ${getGradientColors()} rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Clock Face */}
      <div className="relative w-32 h-32 bg-white rounded-full shadow-lg border-4 border-white/50 mb-4">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-6 bg-slate-300 rounded-full"
            style={{
              top: '8px',
              left: '50%',
              transformOrigin: '50% 56px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          />
        ))}
        
        {/* Hour hand */}
        <div
          className="absolute w-1 h-8 bg-slate-700 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`
          }}
        />
        
        {/* Minute hand */}
        <div
          className="absolute w-0.5 h-12 bg-slate-600 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`
          }}
        />
        
        {/* Second hand */}
        <div
          className="absolute w-0.5 h-12 bg-red-500 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`
          }}
        />
        
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-slate-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Time display and icon */}
      <div className="flex items-center gap-3">
        {getTimeIcon()}
        <div className="text-center">
          <p className="text-slate-700 font-bold text-lg">
            {time.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Europe/London'
            })}
          </p>
          <p className="text-slate-600 text-xs font-medium">
            Edinburgh • {getTimeOfDay()}
          </p>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('monthly')
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalIncome: 0,
    unpaidAmount: 0,
    completedProjects: 0
  })

  // Get chart data based on selected time filter
  const getChartData = () => {
    return chartDataByPeriod[timeFilter as keyof typeof chartDataByPeriod] || chartDataByPeriod.monthly
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        calculateStats(data.projects || [])
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
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-2xl text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">
            Export Data
          </button>
        </div>
      </div>

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
            <AreaChart data={getChartData()}>
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

          {/* Edinburgh Clock Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Edinburgh Time</h3>
              <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
            <EdinburghClock />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard