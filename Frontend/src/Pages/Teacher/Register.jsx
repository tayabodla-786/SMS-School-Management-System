// src/pages/TeacherRegister.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Moon, Sun } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { useTheme } from '../../Context/ThemeContext';

const TeacherRegister = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    subject: '',
    qualification: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerData = {
        ...form,
        role: 'teacher'   // Important
      };

      await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      localStorage.setItem('lastUserUpdate', Date.now().toString());

      toast.success('Teacher registered successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative">
      <Toaster position="top-right" richColors />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
      >
        {isDark ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-700" />}
      </button>

      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Teacher Registration</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join our School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" 
            placeholder="Full Name *" 
            required
            value={form.fullName} 
            onChange={e => setForm({...form, fullName: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input 
            type="email" 
            placeholder="Email Address *" 
            required
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input 
            type="password" 
            placeholder="Password *" 
            required
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input 
            type="text" 
            placeholder="Phone Number" 
            value={form.phone} 
            onChange={e => setForm({...form, phone: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input 
            type="text" 
            placeholder="Subject (e.g. Mathematics) *" 
            required
            value={form.subject} 
            onChange={e => setForm({...form, subject: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input 
            type="text" 
            placeholder="Qualification (e.g. M.Sc, B.Ed)" 
            value={form.qualification} 
            onChange={e => setForm({...form, qualification: e.target.value})}
            className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-70"
          >
            {loading ? 'Registering...' : 'Register as Teacher'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherRegister;