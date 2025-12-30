import React, { useState } from 'react';
import { matchingService } from '../api/matching';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [error, setError] = useState('');

  const handleRunMatching = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const results = await matchingService.runMatching();
      setMatchResults(results);
    } catch (err) {
      setError('Failed to run matching process. Please try again.');
      console.error('Matching error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Dashboard</h2>
        
        <div className="mb-8">
          <button
            onClick={handleRunMatching}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Running Matching...' : 'Run Matching'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {matchResults && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-md font-medium text-gray-900 mb-4">Match Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm font-medium text-green-800">Total Matches</p>
                <p className="text-2xl font-bold text-green-900">
                  {matchResults.totalMatches || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm font-medium text-blue-800">Invoices Processed</p>
                <p className="text-2xl font-bold text-blue-900">
                  {matchResults.invoicesProcessed || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <p className="text-sm font-medium text-yellow-800">Unmatched Items</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {matchResults.unmatchedItems || 0}
                </p>
              </div>
            </div>
            
            {matchResults.details && matchResults.details.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Matches</h4>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matchResults.details.slice(0, 5).map((match, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {match.invoiceId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {match.transactionId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${match.amount?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Matched
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
