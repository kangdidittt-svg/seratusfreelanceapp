'use client'

import { motion } from 'framer-motion'
import { Bell, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TopBarProps {
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string;
  };
}

export default function TopBar({ user }: TopBarProps) {
  const [logoUrl, setLogoUrl] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face')

  useEffect(() => {
    // Load saved logo and photo from localStorage
    const savedLogo = localStorage.getItem('logoUrl')
    const savedPhoto = localStorage.getItem('profilePhoto')
    if (savedLogo) setLogoUrl(savedLogo)
    if (savedPhoto) setProfilePhoto(savedPhoto)

    // Listen for custom events to update in real-time
    const handleLogoChange = (e: CustomEvent) => {
      setLogoUrl(e.detail)
    }

    const handleProfilePhotoChange = (e: CustomEvent) => {
      setProfilePhoto(e.detail)
    }

    window.addEventListener('logoChanged', handleLogoChange as EventListener)
    window.addEventListener('profilePhotoChanged', handleProfilePhotoChange as EventListener)
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange as EventListener)
      window.removeEventListener('profilePhotoChanged', handleProfilePhotoChange as EventListener)
    }
  }, [])

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-16 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6"
    >
      {/* Studio Logo/Name */}
      <div className="flex-1 max-w-md flex items-center">
        <h1 className="text-2xl font-bold text-white">Seratus Studio</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </motion.button>

        {/* Messages */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <MessageCircle size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
        </motion.button>

        {/* User Profile */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            <span className="text-white font-bold text-xl">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}