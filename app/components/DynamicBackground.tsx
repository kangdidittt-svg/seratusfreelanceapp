'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeOfDay {
  period: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

const timeThemes: Record<string, TimeOfDay> = {
  dawn: {
    period: 'dawn',
    colors: {
      primary: 'from-purple-400 via-pink-300 to-orange-200',
      secondary: 'from-orange-200 to-yellow-100',
      accent: 'bg-orange-300',
      background: 'from-purple-900 via-purple-600 to-orange-300'
    }
  },
  morning: {
    period: 'morning',
    colors: {
      primary: 'from-blue-400 via-cyan-300 to-emerald-200',
      secondary: 'from-yellow-200 to-orange-200',
      accent: 'bg-yellow-400',
      background: 'from-blue-400 via-cyan-200 to-emerald-100'
    }
  },
  noon: {
    period: 'noon',
    colors: {
      primary: 'from-blue-300 via-cyan-200 to-emerald-100',
      secondary: 'from-yellow-300 to-orange-300',
      accent: 'bg-yellow-500',
      background: 'from-blue-300 via-cyan-100 to-white'
    }
  },
  afternoon: {
    period: 'afternoon',
    colors: {
      primary: 'from-orange-300 via-yellow-200 to-emerald-200',
      secondary: 'from-orange-400 to-red-300',
      accent: 'bg-orange-400',
      background: 'from-orange-200 via-yellow-100 to-emerald-50'
    }
  },
  dusk: {
    period: 'dusk',
    colors: {
      primary: 'from-purple-400 via-pink-400 to-orange-400',
      secondary: 'from-red-400 to-purple-400',
      accent: 'bg-orange-500',
      background: 'from-purple-600 via-pink-400 to-orange-300'
    }
  },
  night: {
    period: 'night',
    colors: {
      primary: 'from-indigo-900 via-purple-800 to-blue-900',
      secondary: 'from-purple-900 to-indigo-900',
      accent: 'bg-yellow-200',
      background: 'from-indigo-900 via-purple-900 to-blue-900'
    }
  }
}

function getCurrentTimeTheme(): TimeOfDay {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 7) return timeThemes.dawn
  if (hour >= 7 && hour < 11) return timeThemes.morning
  if (hour >= 11 && hour < 14) return timeThemes.noon
  if (hour >= 14 && hour < 17) return timeThemes.afternoon
  if (hour >= 17 && hour < 19) return timeThemes.dusk
  return timeThemes.night
}

export default function DynamicBackground() {
  const [currentTheme, setCurrentTheme] = useState<TimeOfDay>(getCurrentTimeTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTheme = () => {
      setCurrentTheme(getCurrentTimeTheme())
    }
    
    // Update theme every minute
    const interval = setInterval(updateTheme, 60000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const isNight = currentTheme.period === 'night'
  const isDusk = currentTheme.period === 'dusk'
  const isDawn = currentTheme.period === 'dawn'
  const isDay = ['morning', 'noon', 'afternoon'].includes(currentTheme.period)

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main background gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.colors.background}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Sun */}
      {(isDay || isDawn || isDusk) && (
        <motion.div
          className={`absolute w-20 h-20 ${currentTheme.colors.accent} rounded-full shadow-2xl`}
          style={{
            top: isDawn ? '70%' : isDusk ? '75%' : '20%',
            left: isDawn ? '10%' : isDusk ? '85%' : '80%',
            boxShadow: `0 0 60px ${currentTheme.colors.accent.replace('bg-', '')}`
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      )}
      
      {/* Moon */}
      {isNight && (
        <motion.div
          className="absolute top-20 right-20 w-16 h-16"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <div className="w-full h-full bg-yellow-200 rounded-full shadow-2xl relative">
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-100 rounded-full"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 bg-yellow-100 rounded-full"></div>
          </div>
        </motion.div>
      )}
      
      {/* Stars */}
      {isNight && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <motion.div
                className="w-full h-full bg-white rounded-full"
                animate={{
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Clouds */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute opacity-30`}
            style={{
              top: `${20 + Math.random() * 40}%`,
              left: `${-20 + i * 25}%`,
            }}
            animate={{
              x: [0, window.innerWidth * 1.2]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 3
            }}
          >
            <div className={`w-16 h-8 bg-white/40 rounded-full`}></div>
            <div className={`w-12 h-6 bg-white/30 rounded-full -mt-4 ml-4`}></div>
            <div className={`w-8 h-4 bg-white/20 rounded-full -mt-3 ml-8`}></div>
          </motion.div>
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${isNight ? 'bg-purple-300' : 'bg-emerald-200'} rounded-full opacity-20`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <motion.div
              className="w-full h-full bg-inherit rounded-full"
              animate={{
                x: [-10, 10, -10]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <motion.div
                className="w-full h-full bg-inherit rounded-full"
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}