import * as bookingService from '../services/bookingService.js';

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { passengerId, scheduledFlightId } = req.body;
    if (!passengerId || !scheduledFlightId) {
      return res.status(400).json({ message: 'passengerId and scheduledFlightId are required' });
    }
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
