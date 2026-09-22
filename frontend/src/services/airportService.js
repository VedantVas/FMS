import axios from 'axios';

const API = 'http://localhost:5000/api/airports';

export const getAirports = () => axios.get(API);
export const getAirport = (id) => axios.get(`${API}/${id}`);
export const createAirport = (data) => axios.post(API, data);
export const updateAirport = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteAirport = (id) => axios.delete(`${API}/${id}`);
