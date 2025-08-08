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
    const updateEdinburghTime = () => {
      // Get current UTC time
      const now = new Date()
      
      // Create a new date object with Edinburgh timezone
      const edinburghTime = new Date(now.toLocaleString("en-US", {
        timeZone: "Europe/London"
      }))
      
      setTime(edinburghTime)
    }
    
    // Update immediately
    updateEdinburghTime()
    
    // Then update every second
    const timer = setInterval(updateEdinburghTime, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTimeIcon = () => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 8) return <Sunrise className="w-6 h-6 text-orange-500" />
    if (hour >= 8 && hour < 17) return <Sun className="w-6 h-6 text-yellow-500" />
    if (hour >= 17 && hour < 20) return <Sunset className="w-6 h-6 text-orange-600" />
    return <Moon className="w-6 h-6 text-blue-300" />
  }

  const getTimeOfDay = () => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 8) return 'Dawn'
    if (hour >= 8 && hour < 17) return 'Day'
    if (hour >= 17 && hour < 20) return 'Dusk'
    return 'Night'
  }

  const getBackgroundGradient = () => {
    const hour = time.getHours()
    if (hour >= 5 && hour < 8) {
      // Dawn - Purple to orange gradient
      return 'bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200'
    } else if (hour >= 8 && hour < 17) {
      // Day - Blue sky gradient
      return 'bg-gradient-to-br from-blue-300 via-cyan-200 to-blue-100'
    } else if (hour >= 17 && hour < 20) {
      // Dusk - Orange to red gradient
      return 'bg-gradient-to-br from-orange-400 via-red-300 to-purple-400'
    } else {
      // Night - Dark blue to black gradient
      return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'
    }
  }

  const renderAnimatedBackground = () => {
    const hour = time.getHours()
    
    if (hour >= 5 && hour < 8) {
      // Dawn - Rising sun with rays and morning mist
      return (
        <>
          {/* Rising Sun with Rays */}
          <motion.div
            className="absolute top-6 right-6 w-12 h-12"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 30, repeat: Infinity, ease: "linear"
            }}
          >
            <div className="relative w-full h-full">
              {/* Sun rays */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-orange-300/60 rounded-full"
                  style={{
                    top: '-8px',
                    left: '50%',
                    transformOrigin: '50% 32px',
                    transform: `translateX(-50%) rotate(${i * 45}deg)`
                  }}
                />
              ))}
              {/* Sun core */}
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full absolute top-2 left-2 shadow-lg"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4, repeat: Infinity, ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
          
          {/* Morning Mist */}
          <motion.div
            className="absolute bottom-4 left-2 w-16 h-6 bg-white/20 rounded-full blur-sm"
            animate={{
              x: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Dawn Clouds */}
          <motion.div
            className="absolute top-12 left-4 w-8 h-4 bg-pink-200/50 rounded-full"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-1 left-1 w-5 h-2 bg-pink-200/40 rounded-full" />
            <div className="absolute -top-2 right-1 w-4 h-2 bg-pink-200/30 rounded-full" />
          </motion.div>
        </>
      )
    } else if (hour >= 8 && hour < 17) {
      // Day - Bright sun with heat waves and fluffy clouds
      return (
        <>
          {/* Bright Sun with Heat Effect */}
          <motion.div
            className="absolute top-4 right-4 w-14 h-14"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 25, repeat: Infinity, ease: "linear"
            }}
          >
            {/* Heat waves */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-yellow-200/20 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3, repeat: Infinity, ease: "easeInOut"
              }}
            />
            {/* Sun with intense glow */}
            <motion.div
              className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2, repeat: Infinity, ease: "easeInOut"
              }}
            />
          </motion.div>
          
          {/* Fluffy Day Clouds */}
          <motion.div
            className="absolute top-8 left-2 w-10 h-5 bg-white/70 rounded-full shadow-sm"
            animate={{ x: [0, 25, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-2 left-2 w-6 h-3 bg-white/60 rounded-full" />
            <div className="absolute -top-1 right-1 w-5 h-3 bg-white/50 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-16 right-8 w-8 h-4 bg-white/60 rounded-full"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <div className="absolute -top-1 left-1 w-5 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </>
      )
    } else if (hour >= 17 && hour < 20) {
      // Dusk - Setting sun with romantic glow and evening clouds
      return (
        <>
          {/* Setting Sun */}
          <motion.div
            className="absolute bottom-6 left-6 w-16 h-16"
            animate={{
              y: [0, 3, 0]
            }}
            transition={{
              duration: 6, repeat: Infinity, ease: "easeInOut"
            }}
          >
            {/* Sunset glow */}
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-br from-orange-300/30 to-red-300/20 blur-lg"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 8, repeat: Infinity, ease: "easeInOut"
              }}
            />
            {/* Sun core */}
            <motion.div
              className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-xl"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5, repeat: Infinity, ease: "easeInOut"
              }}
            />
          </motion.div>
          
          {/* Evening Clouds with Warm Tint */}
          <motion.div
            className="absolute top-10 right-4 w-12 h-6 bg-orange-200/60 rounded-full"
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-2 left-2 w-7 h-3 bg-orange-200/50 rounded-full" />
            <div className="absolute -top-1 right-1 w-6 h-3 bg-red-200/40 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-18 left-8 w-10 h-5 bg-purple-200/50 rounded-full"
            animate={{ x: [0, 18, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          >
            <div className="absolute -top-1 left-1 w-6 h-3 bg-purple-200/40 rounded-full" />
          </motion.div>
        </>
      )
    } else {
      // Night - Crescent moon, twinkling stars, and dark clouds
      return (
        <>
          {/* Crescent Moon with Glow */}
          <motion.div
            className="absolute top-6 right-6 w-12 h-12"
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 8, repeat: Infinity, ease: "easeInOut"
            }}
          >
            {/* Moon glow */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-yellow-200/20 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 6, repeat: Infinity, ease: "easeInOut"
              }}
            />
            {/* Crescent Moon */}
            <motion.div
              className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full relative overflow-hidden shadow-lg"
              animate={{
                rotate: [0, 15, 0]
              }}
              transition={{
                duration: 10, repeat: Infinity, ease: "easeInOut"
              }}
            >
              <div className="absolute top-1 right-1 w-8 h-8 bg-slate-800 rounded-full" />
            </motion.div>
          </motion.div>
          
          {/* Twinkling Stars - Multiple Sizes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute bg-yellow-200 rounded-full ${
                i % 3 === 0 ? 'w-1.5 h-1.5' : i % 2 === 0 ? 'w-1 h-1' : 'w-0.5 h-0.5'
              }`}
              style={{
                top: `${15 + (i * 9)}%`,
                left: `${8 + (i * 11)}%`,
                filter: 'drop-shadow(0 0 2px rgba(254, 240, 138, 0.8))'
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2 + (i * 0.4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
          
          {/* Shooting Star */}
          <motion.div
            className="absolute top-8 left-4 w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-200 to-transparent rounded-full"
            animate={{
              x: [0, 60],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              repeatDelay: 8
            }}
          />
          
          {/* Dark Night Clouds */}
          <motion.div
            className="absolute top-12 left-6 w-10 h-5 bg-slate-700/50 rounded-full"
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-2 left-2 w-6 h-3 bg-slate-700/40 rounded-full" />
            <div className="absolute -top-1 right-1 w-5 h-3 bg-slate-600/30 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-20 right-10 w-8 h-4 bg-slate-600/40 rounded-full"
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            <div className="absolute -top-1 left-1 w-5 h-2 bg-slate-600/30 rounded-full" />
          </motion.div>
        </>
      )
    }
  }

  // Calculate angles for clock hands
  const secondAngle = time.getSeconds() * 6
  const minuteAngle = time.getMinutes() * 6
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5

  return (
    <div className="bg-white h-full flex flex-col items-center justify-center relative overflow-hidden border border-gray-100 rounded-3xl shadow-lg">
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
          <p className="font-bold text-lg text-center text-gray-800">
            {time.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
          <p className="text-xs font-medium text-center text-gray-600">
            Edinburgh, UK • {getTimeOfDay()}
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-white border border-emerald-200 rounded-xl px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Total Earnings</h3>
          <p className="text-2xl font-bold text-slate-800">${stats.totalIncome.toLocaleString()}</p>
        </motion.div>

        {/* Projects Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Projects Completed</h3>
          <p className="text-2xl font-bold text-slate-800">{stats.completedProjects}</p>
        </motion.div>

        {/* Avg Project Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-slate-600 text-sm font-medium mb-1">Avg Project Value</h3>
          <p className="text-2xl font-bold text-slate-800">${stats.totalProjects > 0 ? Math.round(stats.totalIncome / stats.totalProjects).toLocaleString() : '0'}</p>
        </motion.div>

        {/* Pending Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-white/90 to-orange-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-orange-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white drop-shadow-sm" />
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
          className="bg-gradient-to-br from-white/90 to-emerald-50/30 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">+15%</span>
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
            className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-100/50 hover:shadow-3xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Overview</h2>
                <p className="text-gray-600">Your project performance this month</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">${stats.totalIncome.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Total Earnings</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.3)" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      color: '#374151',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
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
            className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
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
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-white/80 transition-all duration-200 group cursor-pointer border border-transparent hover:border-emerald-200/30"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-50/50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                        {getProjectIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-800 font-medium text-sm truncate">{project.title}</h4>
                        <p className="text-gray-600 text-xs truncate">{project.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-gray-800 font-medium text-sm">${project.budget.toLocaleString()}</p>
                        <p className="text-gray-600 text-xs">{new Date(project.deadline).toLocaleDateString()}</p>
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
                  <p className="text-gray-600">No projects found for {timeFilter} view</p>
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
            className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-100/50 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">My Clients</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
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
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-white/80 transition-all duration-200 group border border-transparent hover:border-emerald-200/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
                        {avatars[index % avatars.length]}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">{clientName}</p>
                        <p className="text-xs text-gray-600">
                          {clientProjects.length} projects • ${totalEarnings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium">
                        {completedCount}/{clientProjects.length}
                      </span>
                      <div className="w-6 h-6 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors">
                        <span className="text-emerald-600 group-hover:text-emerald-700 text-xs">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {getSortedProjects().length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm">No clients for {timeFilter} view</p>
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