import api from './api';

const reviewService = {
  getByProperty: (propertyId) => api.get(`/reviews?property=${propertyId}`),
  addReview: (propertyId, data) => api.post(`/reviews/${propertyId}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
