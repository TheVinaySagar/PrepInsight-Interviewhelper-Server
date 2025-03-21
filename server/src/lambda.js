import awsServerlessExpress from "aws-serverless-express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import { auth } from "./config/firebase.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewsRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database connection caching
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("✅ Connected to MongoDB");
  cachedDb = mongoose;
  return cachedDb;
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Create AWS Serverless Express Server
const server = awsServerlessExpress.createServer(app);

// ✅ Properly handle promise
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  return new Promise((resolve, reject) => {
    awsServerlessExpress.proxy(server, event, {
      succeed: resolve,
      fail: reject,
    });
  });
};
