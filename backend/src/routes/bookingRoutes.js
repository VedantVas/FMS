import express from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);

export default router;
