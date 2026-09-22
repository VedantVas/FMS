import axios from 'axios';

const API = 'http://localhost:5000/api/passengers';

export const getPassengers = () => axios.get(API);
export const getPassenger = (id) => axios.get(`${API}/${id}`);
export const createPassenger = (data) => axios.post(API, data);
export const updatePassenger = (id, data) => axios.put(`${API}/${id}`, data);
export const deletePassenger = (id) => axios.delete(`${API}/${id}`);
