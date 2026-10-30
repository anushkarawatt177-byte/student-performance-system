import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  Code,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AIRecommendations: React.FC = () => {
  const { activeStudent, setActiveTab } = useApp();

  // Completed items toggle for student self-study checklist
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const weakSubjects = activeStudent.subjects.filter(
    (s) => s.totalMarks < 70 || s.attendancePercentage < 75
  );

  // Structured recommendations tailored to student
  const structuredRecs = [
    {
      id: 'rec-1',
      category: 'Attendance Recovery',
      title: 'Elevate Lecture Attendance & Class Engagement',
      priority: activeStudent.attendancePercentage < 75 ? 'Urgent' : 'Standard',
      description:
        activeStudent.attendancePercentage < 75
          ? `Current attendance (${activeStudent.attendancePercentage}%) triggers statutory examination detention. Prioritize 100% presence in the upcoming 3 weeks to clear university eligibility.`
          : `Current attendance is strong at ${activeStudent.attendancePercentage}%. Maintain above 85% to receive 5 full continuous assessment internal marks.`,
      icon: Clock,
      color: activeStudent.attendancePercentage < 75 ? 'rose' : 'emerald',
      actionLink: 'attendance',
      actionText: 'Open Attendance Ledger',
      checklist: [
        'Attend first period lectures punctually every weekday',
        'Request biometric log verification if any attendance scan was missed',
        'Submit official medical leave certificate for any unavoidable absence',
      ],
    },
    {
      id: 'rec-2',
      category: 'Course Focus',
      title: `Intensive Concept Remediation in ${weakSubjects[0]?.name || 'Core Engineering Subjects'}`,
      priority: 'High',
      description: `Diagnostic assessments indicate recurring score deficits in: ${
        activeStudent.aiPrediction.weakSubjects.join(', ') || 'Theoretical Proofs & Algorithms'
      }. Weekly faculty tutorial sessions are recommended.`,
      icon: BookOpen,
      color: 'blue',
      actionLink: 'analytics',
      actionText: 'Analyze Subject Marks',
      checklist: [
        'Solve previous 5-year end-semester question bank problems',
        'Attend departmental doubt-clearing clinic on Wednesday afternoons',
        'Review NPTEL & MIT OpenCourseWare lecture notes for weak topics',
      ],
    },
    {
      id: 'rec-3',
      category: 'Coding & Practice',
      title: 'Systematic Programming & Algorithm Problem Solving',
      priority: 'High',
      description:
        'Technical campus placement drives and laboratory evaluations require high algorithmic speed. Practice data structure implementations daily.',
      icon: Code,
      color: 'purple',
      checklist: [
        'Complete at least 3 algorithmic problems on LeetCode/HackerRank weekly',
        'Implement Dynamic Programming & Graph traversal algorithms from scratch',
        'Conduct peer code reviews for weekly lab submissions',
      ],
    },
    {
      id: 'rec-4',
      category: 'Assignment Submissions',
      title: 'Assignment Quality & On-Time Turnaround',
      priority: 'Medium',
      description:
        'Timely assignment turn-in accounts for 30% of total internal credits. Avoid penalty deductions by submitting 48 hours before official deadlines.',
      icon: CheckCircle2,
      color: 'indigo',
      checklist: [
        'Maintain a personal deadline calendar for all 5 enrolled subjects',
        'Verify lab output test cases against grading rubrics before submission',
        'Consult teaching assistants for early feedback on draft code',
      ],
    },
    {
      id: 'rec-5',
      category: 'Study Routine',
      title: 'Personalized Daily Time-Blocking Schedule',
      priority: 'Medium',
      description:
        'Implement spaced repetition and the Pomodoro method (25 mins focus, 5 mins rest) to enhance retention of complex engineering equations.',
      icon: Calendar,
      color: 'amber',
      checklist: [
        'Block 2.5 hours every evening exclusively for self-study and problem practice',
        'Conduct a 30-minute recap of daily class lecture notes every night',
        'Take a full-length timed mock assessment every alternate Sunday',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            AI-Powered Personalized Academic Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tailored learning path, weak-topic intervention strategies, and disciplined study habits for {activeStudent.name}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          5 Active AI Directives
        </span>
      </div>

      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200">
            Performance Optimization Target
          </span>
          <h3 className="text-lg font-bold mt-1 text-white">
            Projected Next Semester Goal: {activeStudent.aiPrediction.predictedNextSGPA} SGPA
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Following these 5 personalized recommendations will maximize academic retention, reduce backlog probability to under 5%, and ensure exam eligibility.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('prediction')}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-blue-950 hover:bg-blue-50 transition shadow flex items-center gap-1.5"
        >
          Simulate Impact <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structuredRecs.map((rec) => {
          const Icon = rec.icon;
          const isUrgent = rec.priority === 'Urgent';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition hover:shadow-md flex flex-col justify-between ${
                isUrgent
                  ? 'border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rec.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Checklist */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Action Checklist
                  </span>
                  {rec.checklist.map((item, idx) => {
                    const taskId = `${rec.id}-${idx}`;
                    const isDone = completedTasks[taskId];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer text-xs transition select-none ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 line-through opacity-80'
                            : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 transition ${
                            isDone ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                        <span className="leading-snug">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {rec.actionLink && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setActiveTab(rec.actionLink)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {rec.actionText} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Weekly Schedule Summary */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" /> Recommended Daily Study Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeStudent.aiPrediction.studyPlan.map((p, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-center">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">{p.day}</span>
              <span className="text-base font-black font-mono text-purple-600 dark:text-purple-400 block my-1">
                {p.hours} hrs
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{p.focus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
