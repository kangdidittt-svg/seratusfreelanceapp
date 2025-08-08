import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

// Dynamic import for DynamicBackground to avoid SSR issues
const DynamicBackground = dynamic(() => import('./components/DynamicBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
})

// Dynamic import for the client app to avoid framer-motion SSR issues
const ClientApp = dynamic(() => import('./client-app'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
})

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
            <ClientApp />
          </div>
        </div>
      </body>
    </html>
  )
}