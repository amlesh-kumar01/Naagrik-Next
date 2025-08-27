import mongoose, { Document, Schema } from 'mongoose'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
  role: Role
  avatar?: string
  description?: string
  contact?: string
  issuesReported: number
  issuesResolved: number
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
  },
  avatar: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  contact: {
    type: String,
    required: false
  },
  issuesReported: {
    type: Number,
    default: 0
  },
  issuesResolved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'users'
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
