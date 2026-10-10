import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, YEARS_SEMESTERS, getComplaints } from '../../services/storageService';
import { User, Mail, BookOpen, GraduationCap, Phone, KeyRound, Save, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';

interface StudentProfileProps {
  onNavigate: (view: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ onNavigate }) => {
  const { studentUser, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState(studentUser?.fullName || '');
  const [email, setEmail] = useState(studentUser?.email || '');
  const [phone, setPhone] = useState(studentUser?.phone || '');
  const [department, setDepartment] = useState(studentUser?.department || DEPARTMENTS[0]);
  const [yearSemester, setYearSemester] = useState(studentUser?.yearSemester || YEARS_SEMESTERS[0]);
  const [saving, setSaving] = useState(false);

  // Complaints stats
  const allComplaints = getComplaints();
  const studentComplaints = allComplaints.filter(
    (c) => c.studentId.toUpperCase() === (studentUser?.studentId || '').toUpperCase()
  );
  const resolvedCount = studentComplaints.filter((c) => c.status === 'Resolved').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      error('Validation Error', 'Full name and email are mandatory.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const res = updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        yearSemester,
      });

      setSaving(false);
      if (res.success) {
        success('Profile Saved', 'Your student details have been updated successfully.');
      } else {
        error('Update Failed', res.message);
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <button
          id="btn-back-from-profile"
          onClick={() => onNavigate('student-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Student Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your college identity, department information, and contact preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left ID Card Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {fullName.charAt(0) || 'S'}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
            <p className="text-xs font-mono font-semibold text-blue-700 mt-0.5 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              {studentUser?.studentId}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-xs text-left">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800 text-right">{department}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Academic Year:</span>
              <span className="font-semibold text-slate-800">{yearSemester}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Tickets Lodged:</span>
              <span className="font-semibold text-slate-800">{studentComplaints.length}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Resolved Rate:</span>
              <span className="font-semibold text-emerald-600">
                {studentComplaints.length > 0
                  ? `${Math.round((resolvedCount / studentComplaints.length) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Edit Student Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profile-input-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student ID / Roll Number (Immutable)
                </label>
                <input
                  id="profile-input-id"
                  type="text"
                  disabled
                  value={studentUser?.studentId || ''}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="profile-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  id="profile-input-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  id="profile-select-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year / Semester</label>
                <select
                  id="profile-select-year"
                  value={yearSemester}
                  onChange={(e) => setYearSemester(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {YEARS_SEMESTERS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                id="btn-save-profile"
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
