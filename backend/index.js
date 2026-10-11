import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';

// Load environment variables if .env file exists (gracefully continues without .env on Render)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration - read allowed frontend URL from environment variable
const FRONTEND_URL = process.env.FRONTEND_URL;
const allowedOrigins = FRONTEND_URL
  ? [
      ...FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, '')),
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ]
  : '*';

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not set in environment variables! Server cannot connect to MongoDB.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running and connected to DB' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app };
export default app;
