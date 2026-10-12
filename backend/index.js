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

// Read allowed frontend origin from process.env.FRONTEND_URL
const rawFrontendUrl = process.env.FRONTEND_URL;
const envOrigins = rawFrontendUrl
  ? rawFrontendUrl.split(',').map((u) => u.trim().replace(/\/+$/, ''))
  : [];

// Include production Vercel frontend URL, configured environment origins, and local dev origins
const allowedOrigins = Array.from(
  new Set([
    'https://college-management-beta-virid.vercel.app',
    ...envOrigins,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ].filter(Boolean))
);

console.log('🌐 [CORS] Allowed Origins:', allowedOrigins);

// CORS configuration supporting credentials, required methods, and headers
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server, health checks)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    const isAllowed = allowedOrigins.some((allowed) => allowed.replace(/\/+$/, '') === cleanOrigin);

    if (isAllowed) {
      return callback(null, true);
    }

    console.warn(`⚠️ [CORS Blocked] Request origin "${origin}" is not authorized.`);
    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Register CORS middleware before all routes and body parsers
app.use(cors(corsOptions));

// Support JSON and URL-encoded payloads with large image uploads (up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// Centralized error handler for CORS, payload limits, and server errors
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    console.warn('⚠️ [Payload Too Large] Request body exceeded size limit');
    return res.status(413).json({ success: false, message: 'Image payload is too large. Please upload an image under 10MB.' });
  }
  console.error('❌ Server Error:', err.message || err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app };
export default app;
