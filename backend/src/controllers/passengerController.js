import * as passengerService from '../services/passengerService.js';

export const getPassengers = async (req, res, next) => {
  try {
    const passengers = await passengerService.getAllPassengers();
    res.json(passengers);
  } catch (error) {
    next(error);
  }
};

export const getPassengerById = async (req, res, next) => {
  try {
    const passenger = await passengerService.getPassengerById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (error) {
    next(error);
  }
};

export const createPassenger = async (req, res, next) => {
  try {
    const { passengerName, passengerAge, passengerUIN } = req.body;
    if (!passengerName || !passengerAge || !passengerUIN) {
      return res.status(400).json({ message: 'passengerName, passengerAge, and passengerUIN are required' });
    }
    const passenger = await passengerService.createPassenger(req.body);
    res.status(201).json(passenger);
  } catch (error) {
    next(error);
  }
};

export const updatePassenger = async (req, res, next) => {
  try {
    const updated = await passengerService.updatePassenger(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePassenger = async (req, res, next) => {
  try {
    await passengerService.deletePassenger(req.params.id);
    res.json({ message: 'Passenger deleted successfully' });
  } catch (error) {
    next(error);
  }
};
