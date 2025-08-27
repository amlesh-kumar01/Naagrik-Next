'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/layout'
import { IssueList } from '@/components/features/issue-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { auth, api } from '@/lib/api'
import { Issue } from '@/types'

// Dynamic import for map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/features/map-component').then(mod => ({ default: mod.MapComponent })),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">Loading map...</div>
  }
)

// Loading components for better UX
const IssueListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
)

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
)

export default function HomePage() {
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    setIsLoggedIn(auth.isLoggedIn())
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedIssues = await api.get<Issue[]>('/issues')
      setIssues(fetchedIssues)
    } catch (error) {
      console.error('Failed to fetch issues:', error)
      setError('Failed to load issues. Please try again.')
      
      // Fallback to empty array instead of mock data for production
      setIssues([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReportIssue = () => {
    if (!isClient) return // Prevent action during SSR
    
    if (isLoggedIn) {
      router.push('/report')
    } else {
      router.push('/login')
    }
  }

  const handleUpvote = async (issueId: string) => {
    if (!isLoggedIn) {
      alert('Please login to upvote')
      return
    }

    try {
      const updatedIssue = await api.post<Issue>(`/issues/${issueId}/upvote`)
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      ))
    } catch (error) {
      console.error('Failed to upvote issue:', error)
      // Fallback to local update
      setIssues(prev => prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, upvotes: issue.upvotes + 1 }
          : issue
      ))
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || issue.category === selectedCategory
    const matchesStatus = !selectedStatus || issue.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(issues.map(issue => issue.category))].sort()
  const statuses = ['Open', 'In Progress', 'Resolved']

  const openIssues = issues.filter(issue => issue.status === 'OPEN').length
  const inProgressIssues = issues.filter(issue => issue.status === 'IN_PROGRESS').length
  const resolvedIssues = issues.filter(issue => issue.status === 'RESOLVED').length

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            NAAGRIK
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Empowering <span className="text-indigo-600 font-semibold">Communities</span> for a Better Tomorrow
          </p>
          <p className="text-gray-500 mb-8">
            Report, track, and resolve local issues together. Your voice, your city, your change.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{openIssues}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{inProgressIssues}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{resolvedIssues}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>

            <Button
              onClick={handleReportIssue}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border-0 gap-3 text-lg"
            >
              <Plus className="w-6 h-6" />
              Report New Issue
            </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center">{error}</p>
              <button 
                onClick={fetchIssues}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mx-auto block"
              >
                Retry
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section - Fixed container with proper height constraints */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>Interactive Map</span>
                  <span className="text-sm text-gray-500 font-normal">
                    Click to report an issue
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[500px] relative">
                  <Suspense fallback={
                    <div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">
                      Loading map...
                    </div>
                  }>
                    <MapComponent
                      issues={filteredIssues}
                      selectedIssue={selectedIssue}
                    />
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            {/* Issues List Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filter & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Issues ({filteredIssues.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  {isLoading ? (
                    <IssueListSkeleton />
                  ) : filteredIssues.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {error ? 'Failed to load issues' : 'No issues found'}
                    </div>
                  ) : (
                    <IssueList
                      issues={filteredIssues}
                      onIssueSelect={setSelectedIssue}
                      selectedIssue={selectedIssue}
                      onUpvote={handleUpvote}
                      isLoading={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
