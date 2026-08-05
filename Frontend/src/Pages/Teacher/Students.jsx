import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, { params: { role: 'student' } });
        setStudents(res.data || []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Students</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Roll No</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Class</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Phone</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{s.rollNo}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{s.name || s.fullName}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.email}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.class}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;