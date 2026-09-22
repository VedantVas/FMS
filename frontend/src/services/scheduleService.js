import axios from 'axios';

const API = 'http://localhost:5000/api/schedules';

export const getSchedules = () => axios.get(API);
export const getSchedule = (id) => axios.get(`${API}/${id}`);
export const createSchedule = (data) => axios.post(API, data);
export const updateSchedule = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteSchedule = (id) => axios.delete(`${API}/${id}`);
