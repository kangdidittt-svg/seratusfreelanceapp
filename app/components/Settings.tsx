'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  Globe,
  DollarSign
} from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  hourlyRate: string
  currency: string
  timezone: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  projectUpdates: boolean
  paymentReminders: boolean
  clientMessages: boolean
}

interface PrivacySettings {
  profileVisibility: string
  showEarnings: boolean
  showProjects: boolean
  allowClientReviews: boolean
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Experienced freelance developer specializing in web applications and mobile development.',
    hourlyRate: '75',
    currency: 'USD',
    timezone: 'America/New_York'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    paymentReminders: true,
    clientMessages: true
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEarnings: false,
    showProjects: true,
    allowClientReviews: true
  })

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePrivacyChange = (field: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/60 mt-1">Manage your account preferences and settings</p>
        </div>
        
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: isSaving ? 1 : 1.05 }}
          whileTap={{ scale: isSaving ? 1 : 0.95 }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isSaving 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg'
          } text-white`}
        >
          {isSaving ? (
            <>
              <div className="loading"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-64 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-fit"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{profile.name}</h3>
                  <p className="text-white/60">Freelance Developer</p>
                  <button className="text-purple-400 hover:text-purple-300 text-sm mt-1 transition-colors duration-300">
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <User className="inline mr-2" size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Phone className="inline mr-2" size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => handleProfileChange('hourlyRate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Globe className="inline mr-2" size={16} />
                    Currency
                  </label>
                  <select
                    value={profile.currency}
                    onChange={(e) => handleProfileChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    <option value="USD" className="bg-gray-800">USD - US Dollar</option>
                    <option value="EUR" className="bg-gray-800">EUR - Euro</option>
                    <option value="GBP" className="bg-gray-800">GBP - British Pound</option>
                    <option value="CAD" className="bg-gray-800">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
                  placeholder="Tell clients about yourself..."
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h3 className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'pushNotifications' && 'Receive push notifications on your device'}
                        {key === 'projectUpdates' && 'Get notified about project status changes'}
                        {key === 'paymentReminders' && 'Receive reminders for pending payments'}
                        {key === 'clientMessages' && 'Get notified when clients send messages'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        value ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">Profile Visibility</label>
                  <div className="space-y-2">
                    {['public', 'private', 'clients-only'].map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option}
                          checked={privacy.profileVisibility === option}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 focus:ring-purple-500"
                        />
                        <span className="text-white capitalize">{option.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <h3 className="text-white font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {key === 'showEarnings' && 'Display your earnings publicly'}
                          {key === 'showProjects' && 'Show your project portfolio'}
                          {key === 'allowClientReviews' && 'Allow clients to leave reviews'}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange(key as keyof PrivacySettings, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          value ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Dark', 'Light', 'Auto'].map((theme) => (
                      <div key={theme} className="p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300">
                        <div className="w-full h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3"></div>
                        <p className="text-white font-medium text-center">{theme}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-4">Color Scheme</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      'from-purple-500 to-pink-500',
                      'from-blue-500 to-cyan-500',
                      'from-green-500 to-emerald-500',
                      'from-orange-500 to-red-500'
                    ].map((gradient, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl hover:scale-105 transition-transform duration-300`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}