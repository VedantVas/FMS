import prisma from '../config/prisma.js';

export const getAllSchedules = async () => {
  return await prisma.schedule.findMany({
    orderBy: { departureTime: 'asc' },
    include: {
      scheduledFlights: {
        include: {
          flight: true,
        },
      },
    },
  });
};

export const getScheduleById = async (id) => {
  return await prisma.schedule.findUnique({
    where: { id: parseInt(id) },
    include: {
      scheduledFlights: {
        include: {
          flight: true,
          bookings: true,
        },
      },
    },
  });
};

export const createSchedule = async (data) => {
  return await prisma.schedule.create({
    data: {
      sourceAirport: data.sourceAirport,
      destinationAirport: data.destinationAirport,
      departureTime: new Date(data.departureTime),
      arrivalTime: new Date(data.arrivalTime),
    },
  });
};

export const updateSchedule = async (id, data) => {
  return await prisma.schedule.update({
    where: { id: parseInt(id) },
    data: {
      sourceAirport: data.sourceAirport,
      destinationAirport: data.destinationAirport,
      departureTime: data.departureTime ? new Date(data.departureTime) : undefined,
      arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : undefined,
    },
  });
};

export const deleteSchedule = async (id) => {
  return await prisma.schedule.delete({
    where: { id: parseInt(id) },
  });
};
