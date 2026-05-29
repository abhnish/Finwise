import api from './config';

export const transactionService = {
  // Get all transactions
  getTransactions: async () => {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    const response = await api.post('/api/transactions', transactionData);
    return response.data;
  },

  // Upload bank statement CSV
  uploadStatement: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/transactions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
