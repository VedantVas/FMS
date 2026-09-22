import * as airportService from '../services/airportService.js';

export const getAirports = async (req, res, next) => {
  try {
    const airports = await airportService.getAllAirports();
    res.json(airports);
  } catch (error) {
    next(error);
  }
};

export const getAirportById = async (req, res, next) => {
  try {
    const airport = await airportService.getAirportById(req.params.id);
    if (!airport) {
      return res.status(404).json({ message: 'Airport not found' });
    }
    res.json(airport);
  } catch (error) {
    next(error);
  }
};

export const createAirport = async (req, res, next) => {
  try {
    const { airportCode, airportName, airportLocation } = req.body;
    if (!airportCode || !airportName || !airportLocation) {
      return res.status(400).json({ message: 'airportCode, airportName, and airportLocation are required' });
    }
    const airport = await airportService.createAirport(req.body);
    res.status(201).json(airport);
  } catch (error) {
    next(error);
  }
};

export const updateAirport = async (req, res, next) => {
  try {
    const updated = await airportService.updateAirport(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteAirport = async (req, res, next) => {
  try {
    await airportService.deleteAirport(req.params.id);
    res.json({ message: 'Airport deleted successfully' });
  } catch (error) {
    next(error);
  }
};
