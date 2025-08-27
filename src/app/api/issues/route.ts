import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Issue, User, Comment } from '@/models'
import { requireAuth } from '@/lib/auth'
import { CreateIssueData } from '@/types'
import { formatIssueResponse, formatCommentResponse, PopulatedIssue, PopulatedComment } from '@/lib/mongo-utils'

// GET /api/issues - Get all issues
export async function GET() {
  try {
    await connectDB()
    
    const issues = await Issue.find()
      .populate({
        path: 'createdBy',
        model: User,
        select: 'username email role avatar'
      })
      .sort({ createdAt: -1 })
      .lean() as PopulatedIssue[]

    // Get comments for each issue
    const issuesWithComments = await Promise.all(
      issues.map(async (issue) => {
        const comments = await Comment.find({ issueId: issue._id })
          .populate({
            path: 'createdBy',
            model: User,
            select: 'username avatar'
          })
          .sort({ createdAt: -1 })
          .lean() as PopulatedComment[]

        return {
          ...formatIssueResponse(issue),
          comments: comments.map(comment => formatCommentResponse(comment))
        }
      })
    )

    return Response.json(issuesWithComments)
  } catch (error) {
    console.error('Fetch issues error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/issues - Create new issue (authenticated)
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    await connectDB()
    
    const data: CreateIssueData = await request.json()
    
    if (!data.title || !data.description || !data.category || !data.location) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const issue = await Issue.create({
      title: data.title,
      description: data.description,
      category: data.category,
      photo: data.photo,
      location: {
        lat: data.location.lat,
        lng: data.location.lng
      },
      createdBy: user.userId,
    })

    const populatedIssue = await Issue.findById(issue._id)
      .populate({
        path: 'createdBy',
        model: User,
        select: 'username email role avatar'
      })
      .lean() as PopulatedIssue | null

    if (!populatedIssue) {
      return Response.json(
        { message: 'Failed to create issue' },
        { status: 500 }
      )
    }

    const responseIssue = formatIssueResponse(populatedIssue)

    return Response.json(responseIssue, { status: 201 })
  } catch (error) {
    console.error('Create issue error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
})
