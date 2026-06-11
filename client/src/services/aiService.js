import api from './api';

const aiService = {
  generateDescription: (data) => api.post('/ai/generate-description', data),
  getRecommendations: (preferences) => api.post('/ai/recommendations', { preferences }),
  chat: (message, conversationHistory) => api.post('/ai/chat', { message, conversationHistory }),
  smartSearch: (query) => api.post('/ai/smart-search', { query }),
};

export default aiService;
