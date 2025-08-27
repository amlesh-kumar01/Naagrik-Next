import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Issue, User } from '@/models'
import { formatIssueResponse, PopulatedIssue } from '@/lib/mongo-utils'

interface Params {
  id: string
}

// POST /api/issues/[id]/upvote - Upvote an issue (public)
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
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
}
