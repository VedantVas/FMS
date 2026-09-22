import * as scheduleService from '../services/scheduleService.js';

export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

export const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const { sourceAirport, destinationAirport, departureTime, arrivalTime } = req.body;
    if (!sourceAirport || !destinationAirport || !departureTime || !arrivalTime) {
      return res.status(400).json({
        message: 'sourceAirport, destinationAirport, departureTime, and arrivalTime are required',
      });
    }
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const updated = await scheduleService.updateSchedule(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};
