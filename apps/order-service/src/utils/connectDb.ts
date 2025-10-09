// src/db/index.ts

import { orderPrisma } from "@repo/db";


/**
 * Connect to the database and handle lifecycle events.
 */
export async function connectOrderDB() {
  try {
    await orderPrisma.$connect();
    console.log("🟢 Connected to SQLite database successfully.");
  } catch (error) {
    console.error("🔴 Failed to connect to SQLite database:", error);
    throw error;
  }
}

/**
 * Gracefully disconnect from the database on shutdown.
 */
export async function disconnectOrderDB() {
  try {
    await orderPrisma.$disconnect();
    console.log("🟡 Disconnected from SQLite database.");
  } catch (error) {
    console.error("🔴 Error disconnecting from SQLite database:", error);
  }
}
