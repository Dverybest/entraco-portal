import mongoose from "mongoose";

declare global {
  // TypeScript doesn't allow attaching properties to global directly, so we declare it explicitly.
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Check if the mongoose instance is already cached
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, use the cached connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise is pending, create a new connection and store the promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  // Await the promise and store the connection in the cache
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
