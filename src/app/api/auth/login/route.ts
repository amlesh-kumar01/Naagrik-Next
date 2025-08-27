import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db'
import { User } from '@/models'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return Response.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
