import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Comment, User } from '@/models'
import { verifyToken } from '@/lib/auth'
import { formatCommentResponse, PopulatedComment } from '@/lib/mongo-utils'

interface Params {
  id: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB()
    
    const { text } = await request.json()
    
    if (!text) {
      return Response.json(
        { message: 'Comment text required' },
        { status: 400 }
      )
    }

    const user = verifyToken(request)
    if (!user) {
      return Response.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const comment = await Comment.create({
      text: text,
      issueId: params.id,
      createdBy: user.userId
    })

    const populatedComment = await Comment.findById(comment._id)
      .populate({
        path: 'createdBy',
        model: User,
        select: 'username avatar'
      })
      .lean() as PopulatedComment | null

    if (!populatedComment) {
      return Response.json(
        { message: 'Failed to create comment' },
        { status: 500 }
      )
    }

    const responseComment = formatCommentResponse(populatedComment)
    
    return Response.json(responseComment, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
