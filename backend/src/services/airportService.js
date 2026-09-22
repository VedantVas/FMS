import prisma from '../config/prisma.js';

export const getAllAirports = async () => {
  return await prisma.airport.findMany({
    orderBy: { airportCode: 'asc' },
  });
};

export const getAirportById = async (id) => {
  return await prisma.airport.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createAirport = async (data) => {
  return await prisma.airport.create({
    data: {
      airportCode: data.airportCode.toUpperCase(),
      airportName: data.airportName,
      airportLocation: data.airportLocation,
    },
  });
};

export const updateAirport = async (id, data) => {
  return await prisma.airport.update({
    where: { id: parseInt(id) },
    data: {
      airportCode: data.airportCode.toUpperCase(),
      airportName: data.airportName,
      airportLocation: data.airportLocation,
    },
  });
};

export const deleteAirport = async (id) => {
  return await prisma.airport.delete({
    where: { id: parseInt(id) },
  });
};
