// src/pages/Admin/Teachers.jsx
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const API_BASE = API_BASE_URL;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, { params: { role: 'teacher' } });
      setTeachers(res.data || []);
    } catch (err) {
      toast.error("Failed to load teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register as a user so teacher is created in users table as well
      const payload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password || 'Password@123',
        role: 'teacher',
        phone: formData.phone,
        subject: formData.subject,
        qualification: formData.qualification || null,
      };

      const res = await axios.post(`${API_BASE}/auth/register`, payload);

      if (res.data.success) {
        toast.success("Teacher added successfully!");
        setFormData({ teacherId: '', name: '', email: '', phone: '', subject: '', qualification: '' });
        setShowModal(false);
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      toast.success('Teacher deleted successfully');
      fetchTeachers();   // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All Teachers</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2"
        >
          + Add Teacher
        </button>
      </div>

      {/* Teachers List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden border border-gray-100 dark:border-gray-800">
        {teachers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No teachers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {teachers.map(teacher => (
              <div key={teacher.id || teacher.teacherId || teacher.email} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md dark:hover:shadow-lg transition relative bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">{teacher.name || teacher.fullName}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">ID: {teacher.teacherId || teacher.id}</p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mt-3">{teacher.email}</p>
                {teacher.phone && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">📞 {teacher.phone}</p>}
                {teacher.subject && <p className="text-blue-600 dark:text-blue-400 mt-2">Subject: {teacher.subject}</p>}

                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Teacher</h2>
            
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Teacher ID <span className="text-red-500">*</span></label>
                <input type="text" name="teacherId" value={formData.teacherId} onChange={handleInputChange} required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="TCH-001" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="+92 300 1234567" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Mathematics" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="M.Ed" />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-70">
                  {loading ? 'Adding...' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;