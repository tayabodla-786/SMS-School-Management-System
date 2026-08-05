// src/pages/Admin/Classes.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const API_BASE = API_BASE_URL;

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    class_name: '',
    section: '',
    roomNumber: '',
    capacity: '',
    teacherId: ''
  });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/classes`);
      setClasses(res.data.classes || res.data || []);
      console.log("Fetched classes:", res.data); // For debugging
    } catch (err) {
      toast.error('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/classes/teachers`);
      setTeachers(res.data.teachers || res.data || []);
    } catch (err) {
      toast.error('Failed to load teachers');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = { ...formData };
      if (!payload.teacherId) delete payload.teacherId;

      const classId = editingClass?.id || editingClass?._id;
      if (editingClass) {
        await axios.put(`${API_BASE}/classes/${classId}`, payload);
        toast.success('Class updated successfully!');
      } else {
        await axios.post(`${API_BASE}/classes`, payload);
        toast.success('Class created successfully!');
      }

      setShowModal(false);
      setEditingClass(null);
      resetForm();
      await fetchClasses(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      class_name: cls.class_name || '',
      section: cls.section || '',
      roomNumber: cls.roomNumber || '',
      capacity: cls.capacity || '',
      teacherId: cls.teacher?.id || cls.teacherId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await axios.delete(`${API_BASE}/classes/${id}`);
      toast.success('Class deleted');
      await fetchClasses();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      class_name: '', section: '',  roomNumber: '', capacity: '', teacherId: ''
    });
  };

  const filteredClasses = classes.filter(cls => 
    cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Classes</h1>
        <button
          onClick={() => { setEditingClass(null); resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition"
        >
          <Plus size={20} />
          Add New Class
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden border border-gray-100 dark:border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Class</th>
              <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Section</th>
              <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Room</th>
              <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Capacity</th>
              <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Teacher</th>
              <th className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : filteredClasses.length === 0 ? (
              <tr><td colSpan="7" className="py-20 text-center text-gray-500 dark:text-gray-400">No classes found</td></tr>
            ) : (
              filteredClasses.map(cls => (
                <tr key={cls.id || cls._id || `${cls.class_name}-${cls.section}` } className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{cls.class_name}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{cls.section}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{cls.roomNumber || '-'}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{cls.capacity || '-'}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{cls.teacher?.fullName || cls.teacher?.name || cls.teacherId || '-'}</td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button onClick={() => handleEdit(cls)} className="text-blue-600 hover:text-blue-800">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(cls.id || cls._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.class_name} 
                  onChange={e => setFormData({...formData, class_name: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
                  placeholder="Class 10" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Class Teacher </label>
                <select
                  value={formData.teacherId}
                  onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border rounded-xl"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id || teacher._id || teacher.email} value={teacher.id || teacher._id}>
                      {teacher.fullName || teacher.name || teacher.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className=" w-full block text-sm font-medium mb-1">Section *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.section} 
                    onChange={e => setFormData({...formData, section: e.target.value})} 
                    className="w-full px-4 py-3 border rounded-xl" 
                    placeholder="A" 
                  />
                </div>
                
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room Number</label>
                  <input 
                    type="text" 
                    value={formData.roomNumber} 
                    placeholder='123'
                    onChange={e => setFormData({...formData, roomNumber: e.target.value})} 
                    className="w-full px-4 py-3 border rounded-xl" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input 
                    type="number" 
                    value={formData.capacity} 
                    placeholder='50'
                    onChange={e => setFormData({...formData, capacity: Number(e.target.value) || ''})} 
                    className="w-full px-4 py-3 border rounded-xl" 
                  />
                </div>
              </div>

              

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => {setShowModal(false); setEditingClass(null);}} 
                  className="flex-1 py-3 border rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
                >
                  {formLoading ? 'Saving...' : editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;