import { Complaint, StudentUser, AdminUser, AuthUser, ComplaintStatus, Priority, ComplaintCategory } from '../types';

const COMPLAINTS_KEY = 'college_complaints_v1';
const STUDENTS_KEY = 'college_students_v1';
const CURRENT_USER_KEY = 'college_current_user_v1';

export const ADMIN_CREDENTIALS = {
  email: 'admin@college.com',
  password: 'admin123',
  user: {
    id: 'ADMIN-001',
    fullName: 'Dr. Arthur Vance (Dean of Student Welfare)',
    email: 'admin@college.com',
    role: 'admin' as const,
    designation: 'Chief Grievance Officer & Dean',
    department: 'Central Administration Office',
  } satisfies AdminUser,
};

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Biotechnology',
  'Management Studies (MBA)',
];

export const YEARS_SEMESTERS = [
  '1st Year / 1st Sem',
  '1st Year / 2nd Sem',
  '2nd Year / 3rd Sem',
  '2nd Year / 4th Sem',
  '3rd Year / 5th Sem',
  '3rd Year / 6th Sem',
  '4th Year / 7th Sem',
  '4th Year / 8th Sem',
];

export const CATEGORIES: { label: ComplaintCategory; icon: string; description: string; color: string }[] = [
  { label: 'Hostel', icon: 'Building2', description: 'Room maintenance, plumbing, furniture, amenities', color: 'indigo' },
  { label: 'Electricity', icon: 'Zap', description: 'Power cuts, switches, lighting, fan & AC repairs', color: 'amber' },
  { label: 'Water', icon: 'Droplets', description: 'Water coolers, washroom supply, drinking water RO', color: 'cyan' },
  { label: 'Mess', icon: 'Utensils', description: 'Food quality, hygiene, catering & mess timings', color: 'emerald' },
  { label: 'Classroom', icon: 'School', description: 'Projectors, smartboards, benches, ventilation', color: 'blue' },
  { label: 'Faculty-related Issues', icon: 'GraduationCap', description: 'Syllabus coverage, timetable overlaps, lectures', color: 'purple' },
  { label: 'Other', icon: 'HelpCircle', description: 'Library, sports grounds, Wi-Fi, transportation', color: 'slate' },
];

export const PRIORITIES: { label: Priority; color: string; desc: string }[] = [
  { label: 'Low', color: 'slate', desc: 'Minor issue, can be addressed within 5-7 working days' },
  { label: 'Medium', color: 'blue', desc: 'Moderate concern, resolution needed within 3 days' },
  { label: 'High', color: 'orange', desc: 'Significant impact on daily routine, 24-48 hr target' },
  { label: 'Urgent', color: 'red', desc: 'Critical safety, water/power or health emergency (Same day)' },
];

// Initial demo students
const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'STU-101',
    fullName: 'Rahul Sharma',
    studentId: '2023CSB042',
    email: 'rahul.sharma@college.edu',
    password: 'password123',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 6th Sem',
    phone: '+91 98765 43210',
    role: 'student',
    registeredAt: '2026-01-10T09:30:00.000Z',
  },
  {
    id: 'STU-102',
    fullName: 'Ananya Verma',
    studentId: '2024ECE118',
    email: 'ananya.verma@college.edu',
    password: 'password123',
    department: 'Electronics & Communication Engineering',
    yearSemester: '2nd Year / 4th Sem',
    phone: '+91 98111 22334',
    role: 'student',
    registeredAt: '2026-01-15T11:00:00.000Z',
  },
  {
    id: 'STU-103',
    fullName: 'Karthik Nair',
    studentId: '2022MECH077',
    email: 'karthik.nair@college.edu',
    password: 'password123',
    department: 'Mechanical Engineering',
    yearSemester: '4th Year / 8th Sem',
    phone: '+91 97455 66778',
    role: 'student',
    registeredAt: '2026-01-20T14:20:00.000Z',
  },
];

// Realistic initial demo complaints
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-0812',
    studentId: '2023CSB042',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@college.edu',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 6th Sem',
    title: 'Ceiling fan malfunctioning and high screeching noise',
    category: 'Electricity',
    location: 'Hostel Block-C, Room 308',
    priority: 'Medium',
    description: 'The ceiling fan regulator sparks occasionally and the motor makes a loud vibrating noise making it impossible to sleep or study during night hours.',
    status: 'In Progress',
    createdAt: '2026-08-12T10:15:00.000Z',
    updatedAt: '2026-08-13T14:30:00.000Z',
    adminRemarks: 'Assigned to Electrical Maintenance Team (Technician: Rajesh Kumar). Capacitor and bearings scheduled for replacement.',
    assignedDepartmentOfficer: 'Electrical Maintenance Dept',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-12T10:15:00.000Z',
        note: 'Complaint registered by student.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-13T14:30:00.000Z',
        note: 'Inspected by Warden. Work order #EL-491 dispatched.',
        updatedBy: 'Admin Office',
      },
    ],
  },
  {
    id: 'CMP-2026-0814',
    studentId: '2023CSB042',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@college.edu',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 6th Sem',
    title: 'Drinking water RO cooler filter leaking and muddy discharge',
    category: 'Water',
    location: 'Academic Block 3, 2nd Floor Corridor',
    priority: 'Urgent',
    description: 'The RO water dispenser on the second floor is leaking heavily on the floor causing a slip hazard. Additionally, water coming out has a cloudy sediment.',
    status: 'Resolved',
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-11T16:45:00.000Z',
    resolvedAt: '2026-08-11T16:45:00.000Z',
    adminRemarks: 'Full filter cartridge replacement and pipeline cleaning done. Water tested and approved for drinking.',
    resolutionNote: 'RO membrane replaced by AquaTech service provider. Pressure valve calibrated and floor drainage cleared.',
    assignedDepartmentOfficer: 'Sanitation & Health Division',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-10T08:00:00.000Z',
        note: 'Urgent water safety complaint submitted.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-10T11:20:00.000Z',
        note: 'Plumbing contractor called on site.',
        updatedBy: 'Campus Supervisor',
      },
      {
        status: 'Resolved',
        timestamp: '2026-08-11T16:45:00.000Z',
        note: 'New filters fitted, water quality verified TDS 110 ppm.',
        updatedBy: 'Chief Grievance Officer',
      },
    ],
  },
  {
    id: 'CMP-2026-0819',
    studentId: '2023CSB042',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@college.edu',
    department: 'Computer Science & Engineering',
    yearSemester: '3rd Year / 6th Sem',
    title: 'HDMI projector in CS Seminar Hall 2 color distortion',
    category: 'Classroom',
    location: 'CS Department, Seminar Hall 2',
    priority: 'Low',
    description: 'During project presentations, the projector display shows heavy yellow tint and flickering lines. It seems the HDMI port on the podium is loose.',
    status: 'Pending',
    createdAt: '2026-08-15T15:20:00.000Z',
    updatedAt: '2026-08-15T15:20:00.000Z',
    adminRemarks: '',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-15T15:20:00.000Z',
        note: 'Submitted by student. Awaiting initial administrative review.',
        updatedBy: 'System',
      },
    ],
  },
  {
    id: 'CMP-2026-0795',
    studentId: '2024ECE118',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.verma@college.edu',
    department: 'Electronics & Communication Engineering',
    yearSemester: '2nd Year / 4th Sem',
    title: 'Sub-standard food quality & undercooked chapati in Girls Mess',
    category: 'Mess',
    location: 'Girls Hostel Mess 1 (Cauvery Block)',
    priority: 'High',
    description: 'Dinner served on 13th August had undercooked food and hygiene issues around the salad counter. Multiple students suffered indigestion.',
    status: 'In Progress',
    createdAt: '2026-08-14T07:45:00.000Z',
    updatedAt: '2026-08-14T18:10:00.000Z',
    adminRemarks: 'Mess inspection team summoned the catering vendor. Surprise audit conducted by Mess Committee.',
    assignedDepartmentOfficer: 'Mess & Food Committee',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-14T07:45:00.000Z',
        note: 'Complaint filed regarding mess food hygiene.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-14T18:10:00.000Z',
        note: 'Warning notice issued to catering manager. Quality testing initiated.',
        updatedBy: 'Dean Student Welfare',
      },
    ],
  },
  {
    id: 'CMP-2026-0780',
    studentId: '2022MECH077',
    studentName: 'Karthik Nair',
    studentEmail: 'karthik.nair@college.edu',
    department: 'Mechanical Engineering',
    yearSemester: '4th Year / 8th Sem',
    title: 'Lab 4 CNC lathe machine safety guard hinge cracked',
    category: 'Classroom',
    location: 'Central Workshop, Machine Lab 4',
    priority: 'Urgent',
    description: 'The transparent polycarbonate protective visor on CNC Lathe #2 has a severe crack along the hinge mounting and may shatter under metal chip deflection.',
    status: 'In Progress',
    createdAt: '2026-08-13T11:00:00.000Z',
    updatedAt: '2026-08-13T13:15:00.000Z',
    adminRemarks: 'Machine tagged Out of Service immediately. Replacement safety shield ordered from OEM vendor.',
    assignedDepartmentOfficer: 'Workshop Superintendent',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-13T11:00:00.000Z',
        note: 'Reported as urgent lab equipment safety risk.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-13T13:15:00.000Z',
        note: 'Safety lockdown active. Replacement parts on order.',
        updatedBy: 'Lab Incharge',
      },
    ],
  },
  {
    id: 'CMP-2026-0744',
    studentId: '2024ECE118',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.verma@college.edu',
    department: 'Electronics & Communication Engineering',
    yearSemester: '2nd Year / 4th Sem',
    title: 'Hostel Wi-Fi access point in Block A corridor dropping connections',
    category: 'Other',
    location: 'Girls Hostel Block-A, 1st Floor',
    priority: 'Medium',
    description: 'The Cisco AP reboot loop occurs every 10 minutes. Students cannot attend online seminar submissions.',
    status: 'Resolved',
    createdAt: '2026-08-08T19:30:00.000Z',
    updatedAt: '2026-08-09T14:10:00.000Z',
    resolvedAt: '2026-08-09T14:10:00.000Z',
    adminRemarks: 'PoE injector power supply replaced and firmware flashed to v4.9.',
    resolutionNote: 'Access point reboot issue resolved. Signal strength verified in rooms 101 to 124.',
    assignedDepartmentOfficer: 'IT & Network Infrastructure Cell',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-08T19:30:00.000Z',
        note: 'Network issue logged.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-09T09:15:00.000Z',
        note: 'Network engineer assigned.',
        updatedBy: 'IT Admin',
      },
      {
        status: 'Resolved',
        timestamp: '2026-08-09T14:10:00.000Z',
        note: 'Hardware swapped and signal test passed.',
        updatedBy: 'IT Admin',
      },
    ],
  },
  {
    id: 'CMP-2026-0710',
    studentId: '2022MECH077',
    studentName: 'Karthik Nair',
    studentEmail: 'karthik.nair@college.edu',
    department: 'Mechanical Engineering',
    yearSemester: '4th Year / 8th Sem',
    title: 'Clashing elective lecture timing for Robotics and Heat Transfer',
    category: 'Faculty-related Issues',
    location: 'Mechanical Dept Notice Board / Academic Cell',
    priority: 'High',
    description: 'Both ME402 (Advanced Robotics) and ME408 (Computational Heat Transfer) are scheduled on Monday 2-4 PM in the new timetable.',
    status: 'Resolved',
    createdAt: '2026-08-02T10:00:00.000Z',
    updatedAt: '2026-08-04T12:00:00.000Z',
    resolvedAt: '2026-08-04T12:00:00.000Z',
    adminRemarks: 'Consulted Head of Department and Dean Academics.',
    resolutionNote: 'Timetable revised. Advanced Robotics shifted to Thursday 2-4 PM slot. Revised schedule posted.',
    assignedDepartmentOfficer: 'Academic Coordination Committee',
    timeline: [
      {
        status: 'Pending',
        timestamp: '2026-08-02T10:00:00.000Z',
        note: 'Timetable conflict reported.',
        updatedBy: 'System',
      },
      {
        status: 'In Progress',
        timestamp: '2026-08-03T11:30:00.000Z',
        note: 'Deliberation with Dean Academics.',
        updatedBy: 'HOD Mechanical',
      },
      {
        status: 'Resolved',
        timestamp: '2026-08-04T12:00:00.000Z',
        note: 'Slot adjusted and notification circulated.',
        updatedBy: 'Academic Cell',
      },
    ],
  },
];

// Helper to init storage if not present
function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
  }

  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  }
}

initializeStorage();

// Complaints API
export function getComplaints(): Complaint[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_COMPLAINTS;
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new Event('college_complaints_updated'));
  } catch (err) {
    console.error('Error saving complaints:', err);
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  const complaints = getComplaints();
  return complaints.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${randomNum}`;
}

export function addComplaint(data: {
  title: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  priority: Priority;
  imageUrl?: string;
  imageName?: string;
  student: StudentUser;
}): Complaint {
  const complaints = getComplaints();
  const id = generateComplaintId();
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    id,
    studentId: data.student.studentId,
    studentName: data.student.fullName,
    studentEmail: data.student.email,
    department: data.student.department,
    yearSemester: data.student.yearSemester,
    title: data.title.trim(),
    category: data.category,
    location: data.location.trim(),
    priority: data.priority,
    description: data.description.trim(),
    imageUrl: data.imageUrl,
    imageName: data.imageName,
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    adminRemarks: '',
    timeline: [
      {
        status: 'Pending',
        timestamp: now,
        note: 'Complaint submitted by student. Pending review by campus administration.',
        updatedBy: data.student.fullName,
      },
    ],
  };

  complaints.unshift(newComplaint);
  saveComplaints(complaints);
  return newComplaint;
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  adminRemarks?: string,
  resolutionNote?: string,
  officerName?: string
): Complaint | null {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const current = complaints[index];
  const now = new Date().toISOString();

  const timelineNote =
    newStatus === 'Resolved'
      ? resolutionNote || adminRemarks || 'Issue verified and marked resolved by administration.'
      : adminRemarks || `Status updated to ${newStatus}.`;

  const updatedTimeline = [
    ...current.timeline,
    {
      status: newStatus,
      timestamp: now,
      note: timelineNote,
      updatedBy: officerName || 'Campus Admin',
    },
  ];

  const updatedComplaint: Complaint = {
    ...current,
    status: newStatus,
    adminRemarks: adminRemarks !== undefined ? adminRemarks : current.adminRemarks,
    resolutionNote: resolutionNote !== undefined ? resolutionNote : current.resolutionNote,
    resolvedAt: newStatus === 'Resolved' ? (current.resolvedAt || now) : undefined,
    assignedDepartmentOfficer: officerName || current.assignedDepartmentOfficer,
    updatedAt: now,
    timeline: updatedTimeline,
  };

  complaints[index] = updatedComplaint;
  saveComplaints(complaints);
  return updatedComplaint;
}

// Students / Auth API
export function getStudents(): StudentUser[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: StudentUser[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students:', err);
  }
}

export function registerStudent(studentData: {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  department: string;
  yearSemester: string;
  phone?: string;
}): { success: boolean; message: string; user?: StudentUser } {
  const students = getStudents();
  const trimmedEmail = studentData.email.trim().toLowerCase();
  const trimmedStudentId = studentData.studentId.trim().toUpperCase();

  const existingEmail = students.find((s) => s.email.toLowerCase() === trimmedEmail);
  if (existingEmail) {
    return { success: false, message: 'An account with this email address already exists.' };
  }

  const existingId = students.find((s) => s.studentId.toUpperCase() === trimmedStudentId);
  if (existingId) {
    return { success: false, message: 'A student with this Roll Number / Student ID is already registered.' };
  }

  const newStudent: StudentUser = {
    id: `STU-${Date.now().toString().slice(-4)}`,
    fullName: studentData.fullName.trim(),
    studentId: trimmedStudentId,
    email: trimmedEmail,
    password: studentData.password,
    department: studentData.department,
    yearSemester: studentData.yearSemester,
    phone: studentData.phone?.trim(),
    role: 'student',
    registeredAt: new Date().toISOString(),
  };

  students.push(newStudent);
  saveStudents(students);
  setCurrentUser(newStudent);

  return { success: true, message: 'Registration successful!', user: newStudent };
}

export function authenticateStudent(
  identifier: string, // Email or Student ID
  password: string
): { success: boolean; message: string; user?: StudentUser } {
  const students = getStudents();
  const cleanId = identifier.trim().toLowerCase();

  const student = students.find(
    (s) =>
      (s.email.toLowerCase() === cleanId || s.studentId.toLowerCase() === cleanId) &&
      s.password === password
  );

  if (!student) {
    return {
      success: false,
      message: 'Invalid credentials. Please check your Student ID / Email and password.',
    };
  }

  setCurrentUser(student);
  return { success: true, message: 'Login successful!', user: student };
}

export function authenticateAdmin(
  email: string,
  password: string
): { success: boolean; message: string; user?: AdminUser } {
  if (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  ) {
    setCurrentUser(ADMIN_CREDENTIALS.user);
    return { success: true, message: 'Admin authenticated successfully!', user: ADMIN_CREDENTIALS.user };
  }

  return {
    success: false,
    message: 'Invalid admin credentials. Use admin@college.com / admin123 for demo access.',
  };
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('college_auth_updated'));
  } catch (err) {
    console.error('Error setting current user:', err);
  }
}

export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event('college_auth_updated'));
  } catch (err) {
    console.error('Error clearing current user:', err);
  }
}

export function updateStudentProfile(
  studentId: string,
  updates: Partial<Pick<StudentUser, 'fullName' | 'department' | 'yearSemester' | 'phone' | 'email'>>
): { success: boolean; user?: StudentUser; message: string } {
  const students = getStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) {
    return { success: false, message: 'Student profile not found.' };
  }

  const updated: StudentUser = {
    ...students[index],
    ...updates,
  };

  students[index] = updated;
  saveStudents(students);

  // Update current user if matching
  const current = getCurrentUser();
  if (current && current.role === 'student' && current.studentId === studentId) {
    setCurrentUser(updated);
  }

  // Also update author info across student's complaints
  const complaints = getComplaints();
  let complaintsModified = false;
  const newComplaints = complaints.map((c) => {
    if (c.studentId === studentId) {
      complaintsModified = true;
      return {
        ...c,
        studentName: updated.fullName,
        studentEmail: updated.email,
        department: updated.department,
        yearSemester: updated.yearSemester,
      };
    }
    return c;
  });

  if (complaintsModified) {
    saveComplaints(newComplaints);
  }

  return { success: true, user: updated, message: 'Profile updated successfully!' };
}

export function resetToDemoData(): void {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  window.dispatchEvent(new Event('college_complaints_updated'));
}
