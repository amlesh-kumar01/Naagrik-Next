import mongoose, { Document, Schema } from 'mongoose'

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface ILocation {
  lat: number
  lng: number
}

export interface IIssue extends Document {
  _id: string
  title: string
  description: string
  category: string
  photo?: string
  location: ILocation
  status: IssueStatus
  upvotes: number
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const locationSchema = new Schema<ILocation>({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
}, { _id: false })

const issueSchema = new Schema<IIssue>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  location: {
    type: locationSchema,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(IssueStatus),
    default: IssueStatus.OPEN
  },
  upvotes: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'issues'
})

export const Issue = mongoose.models.Issue || mongoose.model<IIssue>('Issue', issueSchema)
