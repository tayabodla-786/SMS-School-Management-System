import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          toast.error('Teacher not logged in.');
          setClasses([]);
          return;
        }

        const user = JSON.parse(userString);
        if (!user?.id) {
          toast.error('Invalid teacher data.');
          setClasses([]);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/classes`, {
          params: { teacherId: user.id },
        });

        setClasses(res.data || []);
      } catch (err) {
        toast.error('Failed to load assigned classes.');
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Classes</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading your classes...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No classes assigned yet.</div>
        ) : (
          <div className="grid gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="border rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{cls.class_name}</h2>
                    <p className="text-gray-500 mt-2">Section {cls.section}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Room</p>
                    <p className="font-semibold text-gray-800">{cls.roomNumber || '-'}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-semibold text-gray-800">{cls.capacity ?? '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="font-semibold text-gray-800">{cls.teacher?.fullName || cls.teacher?.name || 'You'}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Class ID</p>
                    <p className="font-semibold text-gray-800">{cls.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
