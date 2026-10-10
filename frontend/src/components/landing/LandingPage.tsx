import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Zap,
  Droplets,
  Utensils,
  School,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CATEGORIES } from '../../services/storageService';

interface LandingPageProps {
  onOpenAuth: (type: 'student-login' | 'student-register' | 'admin-login') => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid/glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Digital Campus Redressal & Facility Management</span>
          </div>

          {/* Main Title & Slogan */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            College Complaint <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-sky-300">
              Management System
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Report your college issues quickly and track their resolution in real time.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              id="hero-btn-student-login"
              onClick={() => onOpenAuth('student-login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              Student Portal Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-student-register"
              onClick={() => onOpenAuth('student-register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-400" />
              New Student Registration
            </button>

            <button
              id="hero-btn-admin-login"
              onClick={() => onOpenAuth('admin-login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Admin / Dean Login
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-2xl font-bold text-white">24-48 hrs</p>
              <p className="text-xs text-slate-400 mt-0.5">Average Turnaround</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-2xl font-bold text-emerald-400">94.8%</p>
              <p className="text-xs text-slate-400 mt-0.5">Resolution Rate</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-2xl font-bold text-sky-400">7 Departments</p>
              <p className="text-xs text-slate-400 mt-0.5">Centralized Redressal</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl">
              <p className="text-2xl font-bold text-amber-400">100% Transparent</p>
              <p className="text-xs text-slate-400 mt-0.5">Step-by-Step Audit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Why CampusCare
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-heading">
            Streamlined Resolution for Campus Life
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No more lost paper petitions or unresolved maintenance requests. Everything is logged, assigned, and verified digitally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Instant Ticket Generation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your concern in under 60 seconds with location tagging, priority indicators, and photo evidence uploads.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Live Status Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Follow every stage of your grievance from Submitted to Pending, In Progress, and final Resolution with official remarks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Accountability & Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Department supervisors and grievance committees provide documented resolution notes before closing tickets.
            </p>
          </div>
        </div>
      </section>

      {/* Complaint Categories Section */}
      <section id="categories-section" className="py-14 bg-slate-100/70 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
              Grievance Categories Handled
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select from specialized facility and academic categories for prompt routing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const icons: Record<string, React.ReactNode> = {
                Hostel: <Building2 className="w-5 h-5 text-indigo-600" />,
                Electricity: <Zap className="w-5 h-5 text-amber-600" />,
                Water: <Droplets className="w-5 h-5 text-cyan-600" />,
                Mess: <Utensils className="w-5 h-5 text-emerald-600" />,
                Classroom: <School className="w-5 h-5 text-blue-600" />,
                'Faculty-related Issues': <GraduationCap className="w-5 h-5 text-purple-600" />,
                Other: <HelpCircle className="w-5 h-5 text-slate-600" />,
              };

              return (
                <div
                  key={cat.label}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {icons[cat.label]}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cat.label}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Flowchart */}
      <section id="workflow-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            System Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
            How The Redressal Cycle Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transparent 4-stage progression from submission to completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Student Submission</h4>
            <p className="text-xs text-slate-600 mt-1">
              Student fills out ticket details, selects category, priority level, and attaches optional photos.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">Pending Review</h4>
            <p className="text-xs text-slate-600 mt-1">
              Grievance Cell and Dean review the ticket, verify legitimacy, and assign the appropriate department.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">In Progress Action</h4>
            <p className="text-xs text-slate-600 mt-1">
              Technicians, wardens, or faculty committee address the maintenance or academic grievance.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 relative">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">Resolved & Closed</h4>
            <p className="text-xs text-slate-600 mt-1">
              Admin writes final resolution remarks and closes the ticket. Student receives instantaneous update.
            </p>
          </div>
        </div>

        {/* Quick Launch CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">Ready to submit or manage campus complaints?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Access the portal using your registered Student ID or administrative credentials.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="cta-student-portal"
              onClick={() => onOpenAuth('student-login')}
              className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Open Student Portal
            </button>
            <button
              id="cta-admin-portal"
              onClick={() => onOpenAuth('admin-login')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition-all cursor-pointer"
            >
              Dean / Admin Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
