import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightRoutes from './routes/flightRoutes.js';
import airportRoutes from './routes/airportRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import scheduledFlightRoutes from './routes/scheduledFlightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flight Management System API is running smoothly' });
});

// REST API Routes
app.use('/api/flights', flightRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/scheduled-flights', scheduledFlightRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
