import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../../Context/ThemeContext';

const MainLayout = ({ role }) => {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">SMS Dashboard</div>
        <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200">
          Theme: {isDark ? 'Dark' : 'Light'}
        </div>
      </div>

      <div className="md:flex md:min-h-screen">
        <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 overflow-auto">
          <div className="hidden md:flex justify-end p-4">
            <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              Theme: {isDark ? 'Dark' : 'Light'}
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;