import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { getCurrentUserId, getCurrentUserName } from '../../utils/assignmentStorage';

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [activeAnswers, setActiveAnswers] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const currentUserId = getCurrentUserId();
  const studentName = getCurrentUserName();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentUserId) {
        setAssignments([]);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/assignments`, { params: { studentId: currentUserId } });
        setAssignments(res.data || []);
      } catch (err) {
        setAssignments([]);
      }
    };

    fetchAssignments();
  }, [currentUserId]);

  const currentAssignment = useMemo(
    () => assignments.find((assignment) => assignment.status === 'assigned'),
    [assignments]
  );

  const studentAssignmentHistory = useMemo(
    () => assignments.filter((assignment) => assignment.status === 'submitted'),
    [assignments]
  );

  const handleAnswerChange = (questionId, value) => {
    setActiveAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (assignment) => {
    const answers = assignment.questions.map((question) => ({
      questionId: question.id,
      selectedOption: activeAnswers[question.id] || '',
    }));

    if (answers.some((answer) => !answer.selectedOption)) {
      setStatusMessage('Please answer all questions before submitting.');
      return;
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/assignments/${assignment.id}/submit`, { answers });
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === assignment.id ? { ...item, ...res.data } : item
        )
      );
      setStatusMessage('Assignment submitted successfully!');
    } catch (err) {
      setStatusMessage('Failed to submit assignment.');
    }
  };

  if (!currentUserId) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Please log in as a student to see your assignments.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hello, {studentName}</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete your assigned MCQs and submit them for review.</p>
      </div>

      {currentAssignment ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-8">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigned by</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{currentAssignment.teacherName}</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">Pending submission</p>
            </div>

            <div className="space-y-6">
              {currentAssignment.questions.map((question, index) => (
                <div key={question.id} className="rounded-3xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-950">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">{index + 1}. {question.text}</p>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-200">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={activeAnswers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleSubmit(currentAssignment)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Submit Assignment
            </button>
            {statusMessage && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{statusMessage}</p>}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Assignment Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total questions: {currentAssignment.questions.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned at: {new Date(currentAssignment.assignedAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned by: {currentAssignment.teacherName}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No assignments available</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Your teacher will assign MCQs here. Check back later.</p>
        </div>
      )}

      {studentAssignmentHistory.length ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Submitted Assignments</h2>
          <div className="space-y-4">
            {studentAssignmentHistory.map((assignment) => (
              <div key={assignment.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Submitted on</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date(assignment.submittedAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Review complete</p>
                </div>
                <div className="space-y-3">
                  {assignment.questions.map((question) => {
                    const answer = assignment.answers.find((item) => item.questionId === question.id);
                    return (
                      <div key={question.id} className="rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{question.text}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Your answer: <span className="font-medium">{answer?.selectedOption}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentAssignment;
