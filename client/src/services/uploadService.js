import api from './api';

const uploadService = {
  uploadPropertyImages: (formData) =>
    api.post('/upload/property-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadAvatar: (formData) =>
    api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
  uploadPropertyVerification: (propertyId, formData) =>
    api.post(`/upload/property-verification/${propertyId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPropertyVerifications: (propertyId) =>
    api.get(`/upload/property-verification/${propertyId}`),
  deletePropertyVerification: (verificationId) =>
    api.delete(`/upload/property-verification/${verificationId}`),
};

export default uploadService;
