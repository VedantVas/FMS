import prisma from '../config/prisma.js';

export const getAllScheduledFlights = async () => {
  return await prisma.scheduledFlight.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      flight: true,
      schedule: true,
      bookings: true,
    },
  });
};

export const getScheduledFlightById = async (id) => {
  return await prisma.scheduledFlight.findUnique({
    where: { id: parseInt(id) },
    include: {
      flight: true,
      schedule: true,
      bookings: {
        include: {
          passenger: true,
        },
      },
    },
  });
};

export const createScheduledFlight = async (data) => {
  // Check flight capacity if availableSeats not explicitly provided
  let availableSeats = data.availableSeats !== undefined ? parseInt(data.availableSeats) : null;
  if (availableSeats === null) {
    const flight = await prisma.flight.findUnique({
      where: { id: parseInt(data.flightId) },
    });
    availableSeats = flight ? flight.seatCapacity : 100;
  }

  return await prisma.scheduledFlight.create({
    data: {
      flightId: parseInt(data.flightId),
      scheduleId: parseInt(data.scheduleId),
      availableSeats: availableSeats,
    },
    include: {
      flight: true,
      schedule: true,
    },
  });
};

export const updateScheduledFlight = async (id, data) => {
  return await prisma.scheduledFlight.update({
    where: { id: parseInt(id) },
    data: {
      flightId: data.flightId ? parseInt(data.flightId) : undefined,
      scheduleId: data.scheduleId ? parseInt(data.scheduleId) : undefined,
      availableSeats: data.availableSeats !== undefined ? parseInt(data.availableSeats) : undefined,
    },
    include: {
      flight: true,
      schedule: true,
    },
  });
};

export const deleteScheduledFlight = async (id) => {
  return await prisma.scheduledFlight.delete({
    where: { id: parseInt(id) },
  });
};
