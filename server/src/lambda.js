import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import awsServerlessExpress from 'aws-serverless-express';
import { auth } from './config/firebase.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewsRoutes.js';
import userRoutes from './routes/usersRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Database connection with caching
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // MongoDB connection
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  cachedDb = mongoose;
  return cachedDb;
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
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

// Initialize the AWS server
const server = awsServerlessExpress.createServer(app);

// Handler for AWS Lambda
export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  // Connect to database (uses cached connection if available)
  await connectToDatabase();

  // Pass the request to the Express application
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE');
}
