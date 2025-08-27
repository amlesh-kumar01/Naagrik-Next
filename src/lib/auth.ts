import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { Role } from '@/models'

export interface AuthenticatedUser {
  userId: string
  email: string
  role: Role
}

export function verifyToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser
    return decoded
  } catch (error) {
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    return handler(request, user)
  }
}

export function requireAdmin(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    if (user.role !== Role.ADMIN) {
      return Response.json({ message: 'Admin access required' }, { status: 403 })
    }
    return handler(request, user)
  }
}
