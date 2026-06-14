/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, ShieldCheck, Clock, Menu, X, Building2 } from 'lucide-react';
import { Student } from '../types';

interface HeaderProps {
  student: Student;
  unreadNotifications: number;
  onViewChange: (view: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeViewTitle: string;
}

export default function Header({ 
  student, 
  unreadNotifications, 
  onViewChange,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeViewTitle
}: HeaderProps) {
  
  const formattedDate = new Date("2026-06-12T19:55:25-07:00").toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header id="main-portal-header" className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 md:px-6 flex items-center justify-between no-print">
      
      {/* Mobile Menu Toggle & App Name Brand */}
      <div className="flex items-center gap-3 md:gap-0">
        <button 
          id="btn-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-col md:hidden">
          <span className="font-semibold text-xs tracking-wider text-slate-900">PARAKH SYSTEM</span>
          <span className="text-[9px] text-slate-500 font-mono">NATIONAL REGISTRY</span>
        </div>

        {/* Desktop Title Header context */}
        <div className="hidden md:flex flex-col">
          <h1 className="text-sm font-semibold text-slate-900 font-mono uppercase tracking-wider">
            {activeViewTitle}
          </h1>
          <p className="text-[11px] text-slate-500 font-mono">
            Candidate ID: <span className="font-medium text-slate-700">{student.candidateId}</span> | Roll: {student.rollNumber}
          </p>
        </div>
      </div>

      {/* Right side Metadata indicators */}
      <div className="flex items-center gap-4">
        {/* Date Time Counter - Static but authentic for 2026 */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-xs text-slate-600 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Verification Check Badge */}
        <div className="flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-200 px-2.5 py-1 rounded text-xs font-medium font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-green-700 shrink-0" />
          <span className="hidden sm:inline">AUTHENTIC RECORDS</span>
          <span className="sm:hidden text-[10px]">VERIFIED</span>
        </div>

        {/* Quick Read/Notification Button */}
        <button 
          id="btn-header-notifications"
          onClick={() => onViewChange('notifications')}
          className="relative p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 rounded transition-colors cursor-pointer"
          aria-label="Notifications Panel"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white font-mono">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Compact User Identity Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs font-mono">
            AS
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900">{student.name}</span>
            <span className="text-[10px] text-slate-500 font-mono tracking-tight">Class XII Division</span>
          </div>
        </div>
      </div>
    </header>
  );
}
