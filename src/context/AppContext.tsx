import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, UserAccount } from '../types/student';
import { INITIAL_STUDENTS, DEMO_USERS } from '../data/mockStudents';

interface AppContextType {
  students: Student[];
  currentUser: UserAccount;
  activeStudent: Student;
  activeTab: string;
  theme: 'light' | 'dark';
  searchTerm: string;
  filterCourse: string;
  filterSemester: string;
  filterRisk: string;
  comparisonIds: string[];
  notifications: Array<{ id: string; title: string; message: string; time: string; type: 'warning' | 'info' | 'success'; read: boolean }>;
  isAuthModalOpen: boolean;
  setCurrentUser: (user: UserAccount) => void;
  setActiveStudent: (student: Student) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSearchTerm: (term: string) => void;
  setFilterCourse: (course: string) => void;
  setFilterSemester: (sem: string) => void;
  setFilterRisk: (risk: string) => void;
  toggleComparisonId: (id: string) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  addStudent: (studentData: Partial<Student>) => Promise<Student>;
  updateStudent: (id: string, studentData: Partial<Student>) => Promise<Student>;
  deleteStudent: (id: string) => Promise<boolean>;
  refreshStudents: () => Promise<void>;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_USERS[0]); // Default: Aarav Sharma
  const [activeStudent, setActiveStudent] = useState<Student>(INITIAL_STUDENTS[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [comparisonIds, setComparisonIds] = useState<string[]>(['std-001', 'std-002']);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Low Attendance Notice',
      message: 'Student Rahul Verma (CS-2022-115) has fallen below 65% attendance.',
      time: '10 mins ago',
      type: 'warning' as const,
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Midterm Evaluation Uploaded',
      message: 'Internal examination marks for Semester 6 Machine Learning published.',
      time: '2 hours ago',
      type: 'info' as const,
      read: false,
    },
    {
      id: 'notif-3',
      title: 'AI Prediction Recalculated',
      message: 'New academic performance forecast generated with 94% model confidence.',
      time: '1 day ago',
      type: 'success' as const,
      read: true,
    },
  ]);

  // Load students from backend API on mount
  const refreshStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStudents(data.data);
          // Sync active student
          const matched = data.data.find((s: Student) => s.id === activeStudent.id) || data.data[0];
          setActiveStudent(matched);
        }
      }
    } catch {
      // If network fails, default fallback to mock data
      console.log('Using local student store');
    }
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  // Sync activeStudent when currentUser changes to a student
  useEffect(() => {
    if (currentUser.role === 'student' && currentUser.studentId) {
      const matched = students.find((s) => s.id === currentUser.studentId);
      if (matched) {
        setActiveStudent(matched);
      }
    }
  }, [currentUser, students]);

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleComparisonId = (id: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Student CRUD actions with backend sync
  const addStudent = async (studentData: Partial<Student>): Promise<Student> => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.data;
        setStudents((prev) => [created, ...prev]);
        return created;
      }
    } catch (e) {
      console.error('Failed to post student to server', e);
    }

    // Local fallback
    const fallbackNew: Student = {
      ...(INITIAL_STUDENTS[0]),
      ...studentData,
      id: `std-${Date.now()}`,
    } as Student;
    setStudents((prev) => [fallbackNew, ...prev]);
    return fallbackNew;
  };

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.data;
        setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
        if (activeStudent.id === id) {
          setActiveStudent(updated);
        }
        return updated;
      }
    } catch (e) {
      console.error('Failed to update student on server', e);
    }

    let updatedStudent: Student = activeStudent;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          updatedStudent = { ...s, ...studentData } as Student;
          return updatedStudent;
        }
        return s;
      })
    );
    if (activeStudent.id === id) {
      setActiveStudent(updatedStudent);
    }
    return updatedStudent;
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete on server', e);
    }

    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (activeStudent.id === id) {
      const remaining = students.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setActiveStudent(remaining[0]);
      }
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        students,
        currentUser,
        activeStudent,
        activeTab,
        theme,
        searchTerm,
        filterCourse,
        filterSemester,
        filterRisk,
        comparisonIds,
        notifications,
        isAuthModalOpen,
        setCurrentUser,
        setActiveStudent,
        setActiveTab,
        setTheme,
        toggleTheme,
        setSearchTerm,
        setFilterCourse,
        setFilterSemester,
        setFilterRisk,
        toggleComparisonId,
        setIsAuthModalOpen,
        addStudent,
        updateStudent,
        deleteStudent,
        refreshStudents,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
