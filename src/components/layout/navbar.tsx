'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Info, 
  Phone, 
  Shield, 
  MoreHorizontal, 
  LogIn, 
  UserPlus, 
  Settings, 
  LogOut,
  User,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/api'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

const publicNavItems: NavItem[] = [
  { href: '/about', label: 'About', icon: Info },
  { href: '/emergency', label: 'Emergency Contacts', icon: Phone },
  { href: '/authority', label: 'Authority Contacts', icon: Shield },
]

const authNavItems: NavItem[] = [
  { href: '/login', label: 'Login', icon: LogIn },
  { href: '/register', label: 'Register', icon: UserPlus },
]

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<{ username?: string; email?: string; role?: string } | null>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkAuth = () => {
      const loggedIn = auth.isLoggedIn()
      const admin = auth.isAdmin()
      const userData = auth.getUser()
      
      setIsLoggedIn(loggedIn)
      setIsAdmin(admin)
      setUser(userData)
    }

    checkAuth()
    
    // Listen for storage changes to update auth state
    const handleStorageChange = () => checkAuth()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    auth.clearAuth()
    setIsLoggedIn(false)
    setIsAdmin(false)
    setUser(null)
    setShowProfileDropdown(false)
    window.location.href = '/'
  }

  return (
    <>
      {/* Background Art */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
        >
          <ellipse cx="1050" cy="120" rx="260" ry="110" fill="#f59e42" fillOpacity="0.13"/>
          <ellipse cx="300" cy="700" rx="320" ry="140" fill="#6366f1" fillOpacity="0.10"/>
          <ellipse cx="600" cy="200" rx="180" ry="80" fill="#6366f1" fillOpacity="0.08"/>
        </svg>
      </div>

      <nav className="relative z-50 flex items-center justify-center gap-8 px-6 py-4 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 rounded-b-3xl">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl font-black text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          Naagrik
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6">
          {publicNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/report">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Report Issue
                </Button>
              </Link>
              
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Admin
                      </Button>
                </Link>
              )}
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  {user?.username}
                </Button>
                
                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {authNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      size="sm" 
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>
      
      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  )
}
