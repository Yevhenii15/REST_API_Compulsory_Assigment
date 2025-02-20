import mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DBHOST: string;
    }
  }
}

/**
 * Test the connection to the database
 */
export async function testConnection(): Promise<void> {
  try {
    await connect();
    await disconnect();
    console.log("✅ Database connection test successful.");
  } catch (error) {
    console.error("❌ Failed to test database connection:", error);
  }
}

/**
 * Connect to the database
 */
export async function connect(): Promise<void> {
  try {
    if (!process.env.DBHOST) {
      throw new Error("❌ DBHOST environment variable is missing.");
    }
    await mongoose.connect(process.env.DBHOST);

    // Ping the server to check if we have a connection
    const db = mongoose.connection.db;
    if (db) {
      await db.admin().command({ ping: 1 });
      console.log("✅ Successfully connected to the database.");
    } else {
      throw new Error("❌ Database connection could not be established.");
    }
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
  }
}

/**
 * Disconnect from the database
 */
export async function disconnect(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing the database connection:", error);
  }
}
