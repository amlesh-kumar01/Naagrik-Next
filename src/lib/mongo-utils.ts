import mongoose from 'mongoose'

// Utility types for Mongoose documents
export interface MongooseDoc {
  _id: mongoose.Types.ObjectId
  __v: number
  createdAt?: Date
  updatedAt?: Date
}

export interface PopulatedUser {
  _id: mongoose.Types.ObjectId
  username: string
  email?: string
  role?: string
  avatar?: string
}

export interface PopulatedIssue extends MongooseDoc {
  title: string
  description: string
  category: string
  photo?: string
  location: {
    lat: number
    lng: number
  }
  status: string
  upvotes: number
  createdBy: PopulatedUser
}

export interface PopulatedComment extends MongooseDoc {
  text: string
  createdBy: PopulatedUser
  issueId: mongoose.Types.ObjectId
}

// Helper function to convert MongoDB document to API response
export function formatIssueResponse(issue: PopulatedIssue) {
  return {
    ...issue,
    id: issue._id.toString(),
    user: {
      id: issue.createdBy._id.toString(),
      username: issue.createdBy.username,
      email: issue.createdBy.email,
      role: issue.createdBy.role,
      avatar: issue.createdBy.avatar
    }
  }
}

export function formatCommentResponse(comment: PopulatedComment) {
  return {
    ...comment,
    id: comment._id.toString(),
    user: {
      id: comment.createdBy._id.toString(),
      username: comment.createdBy.username,
      avatar: comment.createdBy.avatar
    }
  }
}
