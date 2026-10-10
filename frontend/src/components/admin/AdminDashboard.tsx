import React, { useState, useEffect, useMemo } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from '../../types';
import { getComplaints, CATEGORIES } from '../../services/storageService';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Flame,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Download,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (complaintId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Hostel: '#6366f1',
  Electricity: '#f59e0b',
  Water: '#06b6d4',
  Mess: '#10b981',
  Classroom: '#3b82f6',
  'Faculty-related Issues': '#a855f7',
  Other: '#64748b',
};

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onSelectComplaint }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const loadData = () => {
    setComplaints(getComplaints());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('college_complaints_updated', handleUpdate);
    return () => window.removeEventListener('college_complaints_updated', handleUpdate);
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const urgent = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved').length;

  // Category chart data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => (counts[c.label] = 0));
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);
  }, [complaints]);

  // Status chart data
  const statusData = useMemo(() => {
    return [
      { name: 'Pending', count: pending, fill: STATUS_COLORS.Pending },
      { name: 'In Progress', count: inProgress, fill: STATUS_COLORS['In Progress'] },
      { name: 'Resolved', count: resolved, fill: STATUS_COLORS.Resolved },
    ];
  }, [pending, inProgress, resolved]);

  // Priority chart data
  const priorityData = useMemo(() => {
    const pCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    complaints.forEach((c) => {
      pCounts[c.priority] = (pCounts[c.priority] || 0) + 1;
    });
    return [
      { name: 'Low', count: pCounts.Low, fill: '#64748b' },
      { name: 'Medium', count: pCounts.Medium, fill: '#0284c7' },
      { name: 'High', count: pCounts.High, fill: '#ea580c' },
      { name: 'Urgent', count: pCounts.Urgent, fill: '#e11d48' },
    ];
  }, [complaints]);

  const urgentComplaints = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved');
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
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-xs border border-blue-400/20">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Grievance Redressal Authority Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Administrative Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Dr. Arthur Vance (Dean / Chief Grievance Officer) • Campus Redressal Cell
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="admin-dash-btn-manage"
              onClick={() => onNavigate('admin-complaints')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Manage All Grievances ({total})
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Attention Alert Banner if any */}
      {urgent > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 flex-wrap shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-sm shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                {urgent} Urgent Campus Issue{urgent > 1 ? 's' : ''} Requiring Immediate Action
              </h4>
              <p className="text-xs text-rose-800">
                Safety hazards, power failures, or potable water emergencies pending resolution.
              </p>
            </div>
          </div>
          <button
            id="btn-view-urgent-filter"
            onClick={() => onNavigate('admin-complaints')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Review Urgent Tickets
          </button>
        </div>
      )}

      {/* Metrics Row (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          id="stat-admin-total"
          title="Total Complaints"
          value={total}
          subtitle="Lifetime logged"
          icon={<FileText className="w-5 h-5" />}
          color="slate"
          onClick={() => onNavigate('admin-complaints')}
        />
        <StatCard
          id="stat-admin-pending"
          title="Pending"
          value={pending}
          subtitle="Needs review"
          icon={<Clock className="w-5 h-5" />}
          color="amber"
          onClick={() => onNavigate('admin-complaints')}
        />
        <StatCard
          id="stat-admin-inprogress"
          title="In Progress"
          value={inProgress}
          subtitle="Work order dispatched"
          icon={<AlertCircle className="w-5 h-5" />}
          color="blue"
          onClick={() => onNavigate('admin-complaints')}
        />
        <StatCard
          id="stat-admin-resolved"
          title="Resolved"
          value={resolved}
          subtitle="Closed successfully"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
          onClick={() => onNavigate('admin-complaints')}
        />
        <StatCard
          id="stat-admin-urgent"
          title="Urgent Alerts"
          value={urgent}
          subtitle="Same-day SLA"
          icon={<Flame className="w-5 h-5" />}
          color="rose"
          onClick={() => onNavigate('admin-complaints')}
        />
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              Category Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">Campus-wide distribution</span>
          </div>

          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No complaint data available
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Status Resolution Pipeline
            </h3>
            <span className="text-xs text-slate-500 font-medium">Ticket Lifecycle</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Grievances Requiring Action */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Complaints Queue</h3>
            <p className="text-xs text-slate-500">Most recently registered campus grievances</p>
          </div>
          <button
            id="btn-admin-view-all-queue"
            onClick={() => onNavigate('admin-complaints')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Open Complaint Management Table
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Complaint</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.map((item) => (
                <tr
                  key={item.id}
                  id={`admin-recent-row-${item.id}`}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onSelectComplaint(item.id)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{item.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.studentId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <CategoryBadge category={item.category} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate">{item.title}</td>
                  <td className="py-3 px-4 text-slate-600">{item.location}</td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={item.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComplaint(item.id);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
