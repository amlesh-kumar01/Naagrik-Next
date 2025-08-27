import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import { User } from '@/models'
import { CreateUserData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { username, email, password }: CreateUserData = await request.json()
    
    if (!username || !email || !password) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return Response.json(
        { message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    return Response.json(
      { message: 'User registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
