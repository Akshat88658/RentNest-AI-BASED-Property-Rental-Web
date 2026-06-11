const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

// ── Load env vars (resolve from project root) ──
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ── Connect to database ────────────────────────
connectDB();

const app = express();

// ── Security & parsing middleware ───────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate limiting ───────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per window
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

// ── Logging (dev only) ─────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── API Routes ─────────────────────────────────
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/properties', require('./routes/propertyRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/ai', require('./routes/aiRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

// ── Health check ───────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Serve React in production ──────────────────
// Serve React client
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── Error handling ─────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ───────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API base: http://localhost:${PORT}/api/v1`);
  console.log(`❤️  Health:   http://localhost:${PORT}/api/v1/health\n`);
});
