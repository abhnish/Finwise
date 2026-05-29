import React, { useState, useEffect } from 'react';
import { invoiceService } from '../api/invoices';
import StatusBadge from '../components/StatusBadge';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [invoices, searchTerm, statusFilter]);

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error('Fetch invoices error:', err);
    }
  };

  const applyFilters = () => {
    let result = [...invoices];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status?.toLowerCase() === statusFilter);
    }

    // Search term (vendor or invoice number)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(inv => 
        (inv.vendor && inv.vendor.toLowerCase().includes(query)) ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(query)) ||
        (String(inv.id).includes(query))
      );
    }

    setFilteredInvoices(result);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Support both PDFs and common image formats for OCR receipt upload
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF document or a receipt image (PNG/JPG)');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 200);

    try {
      await invoiceService.uploadInvoice(file);
      clearInterval(interval);
      setUploadProgress(100);
      await fetchInvoices(); // Refresh
      event.target.value = ''; // Clear input
    } catch (err) {
      clearInterval(interval);
      setError('Failed to parse and upload receipt/invoice');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Receipts & Invoices</h2>
          <p className="mt-2 text-slate-400 text-sm">
            Upload document files (PDF) or receipt photos (PNG, JPG) to extract metadata via OCR.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl glow-blue">
            <h3 className="text-lg font-bold text-white mb-4">Ingest Document</h3>
            
            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-[#24324F] border-dashed rounded-xl hover:border-blue-500/50 hover:bg-slate-800/10 transition-all cursor-pointer relative group">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <div className="space-y-2 text-center pointer-events-none">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-semibold text-blue-500">Upload receipt file</span>
                </div>
                <p className="text-xs text-slate-500">PDF, PNG, or JPG up to 10MB</p>
              </div>
            </div>

            {isLoading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Uploading & OCR Parsing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#0B0F19] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-950/40 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-400 font-semibold">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search vendor or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0B0F19] border border-[#24324F] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-[#24324F] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="matched">Matched</option>
                  <option value="unmatched">Unmatched</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-[#24324F]/50 overflow-hidden">
              {filteredInvoices.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  {invoices.length === 0 
                    ? 'No invoices uploaded yet. Add a PDF or picture above to get started.'
                    : 'No documents match your query.'}
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stored Documents</h4>
                  {filteredInvoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="p-4 rounded-xl bg-[#101726]/40 border border-[#24324F]/40 hover:border-blue-500/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                          {invoice.invoiceNumber ? (
                            /* PDF Icon */
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            /* Receipt Image Icon */
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {invoice.vendor || 'Unknown Vendor'}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>#{invoice.id}</span>
                            <span>•</span>
                            <span>{formatDate(invoice.date)}</span>
                            {invoice.invoiceNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{invoice.invoiceNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">
                          ${invoice.amount?.toFixed(2)}
                        </div>
                        <div className="mt-1">
                          <StatusBadge status={invoice.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
