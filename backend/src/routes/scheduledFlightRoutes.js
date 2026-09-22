import express from 'express';
import {
  getScheduledFlights,
  getScheduledFlightById,
  createScheduledFlight,
  updateScheduledFlight,
  deleteScheduledFlight,
} from '../controllers/scheduledFlightController.js';

const router = express.Router();

router.get('/', getScheduledFlights);
router.get('/:id', getScheduledFlightById);
router.post('/', createScheduledFlight);
router.put('/:id', updateScheduledFlight);
router.delete('/:id', deleteScheduledFlight);

export default router;
