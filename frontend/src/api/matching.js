import api from './config';

export const matchingService = {
  // Run matching process
  runMatching: async (threshold) => {
    const response = await api.post('/api/match', { threshold });
    return response.data;
  },
};
