const Payments = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payments Module
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page is currently under development
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Gateway</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Integration coming soon</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Transaction History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View all transactions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Analytics and insights</p>
        </div>
      </div>
    </div>
  );
};

export default Payments;