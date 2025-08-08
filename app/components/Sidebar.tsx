'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Home, 
  Plus, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'add-project', icon: Plus, label: 'Add Project' },
  { id: 'projects', icon: FolderOpen, label: 'Project List' },
  { id: 'reports', icon: BarChart3, label: 'Monthly Report' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face')

  useEffect(() => {
    // Load saved photo from localStorage
    const savedPhoto = localStorage.getItem('profilePhoto')
    if (savedPhoto) setProfilePhoto(savedPhoto)

    // Listen for profile photo changes
    const handleProfilePhotoChange = (e: CustomEvent) => {
      setProfilePhoto(e.detail)
    }

    window.addEventListener('profilePhotoChanged', handleProfilePhotoChange as EventListener)
    
    return () => {
      window.removeEventListener('profilePhotoChanged', handleProfilePhotoChange as EventListener)
    }
  }, [])

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-20 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 border-r border-emerald-400/30 shadow-2xl flex flex-col items-center py-6 relative z-20 backdrop-blur-sm"
    >
      {/* Logo/Brand */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
          <span className="text-white font-bold text-xl drop-shadow-lg">F</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-br from-white/30 to-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                size={20} 
                className={`relative z-10 transition-colors duration-300 drop-shadow-sm ${
                  isActive ? 'text-white' : 'group-hover:text-white'
                }`} 
              />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-xl border border-emerald-400/30 backdrop-blur-sm">
                {item.label}
              </div>
            </motion.button>
          )
        })}
        
        {/* Profile Section - moved here after Settings */}
        <div className="space-y-4 pt-4">
          <motion.button
            className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 group border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
          >
            <LogOut size={20} className="drop-shadow-sm" />
            <div className="absolute left-16 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-xl border border-red-400/30 backdrop-blur-sm">
              Logout
            </div>
          </motion.button>
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-lg">
            <Image 
              src={profilePhoto} 
              alt="Profile" 
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </nav>
    </motion.div>
  )
}