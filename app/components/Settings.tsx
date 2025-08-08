'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  User, 
  Bell, 
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Globe,
  DollarSign,
  Tag
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



export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string>('')

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    hourlyRate: '0',
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

  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<{index: number, value: string} | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face')
  const [logoUrl, setLogoUrl] = useState('')

  // Load profile data on component mount
  useEffect(() => {
    loadProfile()
    // Load saved photo and logo from localStorage
    const savedPhoto = localStorage.getItem('profilePhoto')
    const savedLogo = localStorage.getItem('logoUrl')
    if (savedPhoto) setProfilePhoto(savedPhoto)
    if (savedLogo) setLogoUrl(savedLogo)
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      } else {
        console.error('Failed to load profile')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePhoto(result)
        // Save to localStorage for persistence
        localStorage.setItem('profilePhoto', result)
        // Dispatch custom event to update TopBar
        window.dispatchEvent(new CustomEvent('profilePhotoChanged', { detail: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoUrl(result)
        // Save to localStorage for persistence
        localStorage.setItem('logoUrl', result)
        // Dispatch custom event to update TopBar
        window.dispatchEvent(new CustomEvent('logoChanged', { detail: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    setSaveError('')
    
    try {
      // Save profile data to API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Also save logo and photo to localStorage (they're already saved on upload)
        // This ensures they persist even after save
        if (logoUrl) {
          localStorage.setItem('logoUrl', logoUrl)
        }
        if (profilePhoto) {
          localStorage.setItem('profilePhoto', profilePhoto)
        }
        
        setSaveMessage('Profile, logo, and photo updated successfully!')
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveError(data.error || 'Failed to save profile')
        // Clear error message after 5 seconds
        setTimeout(() => setSaveError(''), 5000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveError('Network error. Please try again.')
      setTimeout(() => setSaveError(''), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory.trim() })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
        setNewCategory('')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Failed to add category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = async (oldCategory: string, newCategoryValue: string) => {
    if (!newCategoryValue.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldCategory, newCategory: newCategoryValue.trim() })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
        setEditingCategory(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Failed to update category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const confirmDeleteCategory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryToDelete })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
        setShowDeleteModal(false)
        setCategoryToDelete('')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelDeleteCategory = () => {
    setShowDeleteModal(false)
    setCategoryToDelete('')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'categories', label: 'Categories', icon: Tag }
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
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>
        
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: isSaving ? 1 : 1.05 }}
          whileTap={{ scale: isSaving ? 1 : 0.95 }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isSaving 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg shadow-md'
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
        
        {/* Success/Error Messages */}
        {saveMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {saveError}
          </div>
        )}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-64 bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-xl h-fit"
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
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
          className="flex-1 bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/50 shadow-xl"
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={profilePhoto}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <button 
                    onClick={() => document.getElementById('photoUpload')?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg">{profile.name}</h3>
                  <p className="text-gray-600">Freelance Developer</p>
                  <button 
                    onClick={() => document.getElementById('photoUpload')?.click()}
                    className="text-emerald-500 hover:text-emerald-600 text-sm mt-1 transition-colors duration-300"
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <h3 className="text-gray-800 font-semibold text-lg">Studio Logo</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt="Studio Logo"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">No Logo</span>
                      </div>
                    )}
                    <button 
                      onClick={() => document.getElementById('logoUpload')?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-700"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium">Upload Studio Logo</h4>
                    <p className="text-gray-600 text-sm">This will appear in the top bar</p>
                    <button 
                      onClick={() => document.getElementById('logoUpload')?.click()}
                      className="text-emerald-500 hover:text-emerald-600 text-sm mt-1 transition-colors duration-300"
                    >
                      {logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <User className="inline mr-2" size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <Phone className="inline mr-2" size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => handleProfileChange('hourlyRate', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    <Globe className="inline mr-2" size={16} />
                    Currency
                  </label>
                  <select
                    value={profile.currency}
                    onChange={(e) => handleProfileChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  >
                    <option value="USD" className="bg-white">USD - US Dollar</option>
                    <option value="EUR" className="bg-white">EUR - Euro</option>
                    <option value="GBP" className="bg-white">GBP - British Pound</option>
                    <option value="CAD" className="bg-white">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
                  placeholder="Tell clients about yourself..."
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-emerald-50/30 backdrop-blur-sm rounded-xl border border-emerald-200/30">
                    <div>
                      <h3 className="text-gray-800 font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-gray-600 text-sm">
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
                        value ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-200'
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

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Categories</h2>
              
              {/* Add New Category */}
              <div className="bg-gradient-to-r from-white/80 to-emerald-50/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/30">
                <h3 className="text-gray-800 font-medium mb-4">Add New Category</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={isLoading || !newCategory.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                  >
                    {isLoading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="space-y-3">
                <h3 className="text-gray-800 font-medium">Existing Categories</h3>
                {categories.length === 0 ? (
                  <div className="text-gray-600 text-center py-8">
                    No categories yet. Add your first category above.
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-emerald-50/30 backdrop-blur-sm rounded-xl border border-emerald-200/30">
                      {editingCategory?.index === index ? (
                        <div className="flex-1 flex gap-3">
                          <input
                            type="text"
                            value={editingCategory.value}
                            onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditCategory(category, editingCategory.value)
                              } else if (e.key === 'Escape') {
                                setEditingCategory(null)
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleEditCategory(category, editingCategory.value)}
                            disabled={isLoading}
                            className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-800 font-medium">{category}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCategory({ index, value: category })}
                              className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              disabled={isLoading}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Category</h3>
              <p className="text-gray-600 mb-6">
                 Are you sure you want to delete <span className="font-medium text-gray-800">"{categoryToDelete}"</span>?
                 <br />
                 <span className="text-sm">All projects with this category will be moved to "Other".</span>
               </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteCategory}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all duration-300 border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}