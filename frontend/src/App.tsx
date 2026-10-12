import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SubmitComplaint } from './components/student/SubmitComplaint';
import { MyComplaints } from './components/student/MyComplaints';
import { ComplaintDetailsView } from './components/student/ComplaintDetailsView';
import { StudentProfile } from './components/student/StudentProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminComplaintManagement } from './components/admin/AdminComplaintManagement';
import { AdminComplaintDetailModal } from './components/admin/AdminComplaintDetailModal';
import { StudentAuthModal } from './components/auth/StudentAuthModal';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { getComplaintById, getComplaints, fetchComplaintsFromServer } from './services/storageService';
import { Complaint } from './types';

function MainApp() {
  const { user, isAuthenticated, isStudent, isAdmin } = useAuth();
  const { info } = useToast();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Auth Modals
  const [studentAuthOpen, setStudentAuthOpen] = useState(false);
  const [studentAuthMode, setStudentAuthMode] = useState<'login' | 'register'>('login');
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);

  // Admin Manage Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalComplaint, setAdminModalComplaint] = useState<Complaint | null>(null);

  // When auth changes, route cleanly to appropriate starting dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isStudent && (currentView === 'landing' || currentView.startsWith('admin-'))) {
        setCurrentView('student-dashboard');
      } else if (isAdmin && (currentView === 'landing' || currentView.startsWith('student-') || currentView === 'submit-complaint' || currentView === 'my-complaints')) {
        setCurrentView('admin-dashboard');
      }
    } else {
      if (currentView !== 'landing') {
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, isStudent, isAdmin]);

  const handleNavigate = (view: string) => {
    // Guards
    if (view.startsWith('student-') || view === 'submit-complaint' || view === 'my-complaints') {
      if (!isAuthenticated || !isStudent) {
        setStudentAuthMode('login');
        setStudentAuthOpen(true);
        return;
      }
    }
    if (view.startsWith('admin-')) {
      if (!isAuthenticated || !isAdmin) {
        setAdminAuthOpen(true);
        return;
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (type: 'student-login' | 'student-register' | 'admin-login') => {
    if (type === 'student-login') {
      setStudentAuthMode('login');
      setStudentAuthOpen(true);
    } else if (type === 'student-register') {
      setStudentAuthMode('register');
      setStudentAuthOpen(true);
    } else if (type === 'admin-login') {
      setAdminAuthOpen(true);
    }
  };

  const handleSelectComplaint = (complaintId: string) => {
    let item = getComplaintById(complaintId);
    if (!item) {
      const all = getComplaints();
      const search = (complaintId || '').toLowerCase().trim();
      item = all.find(
        (c: any) =>
          (c.id && c.id.toLowerCase() === search) ||
          (c.complaintId && c.complaintId.toLowerCase() === search) ||
          (c._id && c._id.toString().toLowerCase() === search)
      );
    }
    if (!item) return;

    if (isAdmin) {
      setAdminModalComplaint(item);
      setAdminModalOpen(true);
    } else {
      setSelectedComplaintId(complaintId);
      setCurrentView('complaint-details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get active complaint object for student details view
  const activeComplaint = selectedComplaintId ? getComplaintById(selectedComplaintId) : null;

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col selection:bg-[#173B67] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} />
        )}

        {/* Student Views */}
        {currentView === 'student-dashboard' && isStudent && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentView === 'submit-complaint' && isStudent && (
          <SubmitComplaint
            onNavigate={handleNavigate}
            onComplaintSubmitted={(id) => {
              setSelectedComplaintId(id);
            }}
          />
        )}

        {currentView === 'my-complaints' && isStudent && (
          <MyComplaints
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentView === 'complaint-details' && isStudent && activeComplaint && (
          <ComplaintDetailsView
            complaint={activeComplaint}
            onBack={() => handleNavigate('my-complaints')}
          />
        )}

        {currentView === 'student-profile' && isStudent && (
          <StudentProfile onNavigate={handleNavigate} />
        )}

        {/* Admin Views */}
        {currentView === 'admin-dashboard' && isAdmin && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onSelectComplaint={handleSelectComplaint}
          />
        )}

        {currentView === 'admin-complaints' && isAdmin && (
          <AdminComplaintManagement onSelectComplaint={handleSelectComplaint} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} />

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={studentAuthOpen}
        onClose={() => setStudentAuthOpen(false)}
        initialMode={studentAuthMode}
        onSuccess={() => {
          handleNavigate('student-dashboard');
        }}
      />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={adminAuthOpen}
        onClose={() => setAdminAuthOpen(false)}
        onSuccess={() => {
          handleNavigate('admin-dashboard');
        }}
      />

      {/* Admin Manage Complaint Modal */}
      {adminModalComplaint && (
        <AdminComplaintDetailModal
          isOpen={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            setAdminModalComplaint(null);
          }}
          complaint={adminModalComplaint}
          onUpdated={() => {
            fetchComplaintsFromServer();
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
