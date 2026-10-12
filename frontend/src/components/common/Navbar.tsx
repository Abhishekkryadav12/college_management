import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { resetToDemoData } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (type: 'student-login' | 'student-register' | 'admin-login') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const { success } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onNavigate('landing');
    success('Logged out successfully', 'You have been safely signed out.');
  };

  const handleResetData = () => {
    resetToDemoData();
    success('Demo Data Reset', 'Initial sample complaints and students restored.');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo & Name */}
            <div
              id="brand-logo-btn"
              onClick={() => onNavigate(isAuthenticated ? (isStudent ? 'student-dashboard' : 'admin-dashboard') : 'landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#173B67] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 tracking-tight font-heading">
                    Campus<span className="text-[#173B67]">Care</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#F4F7FB] text-[#173B67] border border-slate-200">
                    Grievance Portal
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden md:block">
                  College Complaint Management System
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links / Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    id="nav-btn-landing-features"
                    onClick={() => {
                      onNavigate('landing');
                      const el = document.getElementById('features-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    id="nav-btn-landing-categories"
                    onClick={() => {
                      onNavigate('landing');
                      const el = document.getElementById('categories-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Complaint Categories
                  </button>
                  <button
                    id="nav-btn-landing-workflow"
                    onClick={() => {
                      onNavigate('landing');
                      const el = document.getElementById('workflow-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>

                  <div className="h-5 w-px bg-slate-200 mx-1" />

                  <button
                    id="nav-btn-student-login"
                    onClick={() => onOpenAuth('student-login')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#173B67] bg-[#F4F7FB] hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-all cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    Student Login
                  </button>

                  <button
                    id="nav-btn-admin-login"
                    onClick={() => onOpenAuth('admin-login')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#173B67] hover:bg-[#132f53] rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Login
                  </button>
                </>
              ) : (
                <>
                  {/* Student Navigation Controls */}
                  {isStudent && (
                    <div className="flex items-center gap-1.5 mr-2">
                      <button
                        id="nav-student-dashboard"
                        onClick={() => onNavigate('student-dashboard')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          currentView === 'student-dashboard'
                            ? 'bg-[#173B67] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </button>
                      <button
                        id="nav-student-submit"
                        onClick={() => onNavigate('submit-complaint')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          currentView === 'submit-complaint'
                            ? 'bg-[#132f53] text-white shadow-xs'
                            : 'bg-[#173B67] hover:bg-[#132f53] text-white shadow-xs'
                        }`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Submit Complaint
                      </button>
                      <button
                        id="nav-student-my-complaints"
                        onClick={() => onNavigate('my-complaints')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          currentView === 'my-complaints'
                            ? 'bg-[#173B67] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                        My Complaints
                      </button>
                    </div>
                  )}

                  {/* Admin Navigation Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 mr-2">
                      <button
                        id="nav-admin-dashboard"
                        onClick={() => onNavigate('admin-dashboard')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          currentView === 'admin-dashboard'
                            ? 'bg-[#173B67] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Overview
                      </button>
                      <button
                        id="nav-admin-complaints"
                        onClick={() => onNavigate('admin-complaints')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                          currentView === 'admin-complaints'
                            ? 'bg-[#173B67] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Grievances Desk
                      </button>
                    </div>
                  )}

                  <div className="h-5 w-px bg-slate-200 mx-1" />

                  {/* User Profile Pill */}
                  <div
                    id="nav-user-profile-pill"
                    onClick={() => onNavigate(isStudent ? 'student-profile' : 'admin-dashboard')}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F4F7FB] hover:bg-slate-200/80 cursor-pointer transition-colors border border-slate-200/70"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#173B67] text-white font-bold text-xs flex items-center justify-center">
                      {user?.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 leading-tight max-w-[140px] truncate">
                        {user?.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {isStudent ? (user as any).studentId : 'Administrator'}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    id="nav-btn-logout"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
            {!isAuthenticated ? (
              <>
                <button
                  id="mobile-btn-student-login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('student-login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl"
                >
                  <User className="w-4 h-4" />
                  Student Portal Login
                </button>
                <button
                  id="mobile-btn-student-register"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('student-register');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4" />
                  Student Registration
                </button>
                <button
                  id="mobile-btn-admin-login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('admin-login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Admin Portal Login
                </button>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                </div>

                {isStudent && (
                  <>
                    <button
                      id="mobile-nav-student-dashboard"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('student-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Dashboard
                    </button>
                    <button
                      id="mobile-nav-student-submit"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('submit-complaint');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      Submit New Complaint
                    </button>
                    <button
                      id="mobile-nav-student-complaints"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('my-complaints');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <ListOrdered className="w-4 h-4 text-blue-600" />
                      My Complaints
                    </button>
                    <button
                      id="mobile-nav-student-profile"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('student-profile');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      My Profile
                    </button>
                  </>
                )}

                {isAdmin && (
                  <>
                    <button
                      id="mobile-nav-admin-dashboard"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('admin-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                      Admin Dashboard
                    </button>
                    <button
                      id="mobile-nav-admin-complaints"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('admin-complaints');
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Complaint Management
                    </button>
                  </>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    id="mobile-nav-logout"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Confirmation Dialog for Logout */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out of CampusCare"
        message="Are you sure you want to end your session? Any unsaved form entries will be discarded."
        confirmText="Sign Out"
        cancelText="Stay Logged In"
        type="warning"
      />
    </>
  );
};
