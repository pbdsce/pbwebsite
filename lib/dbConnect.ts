import mongoose from "mongoose";
import logger from "@/lib/server/logger";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectMongoDB(): Promise<void> {
  if (connection.isConnected) {
    logger.info(
  { module: "db", state: "already_connected" },
  "MongoDB already connected"
);
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    logger.info(
  { module: "db", state: "connected" },
  "MongoDB connected successfully"
);
  } catch (error) {
    logger.error(
  { module: "db", err: error },
  "MongoDB connection failed"
);
    process.exit(0);
  }
}

export default connectMongoDB;
