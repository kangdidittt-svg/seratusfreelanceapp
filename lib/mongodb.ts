import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Modern TLS configuration for MongoDB Atlas
  tls: true,
  // Retry configuration
  retryWrites: true,
  // Connection timeout
  serverSelectionTimeoutMS: 5000,
  // Socket timeout
  socketTimeoutMS: 45000,
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 5,
  // Additional TLS options for production
  ...(process.env.NODE_ENV === 'production' && {
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  })
};

let client;
let clientPromise: Promise<MongoClient>;

// Enhanced connection function with retry logic
async function connectWithRetry(): Promise<MongoClient> {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const client = new MongoClient(uri, options);
      await client.connect();
      console.log('MongoDB connected successfully');
      return client;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, error);
      
      if (retries >= maxRetries) {
        console.error('Max retries reached. MongoDB connection failed.');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
  
  throw new Error('Failed to connect to MongoDB after maximum retries');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = connectWithRetry();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectWithRetry();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;