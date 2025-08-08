'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  X, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  Tag,
  AlertCircle,
  CheckCircle
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

interface EditProjectProps {
  projectId: string
  onClose: () => void
  onProjectUpdated: () => void
}

export default function EditProject({ projectId, onClose, onProjectUpdated }: EditProjectProps) {
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
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        const project = data.project
        setFormData({
          title: project.title || '',
          client: project.client || '',
          description: project.description || '',
          category: project.category || '',
          budget: project.budget?.toString() || '',
          deadline: project.deadline ? project.deadline.split('T')[0] : '',
          priority: project.priority || 'Medium',
          status: project.status || 'Pending'
        })
      } else {
        alert('Failed to load project data')
        onClose()
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Failed to load project data')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }, [projectId, onClose])

  useEffect(() => {
    fetchProject()
    fetchCategories()
  }, [projectId, fetchProject])

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
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          onProjectUpdated()
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to update project'}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/50 shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-800">Loading project data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/50 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
            <p className="text-gray-600">Update project information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/80 hover:bg-emerald-50 rounded-xl transition-colors duration-200 border border-emerald-200/50"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title & Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                <FileText className="inline mr-2" size={16} />
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.title ? 'border-red-500' : 'border-emerald-300/50'
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
              <label className="block text-gray-800 font-medium mb-2">
                <User className="inline mr-2" size={16} />
                Client Name *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.client ? 'border-red-500' : 'border-emerald-300/50'
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
            <label className="block text-gray-800 font-medium mb-2">
              <FileText className="inline mr-2" size={16} />
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                <Tag className="inline mr-2" size={16} />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.category ? 'border-red-500' : 'border-emerald-300/50'
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
              <label className="block text-gray-800 font-medium mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
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
              <label className="block text-gray-800 font-medium mb-2">
                <DollarSign className="inline mr-2" size={16} />
                Budget *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.budget ? 'border-red-500' : 'border-emerald-300/50'
                }`}
                placeholder="Enter budget amount"
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
              <label className="block text-gray-800 font-medium mb-2">
                <Calendar className="inline mr-2" size={16} />
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                  errors.deadline ? 'border-red-500' : 'border-emerald-300/50'
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
            <label className="block text-gray-800 font-medium mb-2">
              Project Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-300/50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
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
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading"></div>
                  <span>Updating Project...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Project</span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white/80 hover:bg-emerald-50 text-gray-800 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200/50"
            >
              <X size={20} />
              <span>Cancel</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-white/90 to-emerald-50/20 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200/50 shadow-xl max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Project Updated Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your project has been updated and saved.
              </p>
              <div className="w-full bg-emerald-100 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}