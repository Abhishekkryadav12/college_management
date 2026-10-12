import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ComplaintStatus } from '../../types';
import { getComplaints, fetchComplaintsFromServer } from '../../services/storageService';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { EmptyState } from '../common/EmptyState';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (complaintId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onSelectComplaint }) => {
  const { studentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (!studentUser) return [];
    return getComplaints().filter((c) => c.studentId.toUpperCase() === studentUser.studentId.toUpperCase());
  });
  const [loading, setLoading] = useState(false);

  const loadStudentComplaints = async () => {
    if (!studentUser) return;
    try {
      setLoading(true);
      const serverComplaints = await fetchComplaintsFromServer(studentUser.studentId);
      const studentOnly = serverComplaints.filter(
        (c) => (c.studentId || '').toUpperCase() === (studentUser.studentId || '').toUpperCase()
      );
      setComplaints(studentOnly);
    } catch (err) {
      console.error('Failed to load student complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentComplaints();
    const handleUpdate = () => {
      if (!studentUser) return;
      const all = getComplaints();
      const studentOnly = all.filter(
        (c) => (c.studentId || '').toUpperCase() === (studentUser.studentId || '').toUpperCase()
      );
      setComplaints(studentOnly);
    };
    window.addEventListener('college_complaints_updated', handleUpdate);
    return () => window.removeEventListener('college_complaints_updated', handleUpdate);
  }, [studentUser]);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = complaints.slice(0, 5);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="bg-[#173B67] rounded-xl p-6 sm:p-7 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Student Grievance Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Welcome back, {studentUser?.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-normal">
              {studentUser?.department} • {studentUser?.yearSemester} (Roll No: {studentUser?.studentId})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-btn-submit-complaint"
              onClick={() => onNavigate('submit-complaint')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-[#173B67] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#173B67]" />
              Lodge New Complaint
            </button>
            <button
              id="dash-btn-view-all"
              onClick={() => onNavigate('my-complaints')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              My Tickets ({total})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (Total, Pending, In Progress, Resolved) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-student-total"
          title="Total Complaints"
          value={total}
          subtitle="All logged tickets"
          icon={<FileText className="w-6 h-6" />}
          color="slate"
          onClick={() => onNavigate('my-complaints')}
        />
        <StatCard
          id="stat-student-pending"
          title="Pending"
          value={pending}
          subtitle="Awaiting admin review"
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          onClick={() => onNavigate('my-complaints')}
        />
        <StatCard
          id="stat-student-in-progress"
          title="In Progress"
          value={inProgress}
          subtitle="Work order dispatched"
          icon={<AlertCircle className="w-6 h-6" />}
          color="blue"
          onClick={() => onNavigate('my-complaints')}
        />
        <StatCard
          id="stat-student-resolved"
          title="Resolved"
          value={resolved}
          subtitle="Successfully closed"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
          onClick={() => onNavigate('my-complaints')}
        />
      </div>

      {/* Main Grid: Recent Complaints + Quick Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Complaints</h2>
              <p className="text-xs text-slate-500">Latest tickets submitted by your profile</p>
            </div>
            {total > 0 && (
              <button
                id="btn-view-all-complaints-link"
                onClick={() => onNavigate('my-complaints')}
                className="text-xs font-semibold text-[#173B67] hover:text-[#132f53] flex items-center gap-1 cursor-pointer"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="p-6">
            {recentComplaints.length === 0 ? (
              <EmptyState
                type="no-complaints"
                title="No grievances lodged yet"
                description="If you notice any electrical, plumbing, mess or academic issues, submit a ticket for prompt resolution."
                actionText="Submit Your First Complaint"
                onAction={() => onNavigate('submit-complaint')}
              />
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((item) => (
                  <div
                    key={item.id}
                    id={`recent-complaint-card-${item.id}`}
                    onClick={() => onSelectComplaint(item.id)}
                    className="p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
                        <CategoryBadge category={item.category} size="sm" />
                        <PriorityBadge priority={item.priority} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B67] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <StatusBadge status={item.status} size="md" />
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#173B67] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Info Column: Quick Guidance & SLA */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#173B67]" />
              Standard Resolution SLAs
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FEE2E2] border border-[#FECACA]">
                <span className="font-bold text-[#B91C1C]">Urgent Priority</span>
                <span className="font-semibold text-[#B91C1C]">Same Day (4-8 hrs)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50 border border-orange-100">
                <span className="font-bold text-orange-900">High Priority</span>
                <span className="font-semibold text-orange-700">24-48 hours</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#DBEAFE] border border-[#BFDBFE]">
                <span className="font-bold text-[#1D4ED8]">Medium Priority</span>
                <span className="font-semibold text-[#1D4ED8]">3 working days</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F4F7FB] border border-slate-200">
                <span className="font-bold text-slate-800">Low Priority</span>
                <span className="font-semibold text-slate-600">5-7 working days</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F7FB] p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-[#173B67] mb-2">Need Emergency Support?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              For immediate medical, fire, or severe security issues, please contact the campus main gate control room directly.
            </p>
            <div className="text-xs font-mono font-bold text-[#173B67] bg-white p-2.5 rounded-lg border border-slate-200">
              Campus Helpline: +91 11-2800-4321
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
