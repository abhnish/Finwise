import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/invoices', label: 'Invoices' },
    { path: '/transactions', label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] bg-grid-pattern text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#151D30]/80 backdrop-blur-md border-b border-[#24324F] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center w-full justify-between">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
                  <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>Fin<span className="text-blue-500">Wise</span></span>
                </Link>
              </div>

              {/* Nav Links */}
              <div className="flex space-x-1 sm:space-x-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-blue-600/10 border border-blue-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-[#24324F] bg-[#0E1524] py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} FinWise. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
