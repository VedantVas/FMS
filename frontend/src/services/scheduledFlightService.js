import axios from 'axios';

const API = 'http://localhost:5000/api/scheduled-flights';

export const getScheduledFlights = () => axios.get(API);
export const getScheduledFlight = (id) => axios.get(`${API}/${id}`);
export const createScheduledFlight = (data) => axios.post(API, data);
export const updateScheduledFlight = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteScheduledFlight = (id) => axios.delete(`${API}/${id}`);
