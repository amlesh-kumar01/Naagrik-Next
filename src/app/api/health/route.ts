import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB()
    
    // Simple health check query
    await User.countDocuments()
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'naagrik-api'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
