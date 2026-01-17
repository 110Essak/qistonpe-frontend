import { useState, useMemo, useCallback } from 'react';
import { useInvoices } from '../context/InvoiceContext';

const Invoices = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid, bulkMarkAsPaid } = useInvoices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('invoiceDate');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    amount: '',
    invoiceDate: '',
    paymentTerms: 30,
  });

  const itemsPerPage = 10;

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inv =>
        inv.id.toLowerCase().includes(term) ||
        inv.customerName.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'invoiceDate') {
        return new Date(b.invoiceDate) - new Date(a.invoiceDate);
      } else if (sortBy === 'dueDate') {
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });

    return result;
  }, [invoices, searchTerm, statusFilter, sortBy]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedInvoices.slice(start, start + itemsPerPage);
  }, [filteredAndSortedInvoices, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage);

  const getDaysInfo = useCallback((invoice) => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    if (invoice.status === 'paid') {
      const paymentDate = new Date(invoice.paymentDate);
      const delay = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
      if (delay > 0) return { text: `Paid ${delay} days late`, color: 'text-orange-600 dark:text-orange-400' };
      if (delay < 0) return { text: `Paid ${Math.abs(delay)} days early`, color: 'text-green-600 dark:text-green-400' };
      return { text: 'Paid on time', color: 'text-green-600 dark:text-green-400' };
    } else if (invoice.status === 'overdue') {
      return { text: `Overdue by ${Math.abs(diff)} days`, color: 'text-red-600 dark:text-red-400' };
    } else {
      return { text: `Due in ${diff} days`, color: 'text-gray-600 dark:text-gray-400' };
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.companyName || !formData.amount || !formData.invoiceDate) {
      alert('Please fill all required fields');
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be positive');
      return;
    }

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } else {
      addInvoice({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }

    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      customerName: '',
      companyName: '',
      amount: '',
      invoiceDate: '',
      paymentTerms: 30,
    });
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      companyName: invoice.companyName,
      amount: invoice.amount,
      invoiceDate: invoice.invoiceDate,
      paymentTerms: invoice.paymentTerms,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  const handleMarkAsUnpaid = (id) => {
    updateInvoice(id, { paymentDate: null });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(paginatedInvoices.filter(inv => inv.status !== 'paid').map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkMarkAsPaid = () => {
    if (selectedInvoices.length === 0) {
      alert('Please select invoices to mark as paid');
      return;
    }
    bulkMarkAsPaid(selectedInvoices);
    setSelectedInvoices([]);
  };

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Customer Name', 'Company Name', 'Invoice Date', 'Due Date', 'Amount', 'Status', 'Payment Date'];
    const rows = filteredAndSortedInvoices.map(inv => [
      inv.id,
      inv.customerName,
      inv.companyName,
      inv.invoiceDate,
      inv.dueDate,
      inv.amount,
      inv.status,
      inv.paymentDate || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <button
          onClick={() => {
            setEditingInvoice(null);
            setFormData({
              customerName: '',
              companyName: '',
              amount: '',
              invoiceDate: '',
              paymentTerms: 30,
            });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
        >
          + Add Invoice
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by invoice # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="invoiceDate">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>

          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            📥 Export CSV
          </button>
        </div>

        {selectedInvoices.length > 0 && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={handleBulkMarkAsPaid}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              ✓ Mark {selectedInvoices.length} as Paid
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedInvoices.length === paginatedInvoices.filter(inv => inv.status !== 'paid').length && paginatedInvoices.filter(inv => inv.status !== 'paid').length > 0}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Invoice #</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Company</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Due Date</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Days Info</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map(inv => {
                const daysInfo = getDaysInfo(inv);
                return (
                  <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4">
                      {inv.status !== 'paid' && (
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(inv.id)}
                          onChange={() => handleSelectInvoice(inv.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{inv.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{inv.customerName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{inv.companyName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{inv.invoiceDate}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{inv.dueDate}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm font-medium ${daysInfo.color}`}>{daysInfo.text}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {inv.status === 'paid' ? (
                          <button
                            onClick={() => handleMarkAsUnpaid(inv.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Mark Unpaid
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsPaid(inv.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(inv)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No invoices found
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingInvoice ? 'Edit Invoice' : 'Add New Invoice'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Terms *
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value={7}>7 days</option>
                  <option value={15}>15 days</option>
                  <option value={30}>30 days</option>
                  <option value={45}>45 days</option>
                  <option value={60}>60 days</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                >
                  {editingInvoice ? 'Update' : 'Add'} Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInvoice(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;