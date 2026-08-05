import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Users } from 'lucide-react';

const StudentClasses = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "Mathematics", teacher: "Mr. Ahmed Khan", time: "09:00 AM", room: "Room 205" },
    { id: 2, name: "Physics", teacher: "Mrs. Sara Ali", time: "10:30 AM", room: "Lab 3" },
    { id: 3, name: "English", teacher: "Mr. Usman Raza", time: "12:00 PM", room: "Room 108" },
    { id: 4, name: "Chemistry", teacher: "Miss Fatima", time: "02:00 PM", room: "Lab 2" },
  ]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400">Class 10 - Section A</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Current Semester • 2026</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-600" size={28} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{cls.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Teacher: <span className="font-medium text-gray-900 dark:text-white">{cls.teacher}</span></p>
              </div>
              <div className="text-right text-sm">
                <p className="text-emerald-600 font-medium">{cls.time}</p>
                <p className="text-gray-500 dark:text-gray-400">{cls.room}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Users size={18} />
                <span>45 Students</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClasses;