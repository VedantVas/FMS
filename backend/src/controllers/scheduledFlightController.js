import * as scheduledFlightService from '../services/scheduledFlightService.js';

export const getScheduledFlights = async (req, res, next) => {
  try {
    const scheduledFlights = await scheduledFlightService.getAllScheduledFlights();
    res.json(scheduledFlights);
  } catch (error) {
    next(error);
  }
};

export const getScheduledFlightById = async (req, res, next) => {
  try {
    const flight = await scheduledFlightService.getScheduledFlightById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Scheduled flight not found' });
    }
    res.json(flight);
  } catch (error) {
    next(error);
  }
};

export const createScheduledFlight = async (req, res, next) => {
  try {
    const { flightId, scheduleId } = req.body;
    if (!flightId || !scheduleId) {
      return res.status(400).json({ message: 'flightId and scheduleId are required' });
    }
    const created = await scheduledFlightService.createScheduledFlight(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateScheduledFlight = async (req, res, next) => {
  try {
    const updated = await scheduledFlightService.updateScheduledFlight(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteScheduledFlight = async (req, res, next) => {
  try {
    await scheduledFlightService.deleteScheduledFlight(req.params.id);
    res.json({ message: 'Scheduled flight deleted successfully' });
  } catch (error) {
    next(error);
  }
};
