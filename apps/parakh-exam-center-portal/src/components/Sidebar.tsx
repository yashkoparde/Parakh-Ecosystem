/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Key, 
  Printer, 
  FileText, 
  UserCheck, 
  CheckSquare, 
  Radio, 
  Shield, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Database, 
  FileSpreadsheet, 
  Sliders, 
  Lock
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  pendingVerificationsCount: number;
  criticalDeviceCount: number;
  pendingIncidentsCount: number;
  drishtiVpnStatus: string;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  pendingVerificationsCount,
  criticalDeviceCount,
  pendingIncidentsCount,
  drishtiVpnStatus
}: SidebarProps) {

  const isTabActive = (tab: string) => currentTab === tab;

  const btnClass = (tab: string) => `
    w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150
    ${isTabActive(tab) 
      ? "bg-slate-800 text-white border-l-2 border-slate-300 pl-2.5" 
      : "text-slate-400 hover:text-white hover:bg-slate-800/50"}
  `;

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-200 flex flex-col border-r border-[#1E293B] shrink-0 h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B] bg-[#1E293B]/30 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="bg-slate-700 p-1 rounded-sm border border-slate-600">
            <Lock className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 font-mono">PARAKH PORTAL</h1>
            <p className="text-[10px] text-slate-500 tracking-tight">EXAM OPERATIONS SYSTEM</p>
          </div>
        </div>
        <div className="mt-2 py-1 px-2 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-mono font-medium">TERMINAL STATUS</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] text-slate-300 font-mono font-medium">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Main Dashboard */}
        <div>
          <button 
            id="nav-btn-dashboard"
            onClick={() => setCurrentTab("dashboard")} 
            className={btnClass("dashboard")}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Center Dashboard</span>
            </div>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 border border-slate-800 font-mono">LIVE</span>
          </button>
        </div>

        {/* Suite Category: PAPER MANAGEMENT */}
        <div className="space-y-1">
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">PAPER RELEASE & CONTROL</span>
            <span className="text-[8px] border border-slate-800 bg-[#1E293B] px-1 text-slate-400 font-mono rounded">NTA</span>
          </div>
          
          <button 
            id="nav-btn-release-schedule"
            onClick={() => setCurrentTab("release-schedule")} 
            className={btnClass("release-schedule")}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Release Schedule</span>
            </div>
          </button>

          <button 
            id="nav-btn-paper-release"
            onClick={() => setCurrentTab("paper-release")} 
            className={btnClass("paper-release")}
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              <span>Paper Release Console</span>
            </div>
          </button>

          <button 
            id="nav-btn-print-control"
            onClick={() => setCurrentTab("print-control")} 
            className={btnClass("print-control")}
          >
            <div className="flex items-center gap-2">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Control</span>
            </div>
          </button>

          <button 
            id="nav-btn-distribution-logs"
            onClick={() => setCurrentTab("distribution-logs")} 
            className={btnClass("distribution-logs")}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Distribution Logs</span>
            </div>
          </button>
        </div>

        {/* Suite Category: AUDITING */}
        <div className="space-y-1">
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">INTEGRITY & VERIFICATION</span>
            <span className="text-[8px] border border-slate-800 bg-[#1E293B] px-1 text-slate-400 font-mono rounded">AUDIT</span>
          </div>

          <button 
            id="nav-btn-candidate-verification"
            onClick={() => setCurrentTab("candidate-verification")} 
            className={btnClass("candidate-verification")}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Verification</span>
            </div>
            {pendingVerificationsCount > 0 && (
              <span className="text-[10px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-800">
                {pendingVerificationsCount}
              </span>
            )}
          </button>

          <button 
            id="nav-btn-attendance"
            onClick={() => setCurrentTab("attendance")} 
            className={btnClass("attendance")}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Attendance Ledger</span>
            </div>
          </button>

          <button 
            id="nav-btn-device-detection"
            onClick={() => setCurrentTab("device-detection")} 
            className={btnClass("device-detection")}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5" />
              <span>Device Detection</span>
            </div>
            {criticalDeviceCount > 0 && (
              <span className="text-[10px] bg-red-950 text-red-300 font-mono px-1.5 py-0.2 rounded border border-red-850">
                {criticalDeviceCount}
              </span>
            )}
          </button>

          <button 
            id="nav-btn-integrity-monitoring"
            onClick={() => setCurrentTab("integrity-monitoring")} 
            className={btnClass("integrity-monitoring")}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Integrity Monitoring</span>
            </div>
          </button>

          <button 
            id="nav-btn-incident-reporting"
            onClick={() => setCurrentTab("incident-reporting")} 
            className={btnClass("incident-reporting")}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Incident Reporting</span>
            </div>
            {pendingIncidentsCount > 0 && (
              <span className="text-[10px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-850">
                {pendingIncidentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Infrastructure Navigation */}
        <div className="space-y-1">
          <div className="px-3 py-1">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">EXAMINATION SYSTEM</span>
          </div>

          <button 
            id="nav-btn-sessions"
            onClick={() => setCurrentTab("sessions")} 
            className={btnClass("sessions")}
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              <span>Examination Sessions</span>
            </div>
          </button>

          <button 
            id="nav-btn-staff"
            onClick={() => setCurrentTab("staff")} 
            className={btnClass("staff")}
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Center Staff</span>
            </div>
          </button>

          <button 
            id="nav-btn-reports"
            onClick={() => setCurrentTab("reports")} 
            className={btnClass("reports")}
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Operations Reports</span>
            </div>
          </button>

          <button 
            id="nav-btn-activity-logs"
            onClick={() => setCurrentTab("activity-logs")} 
            className={btnClass("activity-logs")}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Activity Logs</span>
            </div>
          </button>

          <button 
            id="nav-btn-settings"
            onClick={() => setCurrentTab("settings")} 
            className={btnClass("settings")}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Terminal Settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Terminal Footer Indicator */}
      <div className="p-4 border-t border-[#1E293B] text-[10px] font-mono text-slate-500">
        <div className="text-slate-400 font-semibold uppercase tracking-wider">PARAKH exam system</div>
        <div className="text-[9px] text-slate-600 mt-1">Operational Station Portal</div>
      </div>
    </aside>
  );
}
