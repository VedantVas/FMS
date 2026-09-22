import prisma from '../config/prisma.js';

export const getAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: { bookingDate: 'desc' },
    include: {
      passenger: true,
      scheduledFlight: {
        include: {
          flight: true,
          schedule: true,
        },
      },
    },
  });
};

export const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id: parseInt(id) },
    include: {
      passenger: true,
      scheduledFlight: {
        include: {
          flight: true,
          schedule: true,
        },
      },
    },
  });
};

export const createBooking = async (data) => {
  const scheduledFlightId = parseInt(data.scheduledFlightId);
  const scheduledFlight = await prisma.scheduledFlight.findUnique({
    where: { id: scheduledFlightId },
  });

  if (!scheduledFlight) {
    throw new Error('Scheduled Flight not found');
  }

  if (scheduledFlight.availableSeats <= 0) {
    throw new Error('No available seats on this scheduled flight');
  }

  // Create booking and decrement availableSeats
  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: {
        passengerId: parseInt(data.passengerId),
        scheduledFlightId: scheduledFlightId,
        ticketCost: parseFloat(data.ticketCost) || 250.0,
      },
      include: {
        passenger: true,
        scheduledFlight: {
          include: {
            flight: true,
            schedule: true,
          },
        },
      },
    }),
    prisma.scheduledFlight.update({
      where: { id: scheduledFlightId },
      data: {
        availableSeats: { decrement: 1 },
      },
    }),
  ]);

  return booking;
};

export const deleteBooking = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Cancel booking and increment available seats
  const [deletedBooking] = await prisma.$transaction([
    prisma.booking.delete({
      where: { id: parseInt(id) },
    }),
    prisma.scheduledFlight.update({
      where: { id: booking.scheduledFlightId },
      data: {
        availableSeats: { increment: 1 },
      },
    }),
  ]);

  return deletedBooking;
};
