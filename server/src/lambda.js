const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const awsServerlessExpress = require('aws-serverless-express');
const { auth } = require('./config/firebase');
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');

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
exports.handler = async (event, context) => {
  // Keep the connection alive between invocations
  context.callbackWaitsForEmptyEventLoop = false;

  // Connect to database (uses cached connection if available)
  await connectToDatabase();

  // Pass the request to the Express application
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE');
};
