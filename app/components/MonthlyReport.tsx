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
  { month: 'January', earnings: 4200, projects: 5, hours: 120, completionRate: 85, growthRate: 8.5 },
  { month: 'February', earnings: 3800, projects: 4, hours: 110, completionRate: 82, growthRate: -5.2 },
  { month: 'March', earnings: 5200, projects: 7, hours: 145, completionRate: 91, growthRate: 15.8 },
  { month: 'April', earnings: 4600, projects: 6, hours: 130, completionRate: 88, growthRate: -2.1 },
  { month: 'May', earnings: 5800, projects: 8, hours: 160, completionRate: 93, growthRate: 12.3 },
  { month: 'June', earnings: 6200, projects: 9, hours: 175, completionRate: 89, growthRate: 12.5 },
]

const categoryDataByMonth = {
  'January': [
    { name: 'Web Development', value: 40, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 30, color: '#06b6d4' },
    { name: 'Branding', value: 15, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 10, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#10b981' },
  ],
  'February': [
    { name: 'Web Development', value: 35, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 25, color: '#06b6d4' },
    { name: 'Branding', value: 20, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#10b981' },
  ],
  'March': [
    { name: 'Web Development', value: 50, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 20, color: '#06b6d4' },
    { name: 'Branding', value: 15, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 10, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#10b981' },
  ],
  'April': [
    { name: 'Web Development', value: 42, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 28, color: '#06b6d4' },
    { name: 'Branding', value: 18, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 8, color: '#ef4444' },
    { name: 'Other', value: 4, color: '#10b981' },
  ],
  'May': [
    { name: 'Web Development', value: 48, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 22, color: '#06b6d4' },
    { name: 'Branding', value: 15, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 12, color: '#ef4444' },
    { name: 'Other', value: 3, color: '#10b981' },
  ],
  'June': [
    { name: 'Web Development', value: 45, color: '#8b5cf6' },
    { name: 'UI/UX Design', value: 25, color: '#06b6d4' },
    { name: 'Branding', value: 15, color: '#f59e0b' },
    { name: 'Mobile Apps', value: 10, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#10b981' },
  ]
}

const clientDataByMonth = {
  'January': [
    { name: 'TechCorp Inc.', projects: 6, earnings: 10500, growth: 12 },
    { name: 'StartupXYZ', projects: 4, earnings: 7200, growth: -8 },
    { name: 'Creative Agency', projects: 5, earnings: 8800, growth: 18 },
    { name: 'DataCorp', projects: 3, earnings: 5500, growth: 5 },
    { name: 'Personal Clients', projects: 10, earnings: 12200, growth: 28 },
  ],
  'February': [
    { name: 'TechCorp Inc.', projects: 5, earnings: 9500, growth: 8 },
    { name: 'StartupXYZ', projects: 3, earnings: 6200, growth: -12 },
    { name: 'Creative Agency', projects: 4, earnings: 7800, growth: 15 },
    { name: 'DataCorp', projects: 3, earnings: 5200, growth: 2 },
    { name: 'Personal Clients', projects: 9, earnings: 11500, growth: 25 },
  ],
  'March': [
    { name: 'TechCorp Inc.', projects: 9, earnings: 13500, growth: 18 },
    { name: 'StartupXYZ', projects: 6, earnings: 9200, growth: -2 },
    { name: 'Creative Agency', projects: 7, earnings: 10800, growth: 25 },
    { name: 'DataCorp', projects: 5, earnings: 7500, growth: 12 },
    { name: 'Personal Clients', projects: 14, earnings: 16200, growth: 38 },
  ],
  'April': [
    { name: 'TechCorp Inc.', projects: 7, earnings: 11500, growth: 10 },
    { name: 'StartupXYZ', projects: 4, earnings: 7800, growth: -6 },
    { name: 'Creative Agency', projects: 6, earnings: 9300, growth: 20 },
    { name: 'DataCorp', projects: 4, earnings: 6200, growth: 6 },
    { name: 'Personal Clients', projects: 11, earnings: 13800, growth: 30 },
  ],
  'May': [
    { name: 'TechCorp Inc.', projects: 10, earnings: 14500, growth: 20 },
    { name: 'StartupXYZ', projects: 6, earnings: 9800, growth: 2 },
    { name: 'Creative Agency', projects: 8, earnings: 11800, growth: 28 },
    { name: 'DataCorp', projects: 5, earnings: 7800, growth: 15 },
    { name: 'Personal Clients', projects: 15, earnings: 18200, growth: 42 },
  ],
  'June': [
    { name: 'TechCorp Inc.', projects: 8, earnings: 12500, growth: 15 },
    { name: 'StartupXYZ', projects: 5, earnings: 8200, growth: -5 },
    { name: 'Creative Agency', projects: 6, earnings: 9800, growth: 22 },
    { name: 'DataCorp', projects: 4, earnings: 6500, growth: 8 },
    { name: 'Personal Clients', projects: 12, earnings: 15200, growth: 35 },
  ]
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981']

export default function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState('June')
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
  const categoryData = (categoryDataByMonth as any)[selectedMonth] || categoryDataByMonth['June']
  const clientData = (clientDataByMonth as any)[selectedMonth] || clientDataByMonth['June']

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
          <h1 className="text-3xl font-bold text-white">Monthly Report</h1>
          <p className="text-white/60 mt-1">Analyze your freelance performance and growth</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="January">January 2024</option>
            <option value="February">February 2024</option>
            <option value="March">March 2024</option>
            <option value="April">April 2024</option>
            <option value="May">May 2024</option>
            <option value="June">June 2024</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
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
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Projects Completed</p>
              <p className="text-3xl font-bold mt-2">{currentMonthData.totalProjects}</p>
              <div className="flex items-center mt-2">
                <CheckCircle size={16} className="mr-1" />
                <span className="text-blue-100 text-sm">{currentMonthData.completionRate}% rate</span>
              </div>
            </div>
            <BarChart3 size={32} className="text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Hours Worked</p>
              <p className="text-3xl font-bold mt-2">{currentMonthData.totalHours}</p>
              <div className="flex items-center mt-2">
                <Clock size={16} className="mr-1" />
                <span className="text-purple-100 text-sm">This month</span>
              </div>
            </div>
            <Clock size={32} className="text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Project Value</p>
              <p className="text-3xl font-bold mt-2">${currentMonthData.avgProjectValue}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-orange-100 text-sm">Per project</span>
              </div>
            </div>
            <DollarSign size={32} className="text-orange-200" />
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
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Earnings Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#8b5cf6" 
                  fill="url(#colorEarnings)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
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
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6">Project Categories</h3>
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
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                  labelStyle={{ color: 'white' }}
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
                <span className="text-white/80 text-sm">{category.name}</span>
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
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top Clients Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/80 font-medium py-3">Client</th>
                <th className="text-left text-white/80 font-medium py-3">Projects</th>
                <th className="text-left text-white/80 font-medium py-3">Earnings</th>
                <th className="text-left text-white/80 font-medium py-3">Growth</th>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client: any, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors duration-300"
                >
                  <td className="py-4">
                    <div className="text-white font-medium">{client.name}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-white/80">{client.projects}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-white/80">${client.earnings.toLocaleString()}</div>
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
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Key Achievements</h4>
            <ul className="text-white/80 space-y-2">
              <li>• Completed 9 projects with 89% success rate</li>
              <li>• Increased earnings by 12.5% compared to last month</li>
              <li>• Maintained strong client relationships</li>
              <li>• Improved average project value to $689</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Areas for Improvement</h4>
            <ul className="text-white/80 space-y-2">
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