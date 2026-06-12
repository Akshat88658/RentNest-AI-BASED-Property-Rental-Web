import api from './api';

const propertyService = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getMyListings: () => api.get('/properties/my-listings'),
  getMyProperties: () => api.get('/properties/my-listings'),
};

export default propertyService;
