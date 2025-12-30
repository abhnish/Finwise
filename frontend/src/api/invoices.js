import api from './config';

export const invoiceService = {
  // Get all invoices
  getInvoices: async () => {
    const response = await api.get('/api/invoices');
    return response.data;
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    const response = await api.post('/api/invoices', invoiceData);
    return response.data;
  },

  // Upload invoice PDF
  uploadInvoice: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload/invoice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
