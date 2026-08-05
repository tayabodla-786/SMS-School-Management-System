export const ASSIGNMENTS_KEY = 'sms_assignments';

export const loadAssignments = () => {
  try {
    const saved = localStorage.getItem(ASSIGNMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load assignments', err);
    return [];
  }
};

export const saveAssignments = (assignments) => {
  try {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to save assignments', err);
  }
};

export const addAssignment = (assignment) => {
  const assignments = loadAssignments();
  const nextId = assignments.length ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
  const newAssignment = {
    id: nextId,
    status: 'assigned',
    assignedAt: new Date().toISOString(),
    answers: [],
    submittedAt: null,
    ...assignment,
  };
  saveAssignments([...assignments, newAssignment]);
  return newAssignment;
};

export const updateAssignment = (id, updates) => {
  const assignments = loadAssignments();
  const updated = assignments.map((assignment) =>
    assignment.id === id ? { ...assignment, ...updates } : assignment
  );
  saveAssignments(updated);
  return updated;
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id ?? user?._id ?? user?.userId ?? null;
};

export const getCurrentUserName = () => {
  const user = getCurrentUser();
  return user?.fullName || user?.name || user?.username || 'Student';
};