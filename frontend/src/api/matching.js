import api from './config';

export const matchingService = {
  // Run matching process
  runMatching: async () => {
    const response = await api.post('/api/match');
    return response.data;
  },
};
