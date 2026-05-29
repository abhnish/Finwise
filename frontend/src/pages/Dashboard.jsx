import React, { useState, useEffect } from 'react';
import { matchingService } from '../api/matching';
import { invoiceService } from '../api/invoices';
import { transactionService } from '../api/transactions';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchResults, setMatchResults] = useState(null);
  const [threshold, setThreshold] = useState(75);
  
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalTransactions: 0,
    matchedCount: 0,
    unmatchedInvoices: 0,
    unmatchedTransactions: 0,
    reconciliationRate: 0
  });

  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const invoices = await invoiceService.getInvoices();
      const transactions = await transactionService.getTransactions();

      const totalInvoices = invoices.length;
      const totalTransactions = transactions.length;

      const matchedInvoicesCount = invoices.filter(i => i.status === 'matched').length;
      const unmatchedInvoices = invoices.filter(i => i.status !== 'matched').length;
      const unmatchedTransactions = transactions.filter(t => !t.matchedInvoice && !t.matched).length;

      const reconciliationRate = totalInvoices > 0 
        ? Math.round((matchedInvoicesCount / totalInvoices) * 100) 
        : 0;

      setStats({
        totalInvoices,
        totalTransactions,
        matchedCount: matchedInvoicesCount,
        unmatchedInvoices,
        unmatchedTransactions,
        reconciliationRate
      });

      // Extract details for matches
      // Map transactions that are matched
      const matches = transactions
        .filter(t => t.matchedInvoice || t.matched)
        .map(t => ({
          transactionId: t.id,
          invoiceId: t.matchedInvoice,
          description: t.description,
          amount: t.amount,
          matchScore: t.matchScore || 90,
          reason: t.reason || ''
        }));
      setRecentMatches(matches);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to refresh data summaries.');
    }
  };

  const handleRunMatching = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const results = await matchingService.runMatching(threshold);
      setMatchResults(results);
      await loadDashboardData(); // Reload stats and lists
    } catch (err) {
      setError('Failed to run matching process. Please check server.');
      console.error('Matching error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Financial Command Center</h2>
        <p className="mt-2 text-slate-400 text-sm">
          Monitor your transactions and invoices, track matching health, and trigger the reconciliation pipeline.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Reconciliation Rate Card */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-400">Reconciliation Rate</p>
              <p className="mt-2 text-3xl font-extrabold text-white">{stats.reconciliationRate}%</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 relative">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {/* Circular border highlight */}
              <span className="absolute inset-0 rounded-full border-2 border-blue-500/20"></span>
            </div>
          </div>
          <div className="mt-4 w-full bg-[#0B0F19] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${stats.reconciliationRate}%` }}
            />
          </div>
        </div>

        {/* Total Matches */}
        <div className="glass-panel p-6 rounded-2xl hover:border-green-500/30 transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Matches</p>
              <p className="mt-2 text-3xl font-extrabold text-green-400">{stats.matchedCount}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Out of {stats.totalInvoices} invoice(s)</p>
        </div>

        {/* Unmatched Invoices */}
        <div className="glass-panel p-6 rounded-2xl hover:border-yellow-500/30 transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-400">Unmatched Invoices</p>
              <p className="mt-2 text-3xl font-extrabold text-yellow-400">{stats.unmatchedInvoices}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Need PDF uploads or mappings</p>
        </div>

        {/* Unmatched Transactions */}
        <div className="glass-panel p-6 rounded-2xl hover:border-red-500/30 transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-400">Unmatched Bank Txns</p>
              <p className="mt-2 text-3xl font-extrabold text-red-400">{stats.unmatchedTransactions}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Awaiting verification matches</p>
        </div>
      </div>

      {/* Main Grid: Control Panel + Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pipeline Trigger Control */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between glow-blue">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Matching Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Triggers the intelligent scoring engine. The algorithm correlates unmatched bank statements against uploaded invoice receipts based on custom scoring weights:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Amount similarity (50% weight)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Date window (30% weight, 3-day bank delay window)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                <span>Vendor description keyword overlap (20% weight)</span>
              </li>
            </ul>

            {/* Threshold Sensitivity Slider */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Matching Sensitivity</label>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {threshold}% Threshold
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50% (Loose Match)</span>
                <span>100% (Exact Match)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-normal">
                Only matches scoring &ge; {threshold}% will be reconciled. Higher thresholds require closer amounts, dates, and vendor description alignments.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleRunMatching}
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white transition-all ${
                isLoading
                  ? 'bg-blue-800/40 border-blue-500/20 cursor-not-allowed text-slate-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Engine...
                </>
              ) : (
                'Run Matching Engine'
              )}
            </button>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="lg:col-span-8 glass-panel rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#24324F] flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Reconciled Audit Trail</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
              Auto-Reconciled
            </span>
          </div>

          <div className="overflow-x-auto">
            {recentMatches.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No active matches recorded yet. Trigger the matching engine above after uploading bank sheets and receipts.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-[#24324F]">
                <thead className="bg-[#101726]/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Matched Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Invoice Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#24324F]/50">
                  {recentMatches.map((match, index) => (
                    <tr key={index} className="hover:bg-slate-800/10 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-200">
                        <div className="font-semibold">{match.description}</div>
                        <div className="text-xs text-slate-500">Txn #{match.transactionId}</div>
                        {match.reason && (
                          <div className="mt-1 text-xs text-blue-400/80 italic font-medium bg-blue-950/20 border border-blue-500/10 rounded px-2 py-1 inline-block">
                            {match.reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        Invoice #{match.invoiceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        ${match.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                          {match.matchScore}% Confidence
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
