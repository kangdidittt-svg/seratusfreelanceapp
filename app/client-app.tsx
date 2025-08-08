'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './components/Dashboard'
import ProjectList from './components/ProjectList'
import AddProject from './components/AddProject'
import MonthlyReport from './components/MonthlyReport'
import Settings from './components/Settings'
import Login from './components/Login'
import EditProject from './components/EditProject'

interface User {
  id: string
  username: string
  email?: string
  role: string
}

interface Project {
  _id: string
  title: string
  client: string
  status: 'Pending' | 'In Progress' | 'On Hold' | 'Completed'
  deadline: string
  budget: number
  progress: number
  description: string
  category: string
  priority: string
  paid: number
}

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const handleProjectAdded = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('projects')
  }

  // Check if user is authenticated on component mount
  useEffect(() => {
    checkAuth()
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Try to create admin user if it doesn't exist
      await fetch('/api/auth/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.log('Setup completed or user already exists')
    } finally {
      setIsInitialized(true)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleProjectUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
    setEditingProject(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectList 
            key={refreshTrigger} 
            onEditProject={setEditingProject}
            onAddProject={() => setActiveTab('add-project')}
          />
        )
      case 'add-project':
        return <AddProject onProjectAdded={handleProjectAdded} />
      case 'reports':
        return <MonthlyReport />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard key={refreshTrigger} />
    }
  }

  // Show loading spinner while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Show dashboard if user is authenticated
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar user={user} />
        
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Edit Project Modal */}
        {editingProject && (
          <EditProject
            projectId={editingProject._id}
            onClose={() => setEditingProject(null)}
            onProjectUpdated={handleProjectUpdated}
          />
        )}
      </div>
    </div>
  )
}