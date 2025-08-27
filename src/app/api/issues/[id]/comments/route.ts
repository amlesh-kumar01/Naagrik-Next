import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Comment, User } from '@/models'
import { verifyToken } from '@/lib/auth'
import { formatCommentResponse, PopulatedComment } from '@/lib/mongo-utils'
import { withCors, handleOptions } from '@/lib/cors'

interface Params {
  id: string
}

export const OPTIONS = handleOptions

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
})
