import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types/student';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  FileSpreadsheet,
  GitCompare,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const TeacherAdminDashboard: React.FC = () => {
  const {
    students,
    activeStudent,
    setActiveStudent,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filterCourse,
    setFilterCourse,
    filterSemester,
    setFilterSemester,
    filterRisk,
    setFilterRisk,
    toggleComparisonId,
    comparisonIds,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useApp();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [marksEntryStudent, setMarksEntryStudent] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);

  // New Student Form state
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: 'B.Tech Computer Science & Engineering',
    semester: 'Semester 6',
    section: 'CSE-A',
    mentorName: 'Dr. Rajesh Kulkarni',
    cgpa: 8.0,
    overallPercentage: 80.0,
    attendancePercentage: 85.0,
  });

  // Marks Entry Form state
  const [marksEntries, setMarksEntries] = useState<Record<string, { internal: number; external: number; attendance: number }>>({});

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = filterCourse === 'all' || s.course.includes(filterCourse);
    const matchesSemester = filterSemester === 'all' || s.semester === filterSemester;
    const matchesRisk =
      filterRisk === 'all' ||
      (filterRisk === 'at_risk' && (s.riskLevel === 'Critical' || s.riskLevel === 'High' || s.attendancePercentage < 75)) ||
      (filterRisk === 'honors' && s.cgpa >= 8.5) ||
      s.riskLevel === filterRisk;

    return matchesSearch && matchesCourse && matchesSemester && matchesRisk;
  });

  // Quick aggregate statistics
  const totalStudents = students.length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (totalStudents || 1)).toFixed(1);
  const avgScore = (students.reduce((acc, s) => acc + s.overallPercentage, 0) / (totalStudents || 1)).toFixed(1);
  const atRiskStudents = students.filter((s) => s.riskLevel === 'Critical' || s.riskLevel === 'High' || s.attendancePercentage < 75);

  const handleOpenMarksEntry = (st: Student) => {
    setMarksEntryStudent(st);
    const initialEntries: Record<string, { internal: number; external: number; attendance: number }> = {};
    st.subjects.forEach((sub) => {
      initialEntries[sub.code] = {
        internal: sub.internalMarks,
        external: sub.externalMarks,
        attendance: sub.attendancePercentage,
      };
    });
    setMarksEntries(initialEntries);
  };

  const handleSaveMarks = async () => {
    if (!marksEntryStudent) return;

    const updatedSubjects = marksEntryStudent.subjects.map((sub) => {
      const entry = marksEntries[sub.code];
      if (entry) {
        const total = Math.min(100, Math.round(entry.internal + entry.external));
        const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'F';
        return {
          ...sub,
          internalMarks: entry.internal,
          externalMarks: entry.external,
          totalMarks: total,
          grade,
          attendancePercentage: entry.attendance,
        };
      }
      return sub;
    });

    const newAvgMarks = Math.round(updatedSubjects.reduce((sum, s) => sum + s.totalMarks, 0) / updatedSubjects.length);
    const newAvgAtt = Math.round(updatedSubjects.reduce((sum, s) => sum + s.attendancePercentage, 0) / updatedSubjects.length);

    await updateStudent(marksEntryStudent.id, {
      subjects: updatedSubjects,
      overallPercentage: newAvgMarks,
      attendancePercentage: newAvgAtt,
      cgpa: parseFloat((newAvgMarks / 10).toFixed(2)),
      performanceStatus: newAvgMarks >= 85 ? 'Excellent' : newAvgMarks >= 70 ? 'Good' : newAvgMarks >= 60 ? 'Average' : 'Needs Improvement',
      riskLevel: newAvgAtt < 75 || newAvgMarks < 60 ? 'Critical' : 'Low',
    });

    setMarksEntryStudent(null);
  };

  const handleSaveNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const defaultSubjects = [
      {
        code: 'CS601',
        name: 'Machine Learning',
        credits: 4,
        internalMarks: 25,
        externalMarks: 55,
        totalMarks: 80,
        grade: 'A',
        attendanceAttended: 38,
        attendanceTotal: 44,
        attendancePercentage: 86.3,
        assignmentsSubmitted: 4,
        assignmentsTotal: 5,
        weakTopics: ['Math Formulations'],
        strongTopics: ['Supervised Learning'],
      },
      {
        code: 'CS602',
        name: 'Design & Analysis of Algorithms',
        credits: 4,
        internalMarks: 24,
        externalMarks: 54,
        totalMarks: 78,
        grade: 'B+',
        attendanceAttended: 37,
        attendanceTotal: 44,
        attendancePercentage: 84.0,
        assignmentsSubmitted: 5,
        assignmentsTotal: 6,
        weakTopics: ['Graph algorithms'],
        strongTopics: ['Sorting'],
      },
    ];

    await addStudent({
      ...newStudentData,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
      performanceStatus: newStudentData.overallPercentage >= 85 ? 'Excellent' : newStudentData.overallPercentage >= 70 ? 'Good' : 'Average',
      riskLevel: newStudentData.attendancePercentage < 75 ? 'Critical' : 'Low',
      phone: '+91 98765 00000',
      subjects: defaultSubjects,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Teacher & Administrator Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Batch student management, marks and attendance recording, at-risk triage, and cohort diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Reports
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" /> Add New Student
          </button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-mono">
            {totalStudents}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Across B.Tech CSE, IT & AI Programs</p>
        </div>

        {/* Average Attendance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Cohort Avg Attendance</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-emerald-600">
            {avgAttendance}%
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Biometric classroom attendance log</p>
        </div>

        {/* Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Batch Average Marks</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-slate-900 dark:text-white">
            {avgScore}%
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Combined continuous & external</p>
        </div>

        {/* At-Risk Students Count */}
        <div
          onClick={() => setFilterRisk(filterRisk === 'at_risk' ? 'all' : 'at_risk')}
          className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition ${
            filterRisk === 'at_risk'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold uppercase">
            <span>At-Risk Students Flagged</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-rose-600">
            {atRiskStudents.length}
          </div>
          <p className="mt-2 text-[11px] text-rose-700/80 dark:text-rose-400">
            {filterRisk === 'at_risk' ? 'Filtered active • Click to reset' : 'Click to filter at-risk students'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Course filter */}
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Departments / Courses</option>
            <option value="Computer Science">B.Tech Computer Science</option>
            <option value="Information Technology">B.Tech IT</option>
            <option value="Artificial Intelligence">B.Tech AI & Data Science</option>
          </select>

          {/* Semester filter */}
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full md:w-36 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Semesters</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 6">Semester 6</option>
          </select>

          {/* Risk Level filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="w-full md:w-36 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="at_risk">At-Risk Only (Warning)</option>
            <option value="honors">Honors Candidates (&gt;8.5)</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Comparison Bar if students are selected */}
        {comparisonIds.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Selected for Side-by-Side Comparison ({comparisonIds.length}/3 students)
              </span>
            </div>
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              Open Comparison Matrix
            </button>
          </div>
        )}
      </div>

      {/* Main Student Directory Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Cohort Student Roster ({filteredStudents.length} of {students.length})
          </h3>
          <span className="text-[11px] text-slate-400">Click any row action to enter marks or examine profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Compare</th>
                <th className="py-3 px-3">Student Details</th>
                <th className="py-3 px-3">Course / Sem</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-3 text-center">Overall %</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3 text-center">Risk Status</th>
                <th className="py-3 px-3 text-right">Faculty Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.map((st) => {
                const isSelectedForComp = comparisonIds.includes(st.id);
                const isAtRisk = st.riskLevel === 'Critical' || st.attendancePercentage < 75;

                return (
                  <tr
                    key={st.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition ${
                      activeStudent.id === st.id ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    {/* Compare Checkbox */}
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelectedForComp}
                        onChange={() => toggleComparisonId(st.id)}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        title="Add to comparison matrix"
                      />
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            {st.name}
                            {st.cgpa >= 9.0 && (
                              <span title="Dean's List">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{st.rollNo}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3 px-3">
                      <div className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                        {st.course.replace('B.Tech ', '')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {st.semester} ({st.section})
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                      {st.cgpa}
                    </td>

                    {/* Overall % */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {st.overallPercentage}%
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-3 min-w-[120px]">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className={st.attendancePercentage < 75 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}>
                          {st.attendancePercentage}%
                        </span>
                        {st.attendancePercentage < 75 && (
                          <span className="text-[9px] text-rose-500 font-sans font-bold">Alert</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.attendancePercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, st.attendancePercentage)}%` }}
                        />
                      </div>
                    </td>

                    {/* Risk Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAtRisk
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {st.riskLevel}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View in student portal */}
                        <button
                          onClick={() => {
                            setActiveStudent(st);
                            setActiveTab('overview');
                          }}
                          title="Open Student Dashboard"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Enter Marks / Attendance */}
                        <button
                          onClick={() => handleOpenMarksEntry(st)}
                          title="Enter Marks & Attendance"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>

                        {/* Edit Student Info */}
                        <button
                          onClick={() => setEditingStudent(st)}
                          title="Edit Student Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Student */}
                        <button
                          onClick={() => setDeleteConfirmStudent(st)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Register New Student Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Siddharth Joshi"
                    value={newStudentData.name}
                    onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Roll Number / UID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CS-2022-190"
                    value={newStudentData.rollNo}
                    onChange={(e) => setNewStudentData({ ...newStudentData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={newStudentData.email}
                    onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Degree Program
                  </label>
                  <select
                    value={newStudentData.course}
                    onChange={(e) => setNewStudentData({ ...newStudentData, course: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option>B.Tech Computer Science & Engineering</option>
                    <option>B.Tech Information Technology</option>
                    <option>B.Tech Artificial Intelligence & Data Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Semester
                  </label>
                  <select
                    value={newStudentData.semester}
                    onChange={(e) => setNewStudentData({ ...newStudentData, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option>Semester 4</option>
                    <option>Semester 6</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Initial Attendance %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudentData.attendancePercentage}
                    onChange={(e) => setNewStudentData({ ...newStudentData, attendancePercentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Initial CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={newStudentData.cgpa}
                    onChange={(e) => setNewStudentData({ ...newStudentData, cgpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Save & Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Enter / Update Marks & Attendance */}
      {marksEntryStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" /> Enter Marks & Attendance
                </h3>
                <p className="text-xs text-slate-500">
                  Student: {marksEntryStudent.name} ({marksEntryStudent.rollNo})
                </p>
              </div>
              <button
                onClick={() => setMarksEntryStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {marksEntryStudent.subjects.map((sub) => {
                const entry = marksEntries[sub.code] || {
                  internal: sub.internalMarks,
                  external: sub.externalMarks,
                  attendance: sub.attendancePercentage,
                };
                const total = Math.min(100, Math.round(entry.internal + entry.external));

                return (
                  <div
                    key={sub.code}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {sub.code}: {sub.name}
                      </span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        Total: {total} / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-500 block mb-1">Internal (out of 30)</label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={entry.internal}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setMarksEntries((prev) => ({
                              ...prev,
                              [sub.code]: { ...prev[sub.code], internal: val },
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">External (out of 70)</label>
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={entry.external}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setMarksEntries((prev) => ({
                              ...prev,
                              [sub.code]: { ...prev[sub.code], external: val },
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">Attendance %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={entry.attendance}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setMarksEntries((prev) => ({
                              ...prev,
                              [sub.code]: { ...prev[sub.code], attendance: val },
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setMarksEntryStudent(null)}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarks}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow"
              >
                Save & Recalculate CGPA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Student Confirmation */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete Student Record</h3>
                <p className="text-xs text-slate-500">Confirm irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete the academic file of{' '}
              <strong>{deleteConfirmStudent.name}</strong> ({deleteConfirmStudent.rollNo})?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteStudent(deleteConfirmStudent.id);
                  setDeleteConfirmStudent(null);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Quick Edit Student Profile */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" /> Edit Student Information
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={editingStudent.rollNo}
                  onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Mentor / Counselor
                </label>
                <input
                  type="text"
                  value={editingStudent.mentorName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, mentorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateStudent(editingStudent.id, editingStudent);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
