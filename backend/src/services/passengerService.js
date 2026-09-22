import prisma from '../config/prisma.js';

export const getAllPassengers = async () => {
  return await prisma.passenger.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      bookings: true,
    },
  });
};

export const getPassengerById = async (id) => {
  return await prisma.passenger.findUnique({
    where: { id: parseInt(id) },
    include: {
      bookings: {
        include: {
          scheduledFlight: {
            include: {
              flight: true,
              schedule: true,
            },
          },
        },
      },
    },
  });
};

export const createPassenger = async (data) => {
  return await prisma.passenger.create({
    data: {
      pnrNumber: data.pnrNumber || `PNR${Date.now().toString().slice(-6)}`,
      passengerName: data.passengerName,
      passengerAge: parseInt(data.passengerAge),
      passengerUIN: data.passengerUIN,
      luggage: data.luggage ? parseFloat(data.luggage) : 0.0,
    },
  });
};

export const updatePassenger = async (id, data) => {
  return await prisma.passenger.update({
    where: { id: parseInt(id) },
    data: {
      pnrNumber: data.pnrNumber,
      passengerName: data.passengerName,
      passengerAge: parseInt(data.passengerAge),
      passengerUIN: data.passengerUIN,
      luggage: data.luggage !== undefined ? parseFloat(data.luggage) : undefined,
    },
  });
};

export const deletePassenger = async (id) => {
  return await prisma.passenger.delete({
    where: { id: parseInt(id) },
  });
};
