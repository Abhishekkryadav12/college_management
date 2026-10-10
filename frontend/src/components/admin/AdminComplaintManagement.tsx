import React, { useState, useEffect, useMemo } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from '../../types';
import { getComplaints, CATEGORIES, PRIORITIES, DEPARTMENTS } from '../../services/storageService';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  RotateCcw,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminComplaintManagementProps {
  onSelectComplaint: (complaintId: string) => void;
}

export const AdminComplaintManagement: React.FC<AdminComplaintManagementProps> = ({
  onSelectComplaint,
}) => {
  const { success } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'priority-desc' | 'status'>('date-desc');

  const loadData = () => {
    setComplaints(getComplaints());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('college_complaints_updated', handleUpdate);
    return () => window.removeEventListener('college_complaints_updated', handleUpdate);
  }, []);

  const priorityOrder: Record<Priority, number> = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const statusOrder: Record<ComplaintStatus, number> = {
    Pending: 1,
    'In Progress': 2,
    Resolved: 3,
  };

  const filteredAndSortedComplaints = useMemo(() => {
    return complaints
      .filter((item) => {
        const query = searchTerm.toLowerCase();
        const matchSearch =
          item.title.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.studentName.toLowerCase().includes(query) ||
          item.studentId.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);

        const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
        const matchStat = selectedStatus === 'all' || item.status === selectedStatus;
        const matchPrio = selectedPriority === 'all' || item.priority === selectedPriority;
        const matchDept = selectedDepartment === 'all' || item.department === selectedDepartment;

        return matchSearch && matchCat && matchStat && matchPrio && matchDept;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'priority-desc') {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (sortBy === 'status') {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return 0;
      });
  }, [
    complaints,
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    selectedDepartment,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedDepartment('all');
    setSortBy('date-desc');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all' ||
    selectedDepartment !== 'all';

  const exportToCSV = () => {
    const headers = [
      'Complaint ID',
      'Student Name',
      'Roll Number',
      'Department',
      'Category',
      'Title',
      'Location',
      'Priority',
      'Status',
      'Submitted Date',
      'Admin Remarks',
      'Resolution Note',
    ];

    const rows = filteredAndSortedComplaints.map((c) => [
      `"${c.id}"`,
      `"${c.studentName}"`,
      `"${c.studentId}"`,
      `"${c.department}"`,
      `"${c.category}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
      `"${(c.adminRemarks || '').replace(/"/g, '""')}"`,
      `"${(c.resolutionNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Campus_Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Report Exported', 'CSV report downloaded with current filtered grievances.');
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Grievance Redressal Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, triage, assign technicians, and close campus maintenance tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-admin-export-csv"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV ({filteredAndSortedComplaints.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="admin-search-input"
              type="text"
              placeholder="Search by ticket ID, student name, roll number, title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="admin-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="priority-desc">Highest Priority First</option>
                <option value="status">Status (Pending First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <select
            id="admin-filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            id="admin-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            id="admin-filter-priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            id="admin-filter-department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-xs truncate"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              id="btn-admin-reset-filters"
              onClick={resetFilters}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredAndSortedComplaints.length}</strong> of{' '}
            <strong className="text-slate-800">{complaints.length}</strong> tickets
          </div>
        </div>
      </div>

      {/* Main Complaint Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {complaints.length === 0 ? (
          <EmptyState
            type="no-complaints"
            title="No complaints registered in system"
            description="When students lodge facility or academic grievances, they will populate here."
          />
        ) : filteredAndSortedComplaints.length === 0 ? (
          <EmptyState
            type="no-results"
            title="No matching grievances"
            description="Try changing the department, status, or search query."
            actionText="Clear All Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Complaint Title</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedComplaints.map((item) => (
                  <tr
                    key={item.id}
                    id={`admin-table-row-${item.id}`}
                    onClick={() => onSelectComplaint(item.id)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.studentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {item.studentId}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={item.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate group-hover:text-indigo-700 transition-colors">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        id={`btn-admin-manage-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(item.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage & Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
