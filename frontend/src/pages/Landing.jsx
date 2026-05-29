import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-slate-100 overflow-hidden bg-grid-pattern">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      {/* Header / Brand */}
      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          <span>Fin<span className="text-blue-500">Wise</span></span>
        </Link>
        <div>
          <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#151D30] border border-[#24324F] hover:bg-[#1E2942] hover:border-blue-500/40 text-slate-200 transition-all duration-200">
            Go to App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Automated Invoice &</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Transaction Reconciliation
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              FinWise streamlines your financial operations with intelligent matching between PDF/image invoices and bank transactions. Upload records, run OCR text parsing, and auto-match instantly.
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-150"
              >
                Get Started
              </Link>
              <Link
                to="/invoices"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg text-base font-semibold text-slate-300 bg-[#151D30] border border-[#24324F] hover:bg-[#1E2942] hover:border-slate-600/40 mt-3 sm:mt-0 transition-all duration-150"
              >
                Upload Invoice
              </Link>
            </div>
          </div>

          {/* Visual Presentation Element */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md p-6 glass-panel rounded-2xl glow-blue border-[#24324F] shadow-2xl">
              <div className="absolute top-3 left-3 flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
              </div>
              <div className="mt-6 font-mono text-xs text-slate-400 space-y-3 bg-[#0B0F19] p-4 rounded-xl border border-[#24324F]/60 overflow-hidden">
                <p className="text-blue-400">// Parsing Receipt Image OCR...</p>
                <p>Analyzing text block content...</p>
                <p>Found Keyword: <span className="text-green-400">"AWS"</span></p>
                <p>Extracted Total: <span className="text-green-400">"$150.00"</span></p>
                <p className="text-purple-400">// Running Matching Engine...</p>
                <div className="flex justify-between items-center bg-[#151D30] p-2 rounded border border-blue-500/20 text-white">
                  <span>AWS Invoice ($150)</span>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">90% match</span>
                  <span>AWS Txn ($150)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 border-t border-[#24324F] bg-[#0E1524]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">Core Platform</h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Engineered for absolute accuracy
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 glass-panel rounded-xl hover:border-blue-500/30 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">OCR Receipt Parsing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upload PDFs or receipt images (PNG/JPG). Built-in Tesseract OCR scans text and parses totals, dates, and vendors automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 glass-panel rounded-xl hover:border-blue-500/30 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Reconciliation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Matches transactions to uploaded receipts using fuzzy math constraints (amount margins & date offsets) for maximum accuracy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 glass-panel rounded-xl hover:border-blue-500/30 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Statement Imports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upload bank transaction files directly via CSV format. The parser matches columns automatically to import transaction history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom Section */}
      <div className="relative py-24 text-center z-10 border-t border-[#24324F]">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to automate your reconciliation?
        </h2>
        <p className="mt-4 text-slate-400 max-w-lg mx-auto">
          Start loading your digital statement sheets and invoices to reconcile finances.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all"
          >
            Enter Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
