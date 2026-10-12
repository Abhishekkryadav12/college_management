import React from 'react';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, RefreshCw, Heart } from 'lucide-react';
import { resetToDemoData } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onOpenAuth: (type: 'student-login' | 'admin-login') => void;
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onNavigate }) => {
  const { success } = useToast();

  const handleResetData = () => {
    resetToDemoData();
    success('Sample Records Restored', 'The complaint ledger and test student accounts have been refreshed.');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#173B67] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white font-heading">
                Campus<span className="text-[#DBEAFE]">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Grievance Redressal and Facility Maintenance Portal for students, faculty, and campus administrators.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Campus Portal 2026
              </span>
            </div>
          </div>

          {/* Col 2: Student Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Student Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Student Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Register New Account
                </button>
              </li>
              <li>
                <span className="text-slate-500">Hostel & Mess Maintenance</span>
              </li>
              <li>
                <span className="text-slate-500">Classroom & Lab Equipment</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin & Authority */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Administration</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenAuth('admin-login')}
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Dean / Warden Console
                </button>
              </li>
              <li>
                <span className="text-slate-500">Grievance Redressal Cell (GRC)</span>
              </li>
              <li>
                <span className="text-slate-500">Sanitation & Electrical Desk</span>
              </li>
              <li>
                <button
                  onClick={handleResetData}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 mt-2 font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Demo Sample Records
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Campus Helpdesk</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Administrative Block, Main Campus
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                grievance.cell@college.edu
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Emergency Control: +91 11-2800-4321
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} College Complaint Management System. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Frontend Architecture Prototype • B.Tech Engineering Project
          </p>
        </div>
      </div>
    </footer>
  );
};
