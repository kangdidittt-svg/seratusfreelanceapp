import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DynamicBackground from './components/DynamicBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Freelance Project Tracker',
  description: 'Modern dashboard for tracking freelance projects and earnings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Dynamic Time-based Background */}
          <DynamicBackground />
          
          {/* Subtle overlay for better content readability */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-5"></div>
          
          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}