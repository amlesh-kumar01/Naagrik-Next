import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// In development, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache | undefined
}

const cached: MongooseCache = globalForMongoose.mongoose ?? { conn: null, promise: null }

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
