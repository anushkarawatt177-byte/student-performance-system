import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_STUDENTS } from './src/data/mockStudents';
import { Student } from './src/types/student';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory student store
let students: Student[] = JSON.parse(JSON.stringify(INITIAL_STUDENTS));

// Shared Gemini AI client setup per guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// REST API Routes

// GET all students
app.get('/api/students', (_req: Request, res: Response) => {
  res.json({ success: true, count: students.length, data: students });
});

// GET single student
app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }
  return res.json({ success: true, data: student });
});

// POST create student
app.post('/api/students', (req: Request, res: Response) => {
  const newStudent: Student = {
    ...req.body,
    id: `std-${Date.now()}`,
    semesterHistory: req.body.semesterHistory || [
      { semester: 'Sem 1', sgpa: 7.5, percentage: 74, attendance: 85, creditsEarned: 22 },
      { semester: 'Sem 2', sgpa: 7.8, percentage: 76, attendance: 84, creditsEarned: 22 },
      { semester: 'Sem 3', sgpa: 8.0, percentage: 79, attendance: 86, creditsEarned: 24 },
    ],
    monthlyAttendance: req.body.monthlyAttendance || [
      { month: 'Jul', attended: 20, total: 23, percentage: 86.9 },
      { month: 'Aug', attended: 22, total: 26, percentage: 84.6 },
      { month: 'Sep', attended: 21, total: 25, percentage: 84.0 },
      { month: 'Oct', attended: 22, total: 25, percentage: 88.0 },
      { month: 'Nov', attended: 18, total: 21, percentage: 85.7 },
      { month: 'Dec', attended: 16, total: 19, percentage: 84.2 },
    ],
    aiPrediction: req.body.aiPrediction || {
      predictedNextSGPA: 8.1,
      predictedNextPercentage: 79.5,
      riskAssessment: 'Low Risk',
      confidenceScore: 88,
      predictedGrade: 'A',
      backlogProbability: 5.0,
      weakSubjects: [],
      strongSubjects: [],
      personalizedRecommendations: [
        'Maintain balanced study hours across core computer science and elective subjects.',
        'Keep overall attendance consistently above the 80% mark.',
      ],
      studyPlan: [
        { day: 'Mon-Wed', focus: 'Core Theory & Problem Solving', hours: 2.5 },
        { day: 'Thu-Fri', focus: 'Lab Assignments & System Implementation', hours: 2.0 },
        { day: 'Weekend', focus: 'Weekly Revision & Self Assessment', hours: 3.5 },
      ],
    },
    activities: [
      {
        id: `act-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'alert',
        title: 'Student Profile Registered',
        description: `Enrolled into ${req.body.course || 'B.Tech Program'} successfully.`,
        statusBadge: 'Active',
      },
    ],
  };

  students.unshift(newStudent);
  res.status(201).json({ success: true, data: newStudent });
});

// PUT update student
app.put('/api/students/:id', (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }

  students[index] = {
    ...students[index],
    ...req.body,
    id: students[index].id, // protect ID
  };

  return res.json({ success: true, data: students[index] });
});

// DELETE student
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const exists = students.some((s) => s.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }
  students = students.filter((s) => s.id !== req.params.id);
  return res.json({ success: true, message: 'Student record deleted successfully' });
});

// System Analytics Overview
app.get('/api/analytics/summary', (_req: Request, res: Response) => {
  const total = students.length;
  const avgAttendance = total ? students.reduce((acc, s) => acc + s.attendancePercentage, 0) / total : 0;
  const avgMarks = total ? students.reduce((acc, s) => acc + s.overallPercentage, 0) / total : 0;
  const atRiskCount = students.filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Critical' || s.attendancePercentage < 75).length;
  const honorsCount = students.filter((s) => s.cgpa >= 8.5).length;

  res.json({
    totalStudents: total,
    averageAttendance: parseFloat(avgAttendance.toFixed(1)),
    averageScore: parseFloat(avgMarks.toFixed(1)),
    atRiskStudents: atRiskCount,
    honorsStudents: honorsCount,
  });
});

// AI Performance Prediction & Academic Advisory endpoint
app.post('/api/ai/predict', async (req: Request, res: Response) => {
  try {
    const { studentId, customGoal } = req.body;
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // If Gemini client is configured with API key, request personalized AI generation
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a Senior Academic Analytics Specialist and AI Student Counselor at an accredited Engineering College.
Analyze this student record and output a structured JSON analysis.

Student Profile:
Name: ${student.name}
Roll Number: ${student.rollNo}
Degree/Course: ${student.course}
Semester: ${student.semester}
Current CGPA: ${student.cgpa}
Overall Marks %: ${student.overallPercentage}%
Attendance %: ${student.attendancePercentage}%
Subjects & Marks: ${JSON.stringify(student.subjects.map((s) => ({ subject: s.name, marks: s.totalMarks, attendance: s.attendancePercentage, weak: s.weakTopics })))}
User Goal / Query: ${customGoal || 'Provide comprehensive next semester forecast and actionable study plan.'}

Respond with a JSON object strictly following this structure:
{
  "predictedNextSGPA": number,
  "predictedNextPercentage": number,
  "riskAssessment": "Low Risk" | "Medium Risk" | "High Risk",
  "confidenceScore": number,
  "predictedGrade": string,
  "backlogProbability": number,
  "weakSubjects": string[],
  "strongSubjects": string[],
  "personalizedRecommendations": string[],
  "studyPlan": [{"day": string, "focus": string, "hours": number}],
  "whatIfScenarios": [{"scenario": string, "expectedOutcome": string}],
  "counselorSummary": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          return res.json({ success: true, aiGenerated: true, data: parsed });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to heuristic engine:', geminiError);
      }
    }

    // Heuristic predictive calculation fallback (guaranteed to always work seamlessly)
    const isAttendanceLow = student.attendancePercentage < 75;
    const isMarksLow = student.overallPercentage < 60;
    const backlogProb = isAttendanceLow && isMarksLow ? 75 : isAttendanceLow ? 45 : isMarksLow ? 35 : 3;

    // Projected calculation using weighted decay and attendance modifier
    const projectedSGPA = Math.min(
      10.0,
      Math.max(
        4.0,
        parseFloat(
          (student.cgpa + (student.attendancePercentage >= 85 ? 0.2 : student.attendancePercentage < 75 ? -0.35 : 0.05)).toFixed(2)
        )
      )
    );
    const projectedPct = Math.min(99, Math.max(45, parseFloat((student.overallPercentage + (student.attendancePercentage >= 85 ? 1.5 : -2.8)).toFixed(1))));

    const weakSubs = student.subjects.filter((s) => s.totalMarks < 65 || s.attendancePercentage < 75).map((s) => s.name);
    const strongSubs = student.subjects.filter((s) => s.totalMarks >= 80).map((s) => s.name);

    const fallbackResult = {
      predictedNextSGPA: projectedSGPA,
      predictedNextPercentage: projectedPct,
      riskAssessment: isAttendanceLow || isMarksLow ? (student.attendancePercentage < 65 ? 'High Risk' : 'Medium Risk') : 'Low Risk',
      confidenceScore: 92,
      predictedGrade: projectedSGPA >= 9.0 ? 'A+ (Distinction)' : projectedSGPA >= 8.0 ? 'A (Very Good)' : projectedSGPA >= 6.5 ? 'B (Good)' : 'D (Needs Support)',
      backlogProbability: backlogProb,
      weakSubjects: weakSubs.length ? weakSubs : ['Complex Algorithms proof writing'],
      strongSubjects: strongSubs.length ? strongSubs : ['System Architecture'],
      personalizedRecommendations: [
        student.attendancePercentage < 75
          ? `Urgent: Attendance is currently ${student.attendancePercentage}%. Attend the next ${Math.ceil((0.75 * 40 - 25) / 1)} lectures to exceed the 75% examination eligibility requirement.`
          : 'Maintain high class participation and target scoring 28+ on internal class assessments.',
        weakSubs.length ? `Dedicate 45 minutes daily to revise core concepts in ${weakSubs.join(', ')}.` : 'Explore advanced research papers and competitive programming benchmarks.',
        'Submit all pending lab assignments at least 48 hours before official deadlines to secure top internal grades.',
      ],
      studyPlan: [
        { day: 'Monday', focus: `${weakSubs[0] || 'Core Subject'} Theoretical Foundation`, hours: 2.5 },
        { day: 'Tuesday', focus: 'Programming Practice & Laboratory Exercises', hours: 2.0 },
        { day: 'Wednesday', focus: 'Midterm Question Paper Analysis', hours: 2.0 },
        { day: 'Thursday', focus: 'Group Revision & Peer Problem Discussion', hours: 1.5 },
        { day: 'Friday', focus: 'Elective Course Review & Assignment Polish', hours: 2.0 },
        { day: 'Weekend', focus: 'Mock Assessment & Full Syllabus Recap', hours: 4.0 },
      ],
      whatIfScenarios: [
        {
          scenario: 'Increase attendance to 85%+ and score 80+ in upcoming midterms',
          expectedOutcome: `Projected SGPA climbs to ${Math.min(10, projectedSGPA + 0.45).toFixed(2)}, clearing all academic probation flags.`,
        },
        {
          scenario: 'Miss 6 more consecutive lectures in core technical subjects',
          expectedOutcome: 'Exam detention risk increases to over 85%, disqualifying semester examination hall ticket.',
        },
      ],
      counselorSummary: `Statistical analysis of ${student.name}'s performance indicates ${student.attendancePercentage >= 75 ? 'a robust' : 'an unstable'} learning trend. Prioritizing attendance and structured revision will yield significant grade improvement.`,
    };

    return res.json({ success: true, aiGenerated: false, data: fallbackResult });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal AI evaluation error' });
  }
});

// Start Express and mount Vite dev middleware
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production if needed
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Intelligent Student Performance Analytics System running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
