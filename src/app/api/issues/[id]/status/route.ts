import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Issue, User, IssueStatus } from '@/models'
import { verifyToken } from '@/lib/auth'
import { formatIssueResponse, PopulatedIssue } from '@/lib/mongo-utils'
import { withCors, handleOptions } from '@/lib/cors'

interface Params {
  id: string
}

export const OPTIONS = handleOptions

// PUT /api/issues/[id]/status - Update issue status (admin only)
export const PUT = withCors(async (
  request: NextRequest,
  context?: { params: Params }
) => {
  if (!context?.params) {
    return Response.json(
      { message: 'Invalid request parameters' },
      { status: 400 }
    )
  }
  
  const { params } = context
  
  try {
    await connectDB()
    
    // Check authentication and admin role
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return Response.json({ message: 'Admin access required' }, { status: 403 })
    }
    
    const { status } = await request.json()
    
    if (!Object.values(IssueStatus).includes(status)) {
      return Response.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    const issue = await Issue.findByIdAndUpdate(
      params.id,
      { status: status as IssueStatus },
      { new: true }
    ).populate({
      path: 'createdBy',
      model: User,
      select: 'username email role avatar'
    }).lean() as PopulatedIssue | null

    if (!issue) {
      return Response.json(
        { message: 'Issue not found' },
        { status: 404 }
      )
    }

    const responseIssue = formatIssueResponse(issue)

    return Response.json(responseIssue)
  } catch (error) {
    console.error('Update status error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
})

// DELETE /api/issues/[id]/status - Delete issue (admin only)
export const DELETE = withCors(async (
  request: NextRequest,
  context?: { params: Params }
) => {
  if (!context?.params) {
    return Response.json(
      { message: 'Invalid request parameters' },
      { status: 400 }
    )
  }
  
  const { params } = context
  
  try {
    await connectDB()
    
    // Check authentication and admin role
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return Response.json({ message: 'Admin access required' }, { status: 403 })
    }
    
    const issue = await Issue.findByIdAndDelete(params.id)
    
    if (!issue) {
      return Response.json(
        { message: 'Issue not found' },
        { status: 404 }
      )
    }

    return Response.json({ message: 'Issue deleted' })
  } catch (error) {
    console.error('Delete issue error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
})
