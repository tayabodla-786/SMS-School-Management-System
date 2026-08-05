// src/pages/Teacher/Dashboard.jsx
import { FaUsers, FaBook, FaCalendarAlt } from 'react-icons/fa';

const TeacherDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome Back, Teacher!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Here's your today's overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Classes Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">My Classes</p>
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mt-4">4</p>
            </div>
            <FaUsers className="text-6xl text-blue-100 dark:text-blue-900/30" />
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Today's Attendance</p>
              <p className="text-5xl font-bold text-green-600 dark:text-green-400 mt-4">87%</p>
            </div>
            <FaCalendarAlt className="text-6xl text-green-100 dark:text-green-900/30" />
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Subjects</p>
              <p className="text-5xl font-bold text-purple-600 dark:text-purple-400 mt-4">5</p>
            </div>
            <FaBook className="text-6xl text-purple-100 dark:text-purple-900/30" />
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left">
            <p className="font-semibold text-gray-800 dark:text-white">Create Assignment</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign MCQs to a student</p>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left">
            <p className="font-semibold text-gray-800 dark:text-white">View My Classes</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check student list</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;