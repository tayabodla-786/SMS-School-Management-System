import React, { useEffect, useState } from 'react';
import { Mail, Phone, Award } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const StudentTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, { params: { role: 'teacher' } });
        setTeachers(res.data || []);
      } catch (err) {
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Teachers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {(teacher.name || teacher.fullName || '').split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{teacher.name || teacher.fullName}</h3>
                  <p className="text-blue-600 font-medium">{teacher.subject}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-gray-500 dark:text-gray-400" />
                  <span>{teacher.qualification}</span>
                </div>
              </div>

              <button className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl text-sm font-medium transition text-gray-900 dark:text-white">
                Send Message
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentTeachers;