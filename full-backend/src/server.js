import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import vehiclesRoutes from './routes/vehicles.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import hostsRoutes from './routes/hosts.routes.js';
import authRoutes from './routes/auth.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import contactRoutes from './routes/contact.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import specsRoutes from './routes/specs.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { db } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend applications
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-user-role']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan('dev'));

// API Root & Health Check
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await db.execute('SELECT 1 as is_alive');
    res.json({
      status: 'ok',
      service: 'Vahan.Rentals Backend API',
      database: 'Turso DB (LibSQL) Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      service: 'Vahan.Rentals Backend API',
      database_error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Mount Routes
app.use('/api/vehicles', specsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/hosts', hostsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Vahan.Rentals Backend is running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Database: Turso Cloud DB (LibSQL)`);
  console.log(`🔥 Auth: Firebase Auth & Admin SDK`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another process.`);
    console.error(`👉 You can free port ${PORT} by running: npx kill-port ${PORT}`);
    console.error(`👉 Or specify a different port in full-backend/.env (e.g. PORT=5002)\n`);
    process.exit(1);
  } else {
    console.error('❌ Server startup error:', err);
  }
});

export default app;
