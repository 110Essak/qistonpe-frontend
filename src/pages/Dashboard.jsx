import { useMemo } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = ({ setCurrentPage }) => {
  const { invoices } = useInvoices();

  const summary = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalPaidThisMonth = 0;
    let paymentDelays = [];

    invoices.forEach(inv => {
      if (inv.status === 'pending' || inv.status === 'overdue') {
        totalOutstanding += inv.amount;
      }
      if (inv.status === 'overdue') {
        totalOverdue += inv.amount;
      }
      if (inv.paymentDate) {
        const paymentDate = new Date(inv.paymentDate);
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          totalPaidThisMonth += inv.amount;
        }
        const dueDate = new Date(inv.dueDate);
        const delay = Math.floor((paymentDate - dueDate) / (1000 * 60 * 60 * 24));
        paymentDelays.push(delay);
      }
    });

    const avgPaymentDelay = paymentDelays.length > 0
      ? Math.round(paymentDelays.reduce((a, b) => a + b, 0) / paymentDelays.length)
      : 0;

    return {
      totalOutstanding,
      totalOverdue,
      totalPaidThisMonth,
      avgPaymentDelay,
    };
  }, [invoices]);

  const chartData = useMemo(() => {
    const counts = { paid: 0, pending: 0, overdue: 0 };
    invoices.forEach(inv => {
      counts[inv.status]++;
    });
    return [
      { name: 'Paid', value: counts.paid, color: '#10b981' },
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      { name: 'Overdue', value: counts.overdue, color: '#ef4444' },
    ];
  }, [invoices]);

  const barChartData = useMemo(() => {
    const amounts = { paid: 0, pending: 0, overdue: 0 };
    invoices.forEach(inv => {
      amounts[inv.status] += inv.amount;
    });
    return [
      { name: 'Paid', amount: amounts.paid, fill: '#10b981' },
      { name: 'Pending', amount: amounts.pending, fill: '#f59e0b' },
      { name: 'Overdue', amount: amounts.overdue, fill: '#ef4444' },
    ];
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
      .slice(0, 5);
  }, [invoices]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const pending = invoices.filter(i => i.status === 'pending').length;
    const overdue = invoices.filter(i => i.status === 'overdue').length;
    
    return { total, paid, pending, overdue };
  }, [invoices]);

  const SummaryCard = ({ title, value, isAmount = true, gradient, icon, trend }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAmount ? `₹${value.toLocaleString('en-IN')}` : value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
            <span className="font-medium">Welcome back, Essak Dasari</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-sm">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Outstanding" 
          value={summary.totalOutstanding} 
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          icon="💰"
          trend="+2.5%"
        />
        <SummaryCard 
          title="Total Overdue" 
          value={summary.totalOverdue} 
          gradient="bg-gradient-to-br from-red-500 to-red-600"
          icon="⚠️"
          trend="-1.2%"
        />
        <SummaryCard 
          title="Paid (This Month)" 
          value={summary.totalPaidThisMonth} 
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          icon="✅"
          trend="+12.3%"
        />
        <SummaryCard 
          title="Avg Payment Delay" 
          value={`${summary.avgPaymentDelay} days`} 
          isAmount={false}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          icon="📊"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue by Status</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Amount distribution across invoice statuses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Count</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Distribution by status</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Invoices</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest 5 invoices from your records</p>
            </div>
            <button
              onClick={() => setCurrentPage('invoices')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              View All
              <span>→</span>
            </button>
          </div>
          <div className="space-y-3">
            {recentInvoices.map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                    inv.status === 'paid' ? 'bg-green-500' :
                    inv.status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {inv.status === 'paid' ? '✓' : inv.status === 'pending' ? '⏱' : '!'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{inv.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{inv.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">₹{inv.amount.toLocaleString('en-IN')}</p>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mt-1 ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Quick Stats</h3>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Paid Invoices</span>
                <span className="font-bold text-xl">{stats.paid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Pending Invoices</span>
                <span className="font-bold text-xl">{stats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Overdue Invoices</span>
                <span className="font-bold text-xl">{stats.overdue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setCurrentPage('invoices')}
                className="w-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3"
              >
                <span>📄</span>
                <span>Create New Invoice</span>
              </button>
              <button 
                onClick={() => setCurrentPage('invoices')}
                className="w-full bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3"
              >
                <span>💳</span>
                <span>Record Payment</span>
              </button>
              <button 
                onClick={() => setCurrentPage('invoices')}
                className="w-full bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-4 py-3 rounded-lg font-medium transition-colors text-left flex items-center gap-3"
              >
                <span>📊</span>
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;