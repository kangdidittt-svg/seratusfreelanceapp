'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  X, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  Tag,
  AlertCircle
} from 'lucide-react'

interface ProjectForm {
  title: string
  client: string
  description: string
  category: string
  budget: string
  deadline: string
  priority: string
  status: string
}

// Categories will be fetched from API

const priorities = ['Low', 'Medium', 'High']
const statuses = ['Pending', 'In Progress', 'Completed']

interface AddProjectProps {
  onClose?: () => void
  onProjectAdded?: () => void
}

export default function AddProject({ onClose, onProjectAdded }: AddProjectProps = {}) {
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    client: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    priority: 'Medium',
    status: 'Pending'
  })

  const [errors, setErrors] = useState<Partial<ProjectForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

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
      // Fallback to default categories
      setCategories([
        'Web Development',
        'Mobile App',
        'UI/UX Design',
        'Branding',
        'Marketing',
        'Consulting',
        'Other'
      ])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<ProjectForm> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required'
    if (!formData.client.trim()) newErrors.client = 'Client name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required'
    if (!formData.deadline) newErrors.deadline = 'Deadline is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        // Reset form on success
        setFormData({
          title: '',
          client: '',
          description: '',
          category: '',
          budget: '',
          deadline: '',
          priority: 'Medium',
          status: 'Pending'
        })
        
        // Show success message (you can add a toast notification here)
        alert('Project created successfully!')
        
        // Call callbacks if provided
        onProjectAdded?.()
        onClose?.()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to create project'}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setFormData({
      title: '',
      client: '',
      description: '',
      category: '',
      budget: '',
      deadline: '',
      priority: 'Medium',
      status: 'Pending'
    })
    setErrors({})
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Add New Project</h1>
        <p className="text-white/60">Create a new project and start tracking your progress</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <FileText className="inline mr-2" size={16} />
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.title ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <User className="inline mr-2" size={16} />
                Client Name *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.client ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Enter client name"
              />
              {errors.client && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.client}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <Tag className="inline mr-2" size={16} />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.category ? 'border-red-500' : 'border-white/20'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority} className="bg-gray-800">
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <DollarSign className="inline mr-2" size={16} />
                Budget *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.budget ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.budget}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Calendar className="inline mr-2" size={16} />
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.deadline ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.deadline && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.deadline}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-white font-medium mb-2">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            >
              {statuses.map(status => (
                <option key={status} value={status} className="bg-gray-800">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading"></div>
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Create Project</span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
              <span>Reset</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          Tips for Better Project Management
        </h3>
        <ul className="text-white/80 space-y-2 text-sm">
          <li>• Be specific with project titles to easily identify them later</li>
          <li>• Set realistic deadlines with some buffer time</li>
          <li>• Choose the appropriate priority level to focus on important projects</li>
          <li>• Add detailed descriptions to avoid confusion later</li>
        </ul>
      </motion.div>
    </div>
  )
}