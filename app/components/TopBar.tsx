'use client'

import { motion } from 'framer-motion'
import { Search, Bell, MessageCircle } from 'lucide-react'

interface TopBarProps {
  user?: {
    id: string;
    username: string;
    email?: string;
    role: string;
  };
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-16 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Search projects, clients..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>
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
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="text-right">
            <p className="text-white font-medium text-sm">{user?.username || 'User'}</p>
            <p className="text-white/60 text-xs capitalize">{user?.role || 'User'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            <span className="text-white text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}