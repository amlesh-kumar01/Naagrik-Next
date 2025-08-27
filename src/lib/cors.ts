import { NextRequest, NextResponse } from 'next/server'

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
}

export function corsHeaders(origin?: string) {
  // Check if origin is allowed
  const isOriginAllowed = !origin || 
    corsOptions.origin.includes(origin) || 
    corsOptions.origin.includes('*')

  return {
    'Access-Control-Allow-Origin': isOriginAllowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': corsOptions.methods.join(', '),
    'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': corsOptions.credentials.toString(),
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

export function handleCors(request: NextRequest) {
  const origin = request.headers.get('origin')
  return corsHeaders(origin || undefined)
}

// Handle preflight OPTIONS requests
export function handleOptions(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: handleCors(request),
  })
}

// Wrapper function for API routes
export function withCors<T = Record<string, unknown>>(
  handler: (request: NextRequest, context?: T) => Promise<Response>
) {
  return async (request: NextRequest, context?: T) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request)
    }

    try {
      // Execute the original handler
      const response = await handler(request, context)
      
      // Add CORS headers to the response
      const corsHeadersObj = handleCors(request)
      Object.entries(corsHeadersObj).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } catch (error) {
      // Handle errors with CORS headers
      const errorResponse = new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...handleCors(request)
          }
        }
      )
      return errorResponse
    }
  }
}
