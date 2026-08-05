// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, BookOpen, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const API_BASE = API_BASE_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 87
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        axios.get(`${API_BASE}/users`, { params: { role: 'student' } }),
        axios.get(`${API_BASE}/users`, { params: { role: 'teacher' } }),
        axios.get(`${API_BASE}/classes`)
      ]);

      setStats({
        totalStudents: studentsRes.data.students?.length || studentsRes.data.length || 0,
        totalTeachers: teachersRes.data.teachers?.length || teachersRes.data.length || 0,
        totalClasses: classesRes.data.classes?.length || classesRes.data.length || 0,
        attendanceRate: 87
      });

      try {
        const recentRes = await axios.get(`${API_BASE}/activity-log`);
        const activityArray = Array.isArray(recentRes.data) ? recentRes.data : recentRes.data.activities || [];
        setRecentActivities(activityArray.map(activity => {
          const userName = activity.user?.fullName || activity.user?.name || 'Unknown user';
          const time = activity.timestamp ? new Date(activity.timestamp).toLocaleString() : '';
          return `${time ? `[${time}] ` : ''}${userName} ${activity.action} ${activity.entity}.`;
        }));
      } catch (activityError) {
        console.warn('Activity log fetch failed:', activityError);
        setRecentActivities(prev => prev.length > 0 ? prev : ['No recent activity available']);
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard Error:", err);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleStorage = (event) => {
      if (event.key === 'lastUserUpdate') {
        fetchDashboardData();
      }
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(fetchDashboardData, 20000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your school management system</p>
        {lastRefreshed && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last refreshed at {lastRefreshed}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Students</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Users size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Teachers</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.totalTeachers}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <UserCheck size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Classes</p>
              <p className="text-4xl font-bold text-violet-600 dark:text-violet-400 mt-2">{stats.totalClasses}</p>
            </div>
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} className="text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>

        
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => window.location.href = '/admin/students'} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-3xl transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
              <Users size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 dark:text-white">Add New Student</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add new record</p>
            </div>
          </button>

          <button onClick={() => window.location.href = '/admin/teachers'} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-3xl transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30">
              <UserCheck size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 dark:text-white">Add New Teacher</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add new record</p>
            </div>
          </button>

          <button onClick={() => window.location.href = '/admin/classes'} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-3xl transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-violet-100 dark:bg-violet-900/30">
              <BookOpen size={28} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 dark:text-white">Create New Class</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add new record</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <Clock size={20} /> Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">{activity}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-8 text-center">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;