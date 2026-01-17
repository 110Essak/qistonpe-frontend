import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <ThemeProvider>
      <InvoiceProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="flex">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="flex-1 ml-64">
              <div className="p-8">
                {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
                {currentPage === 'invoices' && <Invoices />}
                {currentPage === 'payments' && <Payments />}
                {currentPage === 'settings' && <Settings />}
              </div>
            </main>
          </div>
        </div>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;