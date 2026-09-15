import mongoose from "mongoose";
import dns from "dns";

// 1. Configure reliable public DNS servers & IPv4 order to prevent SRV timeouts on Windows/ISP DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Fallback silently if environment restricts custom DNS servers
}

const DIRECT_SEED_LIST_URI =
  "mongodb://developingwithshubham_db_user:xwzSNFVC9ihwYYRP@ac-56wmk2x-shard-00-00.ajo8787.mongodb.net:27017,ac-56wmk2x-shard-00-01.ajo8787.mongodb.net:27017,ac-56wmk2x-shard-00-02.ajo8787.mongodb.net:27017/bidsetu?ssl=true&replicaSet=atlas-munp4g-shard-0&authSource=admin&retryWrites=true&w=majority";

const MONGODB_URI = process.env.MONGODB_URI || DIRECT_SEED_LIST_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "bidsetu";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully to database: ${MONGODB_DB_NAME}`);
        return mongooseInstance;
      })
      .catch(async (err) => {
        console.warn(`[MongoDB] Primary connection attempt failed (${err.message || err}). Attempting direct seed list fallback...`);
        try {
          const fallbackInstance = await mongoose.connect(DIRECT_SEED_LIST_URI, opts);
          console.log(`[MongoDB] Direct seed list connected successfully to database: ${MONGODB_DB_NAME}`);
          return fallbackInstance;
        } catch (fallbackErr: any) {
          console.error("[MongoDB] Connection error:", fallbackErr.message || fallbackErr);
          cached.promise = null;
          throw fallbackErr;
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
