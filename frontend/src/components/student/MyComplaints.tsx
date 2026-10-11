import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from '../../types';
import { getComplaints, fetchComplaintsFromServer, CATEGORIES, PRIORITIES } from '../../services/storageService';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Search,
  Filter,
  Eye,
  PlusCircle,
  Calendar,
  MapPin,
  FileText,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface MyComplaintsProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (complaintId: string) => void;
}

export const MyComplaints: React.FC<MyComplaintsProps> = ({ onNavigate, onSelectComplaint }) => {
  const { studentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (!studentUser) return [];
    return getComplaints().filter((c) => c.studentId.toUpperCase() === studentUser.studentId.toUpperCase());
  });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const loadData = async () => {
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
    loadData();
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

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.id || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);

      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchPriority = selectedPriority === 'all' || item.priority === selectedPriority;

      return matchSearch && matchCategory && matchStatus && matchPriority;
    });
  }, [complaints, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all';

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status updates, administrative remarks, and resolution records for your grievances.
          </p>
        </div>

        <button
          id="btn-lodge-new-complaint-top"
          onClick={() => onNavigate('submit-complaint')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Lodge New Complaint
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="input-search-my-complaints"
              type="text"
              placeholder="Search by ticket ID, title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Priority Filter */}
            <select
              id="filter-priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label} Priority
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredComplaints.length}</strong> of{' '}
            <strong className="text-slate-800">{complaints.length}</strong> grievances
          </span>
        </div>
      </div>

      {/* Complaints Table & Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {complaints.length === 0 ? (
          <EmptyState
            type="no-complaints"
            title="You haven't submitted any complaints yet"
            description="Whenever an issue arises on campus, submit a ticket here to receive swift assistance."
            actionText="Lodge a Complaint"
            onAction={() => onNavigate('submit-complaint')}
          />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            type="no-results"
            title="No complaints match current filters"
            description="Try changing the category, status, or search keywords."
            actionText="Clear Filters"
            onAction={resetFilters}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Title & Subject</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((item) => (
                    <tr
                      key={item.id}
                      id={`table-row-complaint-${item.id}`}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectComplaint(item.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-700 transition-colors max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <CategoryBadge category={item.category} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {item.location}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          id={`btn-view-details-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectComplaint(item.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  id={`mobile-card-complaint-${item.id}`}
                  onClick={() => onSelectComplaint(item.id)}
                  className="p-4 space-y-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{item.id}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge category={item.category} size="sm" />
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
