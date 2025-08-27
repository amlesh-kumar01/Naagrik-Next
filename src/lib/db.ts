import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local')
}

let isConnected = false

async function connectDB(): Promise<void> {
  // Check if already connected
  if (isConnected) {
    return
  }

  // Check mongoose connection state
  if (mongoose.connection.readyState >= 1) {
    isConnected = true
    return
  }

  try {
    const opts = {
      bufferCommands: false,
    }

    await mongoose.connect(MONGODB_URI!, opts)
    isConnected = true
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully')
      isConnected = true
    })

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
      isConnected = false
    })

  } catch (error) {
    console.error('MongoDB connection failed:', error)
    isConnected = false
    throw error
  }
}

export default connectDB
