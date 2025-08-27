'use client'

import { Issue } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ThumbsUp, MessageCircle, Calendar, User } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import Image from 'next/image'

interface IssueListProps {
  issues: Issue[]
  onIssueSelect?: (issue: Issue) => void
  selectedIssue?: Issue | null
  onUpvote?: (issueId: string) => void
  isLoading?: boolean
}

export function IssueList({ 
  issues, 
  onIssueSelect, 
  selectedIssue, 
  onUpvote, 
  isLoading = false 
}: IssueListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No issues found</p>
          <p className="text-gray-400 text-sm">Be the first to report an issue in your area</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {issues.map((issue) => (
        <Card 
          key={issue.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedIssue?.id === issue.id ? 'ring-2 ring-indigo-500 shadow-md' : ''
          }`}
          onClick={() => onIssueSelect?.(issue)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {issue.title}
              </h3>
              <div className="flex gap-2 ml-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {issue.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {issue.category}
              </span>
              {issue.location && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {`${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)}`}
                </span>
              )}
            </div>

            {issue.photo && (
              <div className="mb-3">
                <Image 
                  src={issue.photo} 
                  alt={issue.title}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {issue.user.username}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatRelativeTime(issue.createdAt)}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {issue.comments && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {issue.comments.length}
                  </div>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUpvote?.(issue.id)
                  }}
                  className="flex items-center gap-1 p-1 h-auto text-gray-500 hover:text-indigo-600"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {issue.upvotes}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
