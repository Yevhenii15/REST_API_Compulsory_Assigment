import mongoose from "mongoose";

/**
 * Test the connection to the database
 */
export const testConnection = async (): Promise<void> => {
  try {
    await connect();
    await disconnect();
    console.log("✅ Database connection test successful.");
  } catch (error) {
    console.error("❌ Failed to test database connection:", error);
  }
};

/**
 * Connect to the database
 */
export const connect = async (): Promise<void> => {
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
};

/**
 * Disconnect from the database
 */
export const disconnect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing the database connection:", error);
  }
};
