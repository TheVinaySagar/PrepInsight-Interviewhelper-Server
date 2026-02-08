import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000', // Local development
  'http://localhost:3001', // Alternative local development
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:3000', // Local IP variant
  "https://www.interviewstories.in",
  "https://interviewstories.in"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS check - Origin:', origin, 'Environment:', process.env.NODE_ENV);
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Allowing whitelisted origin:', origin);
      callback(null, true);
    } else if (origin.includes('.amplifyapp.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      // Allow Amplify preview/branch deployments and local dev
      console.log('CORS: Allowing origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS: Rejecting origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export default cors(corsOptions);
