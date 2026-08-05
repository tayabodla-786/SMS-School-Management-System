import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserPlus, FaTrash, FaEdit } from 'react-icons/fa';
import API_BASE_URL from '../../config/api';

const API_BASE = API_BASE_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    rollNumber: '',
    className: '',
    subject: '',
    qualification: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers((res.data || []).filter((user) => user.role !== 'admin'));
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));


  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'student',
      rollNumber: '',
      className: '',
      subject: '',
      qualification: '',
    });
    setEditingUser(null);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      role: user.role || 'student',
      rollNumber: user.rollNumber || user.rollNo || '',
      className: user.className || user.class || '',
      subject: user.subject || '',
      qualification: user.qualification || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (formData.role === 'student') {
        payload.rollNumber = formData.rollNumber;
        payload.className = formData.className;
      }

      if (formData.role === 'teacher') {
        payload.subject = formData.subject;
        payload.qualification = formData.qualification;
      }

      if (editingUser) {
        await axios.put(`${API_BASE}/users/${editingUser.id}`, payload);
        toast.success('User updated successfully');
      } else {
        await axios.post(`${API_BASE}/auth/register`, payload);
        toast.success('User created successfully');
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingUser ? 'Failed to update user' : 'Failed to create user'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Manage Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Create users who can log in with their email and password.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-8 border border-gray-100 dark:border-gray-800">
<div className="flex items-center gap-3 mb-6 justify-between">
              <div className="flex items-center gap-3">
                <FaUserPlus className="text-blue-600 dark:text-blue-400 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              </div>
              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel edit
                </button>
              )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Enter username"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl"
                  placeholder="0300 1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
                placeholder={editingUser ? 'Leave blank to keep current password' : 'Create password'}
                {...(!editingUser ? { required: true } : {})}
              />
              {editingUser && (
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current password.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border bg-gray-900 rounded-xl"
                disabled={!!editingUser}
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              {editingUser && <p className="text-xs text-gray-500 mt-1">Role cannot be changed after creation.</p>}
            </div>

            {formData.role === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="ST-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="10-A"
                  />
                </div>
              </div>
            )}

            {formData.role === 'teacher' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="M.Ed"
                  />
                </div>
              </div>
            )}

        

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold disabled:opacity-70"
            >
              {submitting ? (editingUser ? 'Updating...' : 'Creating user...') : editingUser ? 'Update User' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Existing Users</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{users.length} total</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">No users yet</div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{user.name || user.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 capitalize">{user.role}</p>
                  {user.role === 'student' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Roll: {user.rollNumber || user.rollNo || '-'} • Class: {user.className || user.class || '-'}</p>
                  )}
                  {user.role === 'teacher' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subject: {user.subject || '-'}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-xl transition"
                    title="Edit user"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-xl transition"
                    title="Delete user"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
