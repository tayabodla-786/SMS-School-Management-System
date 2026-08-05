import React from 'react';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back, Student 👋</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your academic overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Current Class", value: "Class 10 - A", icon: BookOpen, color: "blue" },
          { title: "Teachers", value: "8", icon: Users, color: "purple" },
          { title: "Subjects", value: "6", icon: Award, color: "emerald" },
          { title: "Attendance", value: "92%", icon: Calendar, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center mb-4`}>
              <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <BookOpen size={22} /> My Classes
          </h2>
          <div className="space-y-3">
            {["Mathematics", "Science", "English", "History"].map((sub, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <span className="text-gray-900 dark:text-gray-100">{sub}</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">Class 10-A</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Teachers */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <Users size={22} /> My Teachers
          </h2>
          <div className="space-y-4">
            {["Mr. Ahmed Khan - Math", "Mrs. Sara Ali - Science", "Mr. Usman - English"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">T</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available for doubt session</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects & Syllabus */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Subjects</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Urdu"].map((s, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                <p className="font-medium text-gray-900 dark:text-gray-100">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;