import prisma from '../config/prisma.js';

export const getAllFlights = async () => {
  return await prisma.flight.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getFlightById = async (id) => {
  return await prisma.flight.findUnique({
    where: { id: parseInt(id) },
    include: {
      scheduledFlights: {
        include: {
          schedule: true,
        },
      },
    },
  });
};

export const createFlight = async (flightData) => {
  return await prisma.flight.create({
    data: {
      flightNumber: flightData.flightNumber,
      carrierName: flightData.carrierName,
      flightModel: flightData.flightModel,
      seatCapacity: parseInt(flightData.seatCapacity),
    },
  });
};

export const updateFlight = async (id, flightData) => {
  return await prisma.flight.update({
    where: { id: parseInt(id) },
    data: {
      flightNumber: flightData.flightNumber,
      carrierName: flightData.carrierName,
      flightModel: flightData.flightModel,
      seatCapacity: parseInt(flightData.seatCapacity),
    },
  });
};

export const deleteFlight = async (id) => {
  return await prisma.flight.delete({
    where: { id: parseInt(id) },
  });
};
