export type PerformanceStatus = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type UserRole = 'student' | 'teacher' | 'admin';

export interface SubjectRecord {
  code: string;
  name: string;
  credits: number;
  internalMarks: number; // e.g. out of 30
  externalMarks: number; // e.g. out of 70
  totalMarks: number;    // out of 100
  grade: string;
  attendanceAttended: number;
  attendanceTotal: number;
  attendancePercentage: number;
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface SemesterHistory {
  semester: string;
  sgpa: number;
  percentage: number;
  attendance: number;
  creditsEarned: number;
}

export interface MonthlyAttendance {
  month: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface AIPrediction {
  predictedNextSGPA: number;
  predictedNextPercentage: number;
  riskAssessment: 'Low Risk' | 'Medium Risk' | 'High Risk';
  confidenceScore: number; // 0 - 100%
  predictedGrade: string;
  backlogProbability: number; // 0 - 100%
  weakSubjects: string[];
  strongSubjects: string[];
  personalizedRecommendations: string[];
  studyPlan: {
    day: string;
    focus: string;
    hours: number;
  }[];
  whatIfScenarios?: {
    scenario: string;
    expectedOutcome: string;
  }[];
}

export interface AcademicActivity {
  id: string;
  date: string;
  type: 'exam' | 'assignment' | 'attendance' | 'alert' | 'ai_insight';
  title: string;
  description: string;
  score?: string;
  statusBadge?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  semester: string;
  section: string;
  cgpa: number;
  overallPercentage: number;
  attendancePercentage: number;
  performanceStatus: PerformanceStatus;
  riskLevel: RiskLevel;
  mentorName: string;
  phone: string;
  subjects: SubjectRecord[];
  semesterHistory: SemesterHistory[];
  monthlyAttendance: MonthlyAttendance[];
  aiPrediction: AIPrediction;
  activities: AcademicActivity[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  studentId?: string; // If student
  department?: string; // If teacher/admin
  designation?: string;
}
