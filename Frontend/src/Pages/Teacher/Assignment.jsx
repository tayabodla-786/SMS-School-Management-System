import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Send, UserCheck } from 'lucide-react';
import API_BASE_URL from '../../config/api';
import { getCurrentUser, getCurrentUserId } from '../../utils/assignmentStorage';

const initialQuestions = [
  {
    id: 'q1',
    text: 'What is the capital of Pakistan?',
    options: ['Lahore', 'Karachi', 'Islamabad', 'Peshawar'],
  },
  {
    id: 'q2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
  },
  {
    id: 'q3',
    text: 'What is 5 + 3?',
    options: ['6', '7', '8', '9'],
  },
  {
    id: 'q4',
    text: 'Which animal is called the king of the jungle?',
    options: ['Tiger', 'Lion', 'Elephant', 'Leopard'],
  },
  {
    id: 'q5',
    text: 'What color do you get when you mix red and white?',
    options: ['Pink', 'Orange', 'Purple', 'Brown'],
  },
];

const TeacherAssignment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [questions, setQuestions] = useState(initialQuestions);
  const [assignments, setAssignments] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(true);

  const teacherId = getCurrentUserId();
  const teacher = getCurrentUser();
  const teacherName = teacher?.fullName || teacher?.name || 'Teacher';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, { params: { role: 'student' } });
        const studentList = res.data || [];
        setStudents(studentList);
        if (!selectedStudentId && studentList.length) {
          setSelectedStudentId(String(studentList[0].id ?? studentList[0]._id ?? ''));
        }
      } catch (err) {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchAssignments = async () => {
      if (!teacherId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/assignments`, { params: { teacherId } });
        setAssignments(res.data || []);
      } catch (err) {
        setAssignments([]);
      }
    };

    fetchStudents();
    fetchAssignments();
  }, [teacherId]);

  const selectedStudent = useMemo(
    () => students.find((student) => String(student.id ?? student._id) === selectedStudentId),
    [students, selectedStudentId]
  );

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const updatedOptions = [...next[questionIndex].options];
      updatedOptions[optionIndex] = value;
      next[questionIndex] = { ...next[questionIndex], options: updatedOptions };
      return next;
    });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setStatusMessage('Please select a student.');
      return;
    }

    const student = selectedStudent;
    const teacherId = teacher?.id ?? teacher?._id;
    if (!teacherId) {
      setStatusMessage('Unable to determine current teacher.');
      return;
    }

    const payload = {
      studentId: selectedStudentId,
      studentName: student?.fullName || student?.name || 'Student',
      teacherId,
      teacherName,
      questions,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/assignments`, payload);
      setAssignments((prev) => [res.data, ...prev]);
      setStatusMessage('Assignment assigned successfully!');
    } catch (err) {
      setStatusMessage('Failed to assign assignment.');
    }
  };

  const submittedAssignments = assignments.filter((item) => item.status === 'submitted');

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignment Builder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Assign MCQs to students and review submitted responses.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total assignments</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{assignments.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400">{submittedAssignments.length} submitted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-8">
          <form onSubmit={handleAssign} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign to student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3"
              >
                {loadingStudents ? (
                  <option>Loading students...</option>
                ) : students.length ? (
                  students.map((student) => (
                    <option key={student.id ?? student._id} value={String(student.id ?? student._id)}>
                      {student.fullName || student.name || student.email}
                    </option>
                  ))
                ) : (
                  <option>No students available</option>
                )}
              </select>
            </div>

            <div className="grid gap-6">
              {questions.map((question, index) => (
                <div key={question.id} className="p-5 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question {index + 1}</label>
                    <input
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className="rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3"
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              <Send size={18} /> Assign Now
            </button>
            {statusMessage && <p className="text-sm text-green-600 dark:text-green-400">{statusMessage}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-4 text-gray-800 dark:text-white">
              <UserCheck size={24} />
              <h2 className="text-xl font-semibold">Review Submitted Assignments</h2>
            </div>
            {submittedAssignments.length ? (
              <div className="space-y-4">
                {submittedAssignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-950">
                    <div className="flex justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Student</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assignment.studentName}</p>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">Submitted</p>
                    </div>
                    <div className="space-y-3">
                      {assignment.answers.map((answer) => {
                        const question = assignment.questions.find((q) => q.id === answer.questionId);
                        return (
                          <div key={answer.questionId} className="rounded-2xl bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{question?.text}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Answer: {answer.selectedOption}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No submitted assignments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignment;
