import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  _id: string
  text: string
  createdBy: mongoose.Types.ObjectId
  issueId: mongoose.Types.ObjectId
  createdAt: Date
}

const commentSchema = new Schema<IComment>({
  text: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueId: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  }
}, {
  timestamps: true,
  collection: 'comments'
})

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema)
