import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ADMIN_CREDENTIALS } from '../../services/storageService';
import { ShieldCheck, Lock, Mail, User, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, registerAdmin } = useAuth(); // Assume registerAdmin is added to AuthContext
  const { success, error } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      error('Missing credentials', 'Please enter admin username/email and password.');
      return;
    }

    setLoading(true);
    const res = await loginAdmin(loginIdentifier, loginPassword);
    setLoading(false);
    
    if (res.success) {
      success('Admin Access Granted', `Welcome ${res.user?.fullName || 'Administrator'}`);
      onClose();
      onSuccess();
    } else {
      error('Authentication Failed', res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regFullName || !regUsername || !regEmail || !regPassword) {
      error('Validation Error', 'Please fill in all mandatory fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await registerAdmin({
      fullName: regFullName,
      adminUsername: regUsername,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });
    setLoading(false);
    
    if (res.success) {
      success('Registration Complete', 'Admin account created successfully.');
      onClose();
      onSuccess();
    } else {
      error('Registration Failed', res.message);
    }
  };

  const handleAutofill = () => {
    setLoginIdentifier(ADMIN_CREDENTIALS.email);
    setLoginPassword(ADMIN_CREDENTIALS.password);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Admin & Dean Access Portal' : 'Administrator Registration'}
      subtitle="Restricted to Campus Grievance Redressal Officers and Department Superintendents."
      maxWidth={mode === 'login' ? 'md' : 'lg'}
    >
      <div className="space-y-4">
        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer \${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer \${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Security badge ribbon */}
        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl flex items-center gap-3 border border-slate-800">
          <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold">Authorized Personnel Only</p>
            <p className="text-[11px] text-slate-400">Review status, assign technicians & mark resolutions</p>
          </div>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Username / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin@college.com or admin_username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Administrative Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating Admin...' : 'Sign In as Administrator'}
            </button>
            
            {/* 1-Click Fill helper */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <div>
                <p className="text-xs font-bold text-blue-900">Demo Admin Credentials</p>
                <p className="text-[11px] text-blue-700 font-mono">admin@college.com / admin123</p>
              </div>
              <button
                type="button"
                onClick={handleAutofill}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-white hover:bg-blue-600 bg-white border border-blue-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Auto-fill
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Vance"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. avance_admin"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@college.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 cursor-pointer mt-4"
            >
              {loading ? 'Registering...' : 'Admin Registration Button'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
