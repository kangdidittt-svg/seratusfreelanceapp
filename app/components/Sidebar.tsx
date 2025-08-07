'use client'

import { motion } from 'framer-motion'
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
  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-20 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col items-center py-6 relative z-20"
    >
      {/* Logo/Brand */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
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
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                size={20} 
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'group-hover:text-white'
                }`} 
              />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-black/80 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                {item.label}
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto space-y-4">
        <motion.button
          className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
        >
          <LogOut size={20} />
          <div className="absolute left-16 bg-black/80 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            Logout
          </div>
        </motion.button>
        
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  )
}