// src/Routes.jsx
import { createBrowserRouter } from 'react-router-dom';

// Pages
import LoginPage from '../Pages/LoginPage/LoginPage.jsx';
import MainLayout from '../components/Common/MainLayout.jsx';

// Admin Pages
import AdminDashboard from '../Pages/Admin/Dashboard.jsx';
import AdminStudents from '../Pages/Admin/Students.jsx';
import AdminTeachers from '../Pages/Admin/Teachers.jsx';
import AdminClasses from '../Pages/Admin/Classes.jsx';
import AdminUsers from '../Pages/Admin/Users.jsx';

// Teacher Pages
import TeacherDashboard from '../Pages/Teacher/Dashboard.jsx';
import TeacherClasses from '../Pages/Teacher/Classes.jsx';
import TeacherAssignment from '../Pages/Teacher/Assignment.jsx';
import TeacherStudents from '../Pages/Teacher/Students.jsx';

// Student Pages
import StudentDashboard from '../Pages/Student/Dashboard.jsx';
import StudentAssignment from '../Pages/Student/Assignment.jsx';

// Registration Pages
import TeacherRegister from '../Pages/Teacher/Register.jsx';
import StudentRegister from '../Pages/Student/Register.jsx';
import StudentClasses from '../Pages/Student/Classes.jsx';
import StudentTeachers from '../Pages/Student/Teachers.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  // === ADMIN ROUTES ===
  {
    path: "/admin",
    element: <MainLayout role="admin" />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "students", element: <AdminStudents /> },
      { path: "teachers", element: <AdminTeachers /> },
      { path: "classes", element: <AdminClasses /> },
      { path: "users", element: <AdminUsers /> },
    ],
  },

  // === TEACHER ROUTES ===
  {
    path: "/teacher",
    element: <MainLayout role="teacher" />,
    children: [
      { path: "dashboard", element: <TeacherDashboard /> },
      { path: "classes", element: <TeacherClasses /> },
      { path: "assignments", element: <TeacherAssignment /> },
      { path: "students", element: <TeacherStudents /> },
    ],
  },

  // === STUDENT ROUTES ===
  {
    path: "/student",
    element: <MainLayout role="student" />,
    children: [
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "classes", element: <StudentClasses /> },
      { path: "teachers", element: <StudentTeachers /> },
      { path: "assignments", element: <StudentAssignment /> },
    ],
  },

  // === REGISTRATION ROUTES (Outside Protected Layout) ===
  {
    path: "/teacher/register",
    element: <TeacherRegister />,
  },
  {
    path: "/student/register",
    element: <StudentRegister />,
  },
]);