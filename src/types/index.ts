import { IUser, IIssue, IComment, Role, IssueStatus, ILocation } from '@/models'

// API Response types (what the frontend receives)
export interface ApiUser {
  id: string
  username: string
  email: string
  role: Role
  avatar?: string
  description?: string
  contact?: string
  issuesReported: number
  issuesResolved: number
  createdAt: string
  updatedAt: string
}

export interface ApiIssue {
  id: string
  title: string
  description: string
  category: string
  photo?: string
  location: ILocation
  status: IssueStatus
  upvotes: number
  createdAt: string
  updatedAt: string
  user: ApiUser
  comments?: ApiComment[]
}

export interface ApiComment {
  id: string
  text: string
  createdAt: string
  user: ApiUser
}

// For compatibility with existing frontend code
export type User = ApiUser & {
  issues?: Issue[]
  comments?: Comment[]
}

export type Issue = ApiIssue & {
  comments?: Comment[]
}

export type Comment = ApiComment & {
  issue?: Issue
}

// Export enums
export { Role, IssueStatus }

// Custom types for API
export interface CreateIssueData {
  title: string
  description: string
  category: string
  location: {
    lat: number
    lng: number
  }
  photo?: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface EmergencyContact {
  title: string
  number: string
  icon: string
  category: 'police' | 'fire' | 'ambulance' | 'women' | 'disaster'
}

export interface AuthorityContact {
  title: string
  number: string
  icon: string
  category: 'municipal' | 'water' | 'electricity' | 'sanitation' | 'publicworks'
}
