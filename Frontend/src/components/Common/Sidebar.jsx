import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBook, FaCalendarCheck, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../Context/ThemeContext';

const Sidebar = ({ role, isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  const adminMenu = [
    { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/students', icon: <FaUserGraduate />, label: 'Students' },
    { path: '/admin/teachers', icon: <FaChalkboardTeacher />, label: 'Teachers' },
    { path: '/admin/classes', icon: <FaUsers />, label: 'Classes' },
    { path: '/admin/users', icon: <FaUserPlus />, label: 'Users' },
  ];

  const teacherMenu = [
    { path: '/teacher/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/teacher/classes', icon: <FaUsers />, label: 'My Classes' },
    { path: '/teacher/assignments', icon: <FaCalendarCheck />, label: 'Assignments' },
    { path: '/teacher/students', icon: <FaUserGraduate />, label: 'My Students' },
  ];

  const studentMenu = [
    { path: '/student/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/student/classes', icon: <FaUsers />, label: 'My Classes' },
    { path: '/student/assignments', icon: <FaBook />, label: 'Assignments' },
    { path: '/student/teachers', icon: <FaChalkboardTeacher />, label: 'My Teachers' },
  ];

  let menu = [];
  if (role === 'admin') menu = adminMenu;
  else if (role === 'teacher') menu = teacherMenu;
  else if (role === 'student') menu = studentMenu;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      onClose();
    }
  };

  const { isDark, toggleDarkMode } = useTheme();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto shadow-xl transition-transform duration-300 md:static md:translate-x-0 md:h-auto md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">SMS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">School Management System</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <button
            onClick={() => {
              toggleDarkMode();
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center gap-2 justify-center font-medium cursor-pointer"
            title="Toggle dark mode"
          >
            {isDark ? (
              <>
                <Sun size={20} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <nav className="p-4 flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-xl mb-1 font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
