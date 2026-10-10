export type UserRole = 'student' | 'admin';

export type ComplaintCategory =
  | 'Hostel'
  | 'Electricity'
  | 'Water'
  | 'Mess'
  | 'Classroom'
  | 'Faculty-related Issues'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface TimelineEvent {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  department: string;
  yearSemester: string;
  title: string;
  category: ComplaintCategory;
  location: string;
  priority: Priority;
  description: string;
  imageUrl?: string;
  imageName?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  assignedDepartmentOfficer?: string;
  timeline: TimelineEvent[];
}

export interface StudentUser {
  id: string;
  fullName: string;
  studentId: string; // Roll Number
  email: string;
  password?: string;
  department: string;
  yearSemester: string;
  phone?: string;
  role: 'student';
  registeredAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin';
  designation: string;
  department: string;
}

export type AuthUser = StudentUser | AdminUser;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
