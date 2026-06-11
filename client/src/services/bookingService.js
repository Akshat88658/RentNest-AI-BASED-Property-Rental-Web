import api from './api';

const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export default bookingService;
