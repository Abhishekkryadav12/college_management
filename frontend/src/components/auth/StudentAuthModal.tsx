import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, YEARS_SEMESTERS } from '../../services/storageService';
import { triggerSuccessCelebration } from '../../utils/celebration';
import { User, Lock } from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess: () => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { loginStudent, registerNewStudent } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState(DEPARTMENTS[0]);
  const [regYearSemester, setRegYearSemester] = useState(YEARS_SEMESTERS[4]); // 3rd Year
  const [regPhone, setRegPhone] = useState('');

  const [loading, setLoading] = useState(false);

  // Sync mode when initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      error('Missing fields', 'Please enter your Email and password.');
      return;
    }

    setLoading(true);
    const res = await loginStudent(loginIdentifier, loginPassword);
    setLoading(false);
    
    if (res.success) {
      triggerSuccessCelebration();
      success('Welcome back!', `Logged in as ${res.user?.fullName}`);
      onClose();
      onSuccess();
    } else {
      error('Authentication Failed', res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !regFullName.trim() ||
      !regStudentId.trim() ||
      !regEmail.trim() ||
      !regPassword.trim() ||
      !regDepartment ||
      !regYearSemester
    ) {
      error('Validation Error', 'Please fill in all mandatory registration fields.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      error('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      error('Password Mismatch', 'The passwords entered do not match.');
      return;
    }

    setLoading(true);
    const res = await registerNewStudent({
      fullName: regFullName,
      studentId: regStudentId,
      email: regEmail,
      password: regPassword,
      department: regDepartment,
      yearSemester: regYearSemester,
      phone: regPhone,
    });
    setLoading(false);
    
    if (res.success) {
      triggerSuccessCelebration();
      success('Registration Complete', `Welcome to CampusCare, ${res.user?.fullName}!`);
      onClose();
      onSuccess();
    } else {
      error('Registration Failed', res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Student Portal Login' : 'Student Registration'}
      subtitle={
        mode === 'login'
          ? 'Access your student dashboard, lodge grievances and track resolutions.'
          : 'Create a student profile to register college facility complaints.'
      }
      maxWidth={mode === 'login' ? 'md' : 'xl'}
    >
      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          id="tab-btn-student-login"
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'login' ? 'bg-[#173B67] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
        <button
          id="tab-btn-student-register"
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'register' ? 'bg-[#173B67] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          New Student Register
        </button>
      </div>

      {mode === 'login' ? (
        <div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-student-login-id"
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@college.edu"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-student-login-pass"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              id="btn-submit-student-login"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#173B67] hover:bg-[#132f53] text-white font-bold text-sm rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#173B67] focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-reg-fullname"
                type="text"
                required
                placeholder="e.g. Siddharth Mukherjee"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student ID / Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-reg-rollno"
                type="text"
                required
                placeholder="e.g. 2025CSB099"
                value={regStudentId}
                onChange={(e) => setRegStudentId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-reg-email"
                type="email"
                required
                placeholder="name.roll@college.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number (Optional)</label>
              <input
                id="input-reg-phone"
                type="tel"
                placeholder="+91 98765 00000"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Branch <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-reg-department"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Year & Semester <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-reg-year"
                value={regYearSemester}
                onChange={(e) => setRegYearSemester(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              >
                {YEARS_SEMESTERS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-reg-password"
                type="password"
                required
                placeholder="Min 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-reg-confirmpass"
                type="password"
                required
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>
          </div>

          <button
            id="btn-submit-student-register"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#173B67] hover:bg-[#132f53] text-white font-bold text-sm rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#173B67] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Student Registration'}
          </button>
          
          <div className="text-center mt-4">
            <span className="text-sm text-slate-500">Already registered? </span>
            <button 
              type="button"
              onClick={() => setMode('login')}
              className="text-sm font-bold text-[#173B67] hover:text-[#132f53] focus:outline-none cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
