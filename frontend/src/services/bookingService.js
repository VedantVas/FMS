import axios from 'axios';

const API = 'http://localhost:5000/api/bookings';

export const getBookings = () => axios.get(API);
export const getBooking = (id) => axios.get(`${API}/${id}`);
export const createBooking = (data) => axios.post(API, data);
export const deleteBooking = (id) => axios.delete(`${API}/${id}`);
