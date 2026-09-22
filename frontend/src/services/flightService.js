import axios from 'axios';

const API = 'http://localhost:5000/api/flights';

export const getFlights = () => axios.get(API);
export const getFlight = (id) => axios.get(`${API}/${id}`);
export const createFlight = (data) => axios.post(API, data);
export const updateFlight = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteFlight = (id) => axios.delete(`${API}/${id}`);
