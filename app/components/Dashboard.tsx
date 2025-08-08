'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Sunset,
  Monitor,
  Smartphone,
  Palette,
  Briefcase,
  PenTool,
  Image,
  Layout,
  Layers
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
    if (hour >= 6 && hour < 8) return 'from-orange-200 to-yellow-200' // Dawn
    if (hour >= 8 && hour < 18) return 'from-blue-200 to-cyan-200' // Day
    if (hour >= 18 && hour < 20) return 'from-orange-300 to-red-300' // Dusk
    return 'from-slate-700 to-slate-900' // Night
  }

  const renderAnimatedBackground = () => {
    const hour = time.getHours()
    
    if (hour >= 6 && hour < 8) {
      // Dawn - Rising sun and light clouds
      return (
        <>
          {/* Rising Sun */}
          <motion.div
            className="absolute top-8 right-8 w-8 h-8 bg-orange-400 rounded-full opacity-80"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Light Clouds */}
          <motion.div
            className="absolute top-12 left-4 w-6 h-3 bg-white/40 rounded-full"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-16 right-12 w-4 h-2 bg-white/30 rounded-full"
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )
    } else if (hour >= 8 && hour < 18) {
      // Day - Bright sun and floating clouds
      return (
        <>
          {/* Bright Sun */}
          <motion.div
            className="absolute top-6 right-6 w-10 h-10 bg-yellow-400 rounded-full opacity-90"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          {/* Floating Clouds */}
          <motion.div
            className="absolute top-10 left-2 w-8 h-4 bg-white/50 rounded-full"
            animate={{ x: [0, 15, 0], y: [0, -3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-20 right-8 w-6 h-3 bg-white/40 rounded-full"
            animate={{ x: [0, -12, 0], y: [0, 2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )
    } else if (hour >= 18 && hour < 20) {
      // Dusk - Setting sun with warm glow
      return (
        <>
          {/* Setting Sun */}
          <motion.div
            className="absolute bottom-8 left-8 w-12 h-12 bg-orange-500 rounded-full opacity-80"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Warm Glow */}
          <motion.div
            className="absolute bottom-6 left-6 w-16 h-16 bg-orange-300/30 rounded-full blur-sm"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Evening Clouds */}
          <motion.div
            className="absolute top-14 right-4 w-7 h-3 bg-orange-200/60 rounded-full"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )
    } else {
      // Night - Crescent moon, clouds and twinkling stars
      return (
        <>
          {/* Crescent Moon */}
          <motion.div
            className="absolute top-4 right-6 w-10 h-10"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative w-full h-full">
              <div className="w-full h-full bg-yellow-200 rounded-full shadow-lg" />
              <div className="absolute top-1 right-1 w-7 h-7 bg-slate-800 rounded-full" />
            </div>
          </motion.div>
          
          {/* Floating Clouds */}
          <motion.div
            className="absolute top-8 left-4 w-12 h-6 bg-slate-600 rounded-full opacity-40"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-2 left-2 w-8 h-4 bg-slate-600 rounded-full" />
            <div className="absolute -top-1 right-1 w-6 h-3 bg-slate-600 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-16 right-8 w-10 h-5 bg-slate-600 rounded-full opacity-30"
            animate={{ x: [0, -12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <div className="absolute -top-1 left-1 w-6 h-3 bg-slate-600 rounded-full" />
            <div className="absolute -top-2 right-2 w-5 h-3 bg-slate-600 rounded-full" />
          </motion.div>
          
          {/* Twinkling Stars */}
          <motion.div
            className="absolute top-6 left-8 w-1 h-1 bg-yellow-200 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute top-12 right-16 w-1 h-1 bg-yellow-100 rounded-full"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.6, 1.4, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-20 left-12 w-1 h-1 bg-yellow-200 rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.7, 1.3, 0.7]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div
            className="absolute top-10 left-20 w-1 h-1 bg-yellow-100 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
          />
          <motion.div
            className="absolute top-18 right-4 w-1 h-1 bg-yellow-200 rounded-full"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.2
            }}
          />
        </>
      )
    }
  }

  // Calculate angles for clock hands
  const secondAngle = (time.getSeconds() * 6) - 90
  const minuteAngle = (time.getMinutes() * 6) - 90
  const hourAngle = ((time.getHours() % 12) * 30 + time.getMinutes() * 0.5) - 90

  return (
    <div className={`bg-gradient-to-br ${getGradientColors()} h-full flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Animated Background Elements */}
      {renderAnimatedBackground()}
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
          <p className={`font-bold text-lg text-center ${
            time.getHours() >= 20 || time.getHours() < 6 
              ? 'text-blue-100' 
              : 'text-slate-700'
          }`}>
            {time.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Europe/London'
            })}
          </p>
          <p className={`text-xs font-medium text-center ${
            time.getHours() >= 20 || time.getHours() < 6 
              ? 'text-blue-200' 
              : 'text-slate-600'
          }`}>
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

  // Sort projects based on time filter
  const getSortedProjects = () => {
    const sortedProjects = [...projects]
    
    switch (timeFilter) {
      case 'weekly':
        // Sort by most recent (within last 7 days)
        return sortedProjects
          .filter(project => {
            const projectDate = new Date(project.deadline)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return projectDate >= weekAgo
          })
          .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
      
      case 'yearly':
        // Sort by year, then by most recent
        return sortedProjects
          .sort((a, b) => {
            const yearA = new Date(a.deadline).getFullYear()
            const yearB = new Date(b.deadline).getFullYear()
            if (yearA !== yearB) return yearB - yearA
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          })
      
      case 'monthly':
      default:
        // Sort by month, then by most recent
        return sortedProjects
          .sort((a, b) => {
            const dateA = new Date(a.deadline)
            const dateB = new Date(b.deadline)
            const monthA = dateA.getFullYear() * 12 + dateA.getMonth()
            const monthB = dateB.getFullYear() * 12 + dateB.getMonth()
            if (monthA !== monthB) return monthB - monthA
            return dateB.getTime() - dateA.getTime()
          })
    }
  }

  const fetchProjects = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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
          <p className="text-white/80">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
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
          <p className="text-2xl font-bold text-slate-800">{getSortedProjects().filter(p => p.status === 'In Progress').length}</p>
        </motion.div>
      </div>

      {/* Overview and Edinburgh Time Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Overview Chart */}
        <div className="lg:col-span-2">
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
        </div>

        {/* Right Column - Edinburgh Time */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
          >
            <EdinburghClock />
          </motion.div>
        </div>
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
            <div className="space-y-3">
              {getSortedProjects().slice(0, 10).map((project, index) => {
                const progress = project.status === 'Completed' ? 100 : 
                                project.status === 'In Progress' ? 60 : 
                                project.status === 'On Hold' ? 30 : 10;
                const statusColor = project.status === 'Completed' ? 'text-green-600 bg-green-50' :
                                   project.status === 'In Progress' ? 'text-blue-600 bg-blue-50' :
                                   project.status === 'On Hold' ? 'text-orange-600 bg-orange-50' :
                                   'text-gray-600 bg-gray-50';
                const getProjectIcon = () => {
                  switch (project.category) {
                    case 'Web Development':
                      return <Monitor className="w-4 h-4 text-blue-600" />;
                    case 'Mobile App':
                      return <Smartphone className="w-4 h-4 text-green-600" />;
                    case 'Design':
                    case 'UI/UX Design':
                      return <Palette className="w-4 h-4 text-purple-600" />;
                    case 'Graphic Design':
                      return <Image className="w-4 h-4 text-pink-600" />;
                    case 'Branding':
                      return <PenTool className="w-4 h-4 text-orange-600" />;
                    case 'Marketing':
                      return <Layout className="w-4 h-4 text-red-600" />;
                    default:
                      return <Briefcase className="w-4 h-4 text-gray-600" />;
                  }
                };
                
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                        {getProjectIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-800 font-medium text-sm truncate">{project.title}</h4>
                        <p className="text-slate-500 text-xs truncate">{project.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-slate-800 font-medium text-sm">${project.budget.toLocaleString()}</p>
                        <p className="text-slate-500 text-xs">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColor} whitespace-nowrap`}>
                        {project.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              {getSortedProjects().length === 0 && (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No projects found for {timeFilter} view</p>
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
              {/* Generate unique clients from sorted projects */}
              {Array.from(new Set(getSortedProjects().map(p => p.client))).slice(0, 5).map((clientName, index) => {
                const clientProjects = getSortedProjects().filter(p => p.client === clientName);
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
              {getSortedProjects().length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm">No clients for {timeFilter} view</p>
                </div>
              )}
            </div>
          </motion.div>


        </div>
      </div>
    </div>
  )
}

export default Dashboard