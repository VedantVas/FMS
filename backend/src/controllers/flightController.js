import * as flightService from '../services/flightService.js';

export const getFlights = async (req, res, next) => {
  try {
    const flights = await flightService.getAllFlights();
    res.json(flights);
  } catch (error) {
    next(error);
  }
};

export const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    next(error);
  }
};

export const createFlight = async (req, res, next) => {
  try {
    const { flightNumber, carrierName, flightModel, seatCapacity } = req.body;
    if (!flightNumber || !carrierName || !flightModel || !seatCapacity) {
      return res.status(400).json({
        message: 'All fields (flightNumber, carrierName, flightModel, seatCapacity) are required',
      });
    }

    const flight = await flightService.createFlight(req.body);
    res.status(201).json(flight);
  } catch (error) {
    next(error);
  }
};

export const updateFlight = async (req, res, next) => {
  try {
    const updated = await flightService.updateFlight(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteFlight = async (req, res, next) => {
  try {
    await flightService.deleteFlight(req.params.id);
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    next(error);
  }
};
