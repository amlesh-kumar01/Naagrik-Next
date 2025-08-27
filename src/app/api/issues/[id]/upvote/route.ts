import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Issue, User } from '@/models'
import { formatIssueResponse, PopulatedIssue } from '@/lib/mongo-utils'
import { withCors, handleOptions } from '@/lib/cors'

interface Params {
  id: string
}

export const OPTIONS = handleOptions

// POST /api/issues/[id]/upvote - Upvote an issue (public)
export const POST = withCors(async (
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
    
    const issue = await Issue.findByIdAndUpdate(
      params.id,
      { $inc: { upvotes: 1 } },
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
    console.error('Upvote error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
})
