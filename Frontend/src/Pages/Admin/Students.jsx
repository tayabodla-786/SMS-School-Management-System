// src/pages/Admin/Students.jsx
import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const API_BASE = API_BASE_URL;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    email: '',
    class: '',
    phone: '',
    gender: 'Male',
    dob: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, { params: { role: 'student' } });
      setStudents(res.data || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setFormData({ rollNo: '', name: '', email: '', class: '', phone: '', gender: 'Male', dob: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password || 'Password@123',
        role: 'student',
        rollNumber: formData.rollNo,
        className: formData.class,
        phone: formData.phone,
      };

      await axios.post(`${API_BASE}/auth/register`, payload);
      toast.success("Student added successfully!");
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">All Students</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage student records • {students.length} total</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition shadow-lg">
          <FaPlus /> Add Student
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden border border-gray-100 dark:border-gray-800">
        {loading ? (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-8 py-5 text-left text-gray-700 dark:text-gray-300">Roll No</th>
                <th className="px-8 py-5 text-left text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-8 py-5 text-left text-gray-700 dark:text-gray-300">Email</th>
                <th className="px-8 py-5 text-left text-gray-700 dark:text-gray-300">Class</th>
                <th className="px-8 py-5 text-left text-gray-700 dark:text-gray-300">Phone</th>
                
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id || student._id || student.email} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-8 py-5 text-gray-900 dark:text-white">{student.rollNo}</td>
                  <td className="px-8 py-5 text-gray-900 dark:text-white">{student.name}</td>
                  <td className="px-8 py-5 text-gray-700 dark:text-gray-300">{student.email}</td>
                  <td className="px-8 py-5 text-gray-700 dark:text-gray-300">{student.class}</td>
                  <td className="px-8 py-5 text-gray-700 dark:text-gray-300">{student.phone}</td>
                  <td className="px-8 py-5 text-center">
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Student</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Roll No *</label>
                    <input name="rollNo" value={formData.rollNo} placeholder='123' onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Class *</label>
                    <input name="class" value={formData.class} placeholder='class 1' onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 dark:text-gray-300">Full Name *</label>
                  <input name="name" value={formData.name} placeholder='your name' onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div>
                  <label className="text-gray-700 dark:text-gray-300">Email *</label>
                  <input type="email" name="email" value={formData.email} placeholder='email' onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Phone</label>
                    <input name="phone" value={formData.phone} placeholder='0300 1234567' onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-gray-700 dark:text-gray-300">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 dark:text-gray-300">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" disabled={formLoading} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-70">
                    {formLoading ? "Saving..." : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;