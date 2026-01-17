import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Admin Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            E
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Essak Dasari</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Administrator</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">essak@qistonpe.com</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Theme Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDark ? 'Dark mode is enabled' : 'Light mode is enabled'}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDark ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className="sr-only">Toggle theme</span>
            <span
              className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ${
                isDark ? 'translate-x-9' : 'translate-x-1'
              }`}
            >
              {isDark ? (
                <span className="text-xs">🌙</span>
              ) : (
                <span className="text-xs">☀️</span>
              )}
            </span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Tip: Your theme preference is automatically saved and will persist across sessions.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Company Information</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company Name</label>
              <p className="text-gray-900 dark:text-white font-medium">QistonPe</p>
            </div>
            <span className="text-2xl">🏢</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Currency</label>
              <p className="text-gray-900 dark:text-white font-medium">INR (₹)</p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Region</label>
              <p className="text-gray-900 dark:text-white font-medium">India</p>
            </div>
            <span className="text-2xl">🇮🇳</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Type</label>
              <p className="text-gray-900 dark:text-white font-medium">MSME Fintech Platform</p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">January 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Environment</span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
              Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;