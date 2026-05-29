import React, { useState, useEffect } from 'react';
import { transactionService } from '../api/transactions';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Form states
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('');
  
  // CSV Upload states
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transaction logs.');
      console.error('Fetch transactions error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!formDescription || !formAmount) return;

    try {
      await transactionService.createTransaction({
        description: formDescription,
        amount: parseFloat(formAmount),
        date: new Date(formDate),
        category: formCategory || 'Uncategorized'
      });
      setIsAddModalOpen(false);
      resetForm();
      await fetchTransactions(); // Reload
    } catch (err) {
      setError('Failed to manually insert transaction.');
      console.error(err);
    }
  };

  const handleCsvUploadSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setUploadProgress(20);
    try {
      await transactionService.uploadStatement(csvFile);
      setUploadProgress(100);
      setIsUploadModalOpen(false);
      setCsvFile(null);
      await fetchTransactions(); // Reload
    } catch (err) {
      setError('Failed to parse bank statement CSV.');
      console.error(err);
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const resetForm = () => {
    setFormDescription('');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryStyles = (category) => {
    switch (category?.toLowerCase()) {
      case 'software':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'infrastructure':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'meals':
      case 'dining':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'travel':
      case 'transport':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'entertainment':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Bank Transactions</h2>
          <p className="mt-2 text-slate-400 text-sm">
            Review matching status, add records manually, or upload CSV bank statements.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-[#24324F] bg-[#151D30] hover:bg-[#1E2942] hover:border-blue-500/40 text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-all"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Transactions list card */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-[#24324F] flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Statement Logs</h3>
          <button 
            onClick={fetchTransactions} 
            disabled={isLoading}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
          >
            <svg className={`h-4.5 w-4.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 6H16" />
            </svg>
            <span>Reload</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#24324F]">
            <thead className="bg-[#101726]/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24324F]/50">
              {isLoading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-sm text-slate-400">Loading ledger records...</p>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm">
                    No transactions found. Add a record manually or upload a CSV bank statement above.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-400">
                      #{txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-100 font-medium">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getCategoryStyles(txn.category)}`}>
                        {txn.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <span className={txn.amount < 0 ? 'text-red-400' : 'text-green-400'}>
                        {txn.amount < 0 ? '-' : ''}${Math.abs(txn.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        txn.matched 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {txn.matched ? 'Matched' : 'Unmatched'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add Transaction Manual Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl glow-blue bg-[#151D30] border-[#24324F] shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-6">Create Ledger Log</h3>

            <form onSubmit={handleAddTransactionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Web Services"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-[#24324F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="150.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-[#24324F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Software"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-[#24324F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-[#24324F] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 border border-[#24324F] hover:bg-slate-700 text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Import CSV Statement Sheet */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl glow-blue bg-[#151D30] border-[#24324F] shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Import Statement CSV</h3>
            <p className="text-xs text-slate-400 mb-6">
              Upload standard banking export tables. Column headers (Date, Description, Amount, Category) will be auto-matched.
            </p>

            <form onSubmit={handleCsvUploadSubmit} className="space-y-4">
              <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-[#24324F] border-dashed rounded-xl hover:border-blue-500/50 hover:bg-slate-800/10 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  required
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                />
                <div className="space-y-2 text-center pointer-events-none">
                  <div className="mx-auto h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold text-blue-500">
                      {csvFile ? csvFile.name : 'Select statement CSV file'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Excel / Standard CSV exports</p>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Importing ledger rows...</span>
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

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 border border-[#24324F] hover:bg-slate-700 text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!csvFile}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all ${
                    !csvFile
                      ? 'bg-slate-800 border border-[#24324F] text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                  }`}
                >
                  Start Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
