import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

const generateInitialInvoices = () => {
  const customers = [
    { name: 'Rajesh Kumar', company: 'Kumar Textiles Pvt Ltd' },
    { name: 'Priya Sharma', company: 'Sharma Manufacturing' },
    { name: 'Amit Patel', company: 'Patel Trading Co' },
    { name: 'Sneha Reddy', company: 'Reddy Steel Industries' },
    { name: 'Vikram Singh', company: 'Singh Exports Ltd' },
    { name: 'Anita Desai', company: 'Desai Garments' },
    { name: 'Suresh Nair', company: 'Nair Electronics' },
    { name: 'Kavita Gupta', company: 'Gupta Food Processing' },
    { name: 'Rahul Verma', company: 'Verma Logistics' },
    { name: 'Deepa Iyer', company: 'Iyer Pharmaceuticals' }
  ];

  const invoices = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const customer = customers[i];
    const invoiceDate = new Date(today);
    invoiceDate.setDate(today.getDate() - Math.floor(Math.random() * 60));
    
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(invoiceDate.getDate() + paymentTerms);
    
    let paymentDate = null;
    const isPaid = Math.random() > 0.5;
    if (isPaid) {
      paymentDate = new Date(dueDate);
      paymentDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 20) - 10);
    }

    invoices.push({
      id: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      customerName: customer.name,
      companyName: customer.company,
      amount: Math.floor(Math.random() * 200000) + 10000,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      paymentTerms,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
    });
  }

  return invoices;
};

const calculateStatus = (invoice) => {
  if (invoice.paymentDate) return 'paid';
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  return dueDate < today ? 'overdue' : 'pending';
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('qistonpe-invoices');
    if (saved) {
      return JSON.parse(saved);
    }
    return generateInitialInvoices();
  });

  useEffect(() => {
    localStorage.setItem('qistonpe-invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = useCallback((invoice) => {
    const newId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const dueDate = new Date(invoice.invoiceDate);
    dueDate.setDate(dueDate.getDate() + invoice.paymentTerms);
    
    setInvoices(prev => [...prev, {
      ...invoice,
      id: newId,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate: null,
    }]);
  }, [invoices.length]);

  const updateInvoice = useCallback((id, updates) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const updated = { ...inv, ...updates };
        if (updates.invoiceDate || updates.paymentTerms) {
          const dueDate = new Date(updated.invoiceDate);
          dueDate.setDate(dueDate.getDate() + updated.paymentTerms);
          updated.dueDate = dueDate.toISOString().split('T')[0];
        }
        return updated;
      }
      return inv;
    }));
  }, []);

  const deleteInvoice = useCallback((id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const markAsPaid = useCallback((id, paymentDate = new Date().toISOString().split('T')[0]) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === id ? { ...inv, paymentDate } : inv
    ));
  }, []);

  const bulkMarkAsPaid = useCallback((ids, paymentDate = new Date().toISOString().split('T')[0]) => {
    setInvoices(prev => prev.map(inv =>
      ids.includes(inv.id) ? { ...inv, paymentDate } : inv
    ));
  }, []);

  const invoicesWithStatus = useMemo(() => {
    return invoices.map(inv => ({
      ...inv,
      status: calculateStatus(inv)
    }));
  }, [invoices]);

  const value = {
    invoices: invoicesWithStatus,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    bulkMarkAsPaid,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};