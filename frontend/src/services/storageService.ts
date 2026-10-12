import { Complaint, StudentUser, AdminUser, AuthUser, ComplaintStatus, Priority, ComplaintCategory } from '../types';

export const COMPLAINTS_KEY = 'college_complaints_v2';
export const STUDENTS_KEY = 'college_students_v1';
export const CURRENT_USER_KEY = 'college_current_user_v1';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://college-management-bopp.onrender.com'
    : 'https://college-management-bopp.onrender.com')
).replace(/\/+$/, '');

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

const INITIAL_STUDENTS: StudentUser[] = [];
const INITIAL_COMPLAINTS: Complaint[] = [];

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

// Complaints API - Synchronous getters for instant cached access
export function getComplaints(): Complaint[] {
  initializeStorage();
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new Event('college_complaints_updated'));
  } catch (err) {
    console.error('Error saving complaints to cache:', err);
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  if (!id) return undefined;
  const complaints = getComplaints();
  const searchId = id.trim().toLowerCase();
  return complaints.find(
    (c) =>
      (c.id && c.id.toLowerCase() === searchId) ||
      ((c as any).complaintId && (c as any).complaintId.toLowerCase() === searchId) ||
      ((c as any)._id && (c as any)._id.toString().toLowerCase() === searchId)
  );
}

export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${randomNum}`;
}

// Fetch complaints directly from the MongoDB backend API
export async function fetchComplaintsFromServer(studentId?: string): Promise<Complaint[]> {
  try {
    const url = studentId
      ? `${API_BASE_URL}/api/complaints?studentId=${encodeURIComponent(studentId.trim())}`
      : `${API_BASE_URL}/api/complaints`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch from backend (HTTP ${res.status})`);
    }

    const data = await res.json();
    const rawList: any[] = Array.isArray(data) ? data : data.complaints || [];

    const normalized: Complaint[] = rawList.map((c: any) => ({
      ...c,
      id: c.complaintId || c.id || (c._id ? c._id.toString() : ''),
      studentName: c.studentName || 'Student',
      studentId: c.studentId || '',
      studentEmail: c.studentEmail || '',
      department: c.department || 'General',
      yearSemester: c.yearSemester || 'N/A',
      studentPhone: c.studentPhone || c.phone || '',
      location: c.location || 'Campus',
      priority: c.priority || 'Medium',
      status: c.status || 'Pending',
      description: c.description || '',
      title: c.title || 'Complaint',
      imageUrl: c.imageUrl || undefined,
      imageName: c.imageName || undefined,
      createdAt: c.createdAt || new Date().toISOString(),
      timeline: Array.isArray(c.timeline) ? c.timeline : [],
    }));

    if (!studentId) {
      // Admin dashboard loaded all complaints
      saveComplaints(normalized);
    } else {
      // Student loaded their complaints: merge with any others in cache
      const cachedOther = getComplaints().filter(
        (c) => (c.studentId || '').toUpperCase() !== studentId.trim().toUpperCase()
      );
      saveComplaints([...normalized, ...cachedOther]);
    }

    return normalized;
  } catch (err) {
    console.error('[API Error] Could not load complaints from server:', err);
    return getComplaints();
  }
}

// Save complaint directly to MongoDB backend API
export async function addComplaint(data: {
  title: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  priority: Priority;
  imageUrl?: string;
  imageName?: string;
  student: StudentUser;
}): Promise<Complaint> {
  const generatedId = generateComplaintId();
  const now = new Date().toISOString();

  const payload = {
    complaintId: generatedId,
    studentId: data.student.studentId,
    studentName: data.student.fullName,
    studentEmail: data.student.email,
    department: data.student.department,
    yearSemester: data.student.yearSemester,
    studentPhone: data.student.phone || '',
    title: data.title.trim(),
    category: data.category,
    location: data.location.trim(),
    priority: data.priority,
    description: data.description.trim(),
    imageUrl: data.imageUrl,
    imageName: data.imageName,
    status: 'Pending',
    timeline: [
      {
        status: 'Pending',
        timestamp: now,
        note: 'Complaint submitted by student. Pending review by campus administration.',
        updatedBy: data.student.fullName,
      },
    ],
  };

  const res = await fetch(`${API_BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Server error (HTTP ${res.status}): Failed to save complaint`);
  }

  const saved: any = await res.json();
  const newComplaint: Complaint = {
    ...saved,
    id: saved.complaintId || saved.id || (saved._id ? saved._id.toString() : generatedId),
  };

  // Prepend to local cache and notify listeners
  const existing = getComplaints().filter((c) => c.id !== newComplaint.id);
  saveComplaints([newComplaint, ...existing]);

  return newComplaint;
}

// Update complaint status directly on MongoDB backend API
export async function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  adminRemarks?: string,
  resolutionNote?: string,
  officerName?: string
): Promise<Complaint | null> {
  const payload = {
    status: newStatus,
    adminRemarks: adminRemarks !== undefined ? adminRemarks.trim() : undefined,
    resolutionNote: resolutionNote !== undefined ? resolutionNote.trim() : undefined,
    officerName: officerName ? officerName.trim() : 'Campus Admin',
  };

  const res = await fetch(`${API_BASE_URL}/api/complaints/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Server error (HTTP ${res.status}): Failed to update status`);
  }

  const saved: any = await res.json();
  const updatedComplaint: Complaint = {
    ...saved,
    id: saved.complaintId || saved.id || (saved._id ? saved._id.toString() : id),
  };

  const existing = getComplaints();
  const index = existing.findIndex((c) => c.id === id || c.id === updatedComplaint.id);
  if (index !== -1) {
    existing[index] = updatedComplaint;
  } else {
    existing.unshift(updatedComplaint);
  }
  saveComplaints([...existing]);

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
  identifier: string,
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

  const current = getCurrentUser();
  if (current && current.role === 'student' && current.studentId === studentId) {
    setCurrentUser(updated);
  }

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
