'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

const monthlyData = [
  { month: 'January', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'February', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'March', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'April', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'May', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'June', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'July', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'August', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'September', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'October', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'November', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
  { month: 'December', earnings: 0, projects: 0, hours: 0, completionRate: 0, growthRate: 0 },
]

const categoryDataByMonth = {
  'January': [],
  'February': [],
  'March': [],
  'April': [],
  'May': [],
  'June': [],
  'July': [],
  'August': [],
  'September': [],
  'October': [],
  'November': [],
  'December': []
}

const clientDataByMonth = {
  'January': [],
  'February': [],
  'March': [],
  'April': [],
  'May': [],
  'June': [],
  'July': [],
  'August': [],
  'September': [],
  'October': [],
  'November': [],
  'December': []
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981']

export default function MonthlyReport() {
  // Get current date and determine available months
  const currentDate = new Date()
  const currentYear = 2025
  const currentMonth = currentDate.getMonth() // 0-11
  
  // Generate available months from January to current month
  const availableMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ].slice(0, Math.max(1, currentMonth + 1)) // At least show January
  
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[availableMonths.length - 1])
  const [reportType, setReportType] = useState('overview')

  // Get current month data based on selected month
  const getCurrentMonthData = () => {
    const monthData = monthlyData.find(data => data.month === selectedMonth)
    if (monthData) {
      return {
        totalEarnings: monthData.earnings,
        totalProjects: monthData.projects,
        totalHours: monthData.hours,
        avgProjectValue: Math.round(monthData.earnings / monthData.projects),
        completionRate: monthData.completionRate,
        growthRate: monthData.growthRate
      }
    }
    return {
      totalEarnings: 6200,
      totalProjects: 9,
      totalHours: 175,
      avgProjectValue: 689,
      completionRate: 89,
      growthRate: 12.5
    }
  }

  const currentMonthData = getCurrentMonthData()

  // Get category and client data based on selected month
  const categoryData = (categoryDataByMonth as any)[selectedMonth] || []
  const clientData = (clientDataByMonth as any)[selectedMonth] || []

  const handleExport = () => {
    // Create Excel-compatible CSV with only requested data
    const csvLines = [
      // Header
      'Monthly Freelance Report',
      `Month: ${selectedMonth}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      
      // Total Earnings
      'TOTAL EARNINGS',
      'Metric,Value',
      `Total Earnings,$${currentMonthData.totalEarnings.toLocaleString()}`,
      '',
      
      // Projects Completed
      'PROJECTS COMPLETED',
      'Metric,Value',
      `Total Projects,${currentMonthData.totalProjects}`,
      '',
      
      // Category Breakdown
      'CATEGORY BREAKDOWN',
      'Category,Percentage',
      ...categoryData.map((item: any) => `${item.name},${item.value}%`)
    ]

    // Convert to CSV format
    const csvContent = csvLines.join('\n')

    // Create and download Excel file
    const blob = new Blob([csvContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `freelance-report-${selectedMonth.toLowerCase()}-${new Date().getFullYear()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Monthly Report</h1>
          <p className="text-gray-600 mt-1">Analyze your freelance performance and growth</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month} {currentYear}
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:bg-emerald-600"
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold mt-2">${currentMonthData.totalEarnings.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-green-100 text-sm">+{currentMonthData.growthRate}%</span>
              </div>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Projects Completed</p>
              <p className="text-3xl font-bold mt-2">{currentMonthData.totalProjects}</p>
              <div className="flex items-center mt-2">
                <CheckCircle size={16} className="mr-1" />
                <span className="text-emerald-100 text-sm">{currentMonthData.completionRate}% rate</span>
              </div>
            </div>
            <BarChart3 size={32} className="text-emerald-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Hours Worked</p>
              <p className="text-3xl font-bold mt-2">{currentMonthData.totalHours}</p>
              <div className="flex items-center mt-2">
                <Clock size={16} className="mr-1" />
                <span className="text-gray-100 text-sm">This month</span>
              </div>
            </div>
            <Clock size={32} className="text-gray-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Avg Project Value</p>
              <p className="text-3xl font-bold mt-2">${currentMonthData.avgProjectValue}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-emerald-100 text-sm">Per project</span>
              </div>
            </div>
            <DollarSign size={32} className="text-emerald-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Earnings Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" stroke="rgba(0,0,0,0.6)" />
                <YAxis stroke="rgba(0,0,0,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid rgba(0, 0, 0, 0.1)', 
                    borderRadius: '12px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151' }}
                  formatter={(value, name) => [`$${value}`, name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10b981" 
                  fill="url(#colorEarnings)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Project Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid rgba(0, 0, 0, 0.1)', 
                    borderRadius: '12px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-gray-600 text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Client Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">Top Clients Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-600 font-medium py-3">Client</th>
                <th className="text-left text-gray-600 font-medium py-3">Projects</th>
                <th className="text-left text-gray-600 font-medium py-3">Earnings</th>
                <th className="text-left text-gray-600 font-medium py-3">Growth</th>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client: any, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="py-4">
                    <div className="text-gray-800 font-medium">{client.name}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-gray-600">{client.projects}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-gray-600">${client.earnings.toLocaleString()}</div>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center space-x-1 ${
                      client.growth > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {client.growth > 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span>{Math.abs(client.growth)}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-800 font-semibold mb-3">Key Achievements</h4>
            <ul className="text-gray-600 space-y-2">
              <li>• Completed 9 projects with 89% success rate</li>
              <li>• Increased earnings by 12.5% compared to last month</li>
              <li>• Maintained strong client relationships</li>
              <li>• Improved average project value to $689</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-3">Areas for Improvement</h4>
            <ul className="text-gray-600 space-y-2">
              <li>• Focus on higher-value projects</li>
              <li>• Reduce project completion time</li>
              <li>• Expand client base in new industries</li>
              <li>• Implement better time tracking</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}