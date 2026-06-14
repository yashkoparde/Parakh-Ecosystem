/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Candidate, DeviceEvent, IncidentReport, ActivityLog } from "../types";
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";

interface IntegrityMonitoringViewProps {
  candidates: Candidate[];
  deviceEvents: DeviceEvent[];
  incidentReports: IncidentReport[];
  activityLogs: ActivityLog[];
}

export default function IntegrityMonitoringView({
  candidates,
  deviceEvents,
  incidentReports,
  activityLogs
}: IntegrityMonitoringViewProps) {
  // Integrity parameters
  const rejectedCount = candidates.filter(c => c.verificationStatus === "Rejected").length;
  const duplicateCount = candidates.filter(c => c.verificationStatus === "Duplicate").length;
  const underInvestigationCount = deviceEvents.filter(d => d.status === "Under Investigation").length;
  const totalBreachesOccurred = incidentReports.length;

  // Simple scoring algorithm representing overall center accountability index
  const integrityScorePoints = 100 - (rejectedCount * 5) - (duplicateCount * 12) - (totalBreachesOccurred * 10);
  const centerIntegrityIndex = Math.max(0, Math.min(100, integrityScorePoints));

  return (
    <div className="space-y-6">
      
      {/* Integrity Index Header Banner */}
      <div className="bg-[#0F172A] text-slate-100 p-5 rounded-sm border border-[#1E293B] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E293B] p-2 rounded border border-slate-600">
            <Shield className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">NATIONAL INTEGRITY CONTROL</h2>
            <h3 className="text-sm font-semibold text-slate-200 mt-0.5">PARAKH Secure Examination Audit Metrics</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 text-right font-mono">
          <span className="text-[9px] text-slate-500 block">CUMULATIVE INTEGRITY SCORE</span>
          <span className={`text-xl font-bold tracking-tight ${
            centerIntegrityIndex > 90 ? "text-emerald-500" :
            centerIntegrityIndex > 75 ? "text-amber-500" :
            "text-red-500"
          }`}>{centerIntegrityIndex}% SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Analytical Compliance Parameters */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                COMPLIANCE FAILURES & EXCEPTION AUDITING
              </span>
            </div>
            
            <div className="p-4 space-y-4 font-mono text-xs text-slate-700">
              
              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <span className="font-bold block">Biometric Failures / Mismatches</span>
                  <span className="text-[10px] text-slate-500">Thumbprint or iris details below NTA threshold limits.</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rejectedCount > 0 ? "bg-red-100 text-red-800 border border-red-300" : "bg-slate-100 text-slate-650"}`}>
                  {rejectedCount} DETECTED
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <span className="font-bold block">Duplicate Enrollment Flags</span>
                  <span className="text-[10px] text-slate-500">Same biometric details matched globally in secondary center.</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${duplicateCount > 0 ? "bg-purple-100 text-purple-800 border border-purple-300" : "bg-slate-100 text-slate-650"}`}>
                  {duplicateCount} DETECTED
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <span className="font-bold block">RF Uplink Spectrum Transmissions</span>
                  <span className="text-[10px] text-slate-500">Active signals detected near central room seating.</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${underInvestigationCount > 0 ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse" : "bg-slate-100 text-slate-650"}`}>
                  {underInvestigationCount} INQUESTS
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <span className="font-bold block">Formal Incident Reports Filed</span>
                  <span className="text-[10px] text-slate-500">Documented violations forwarded to central command servers.</span>
                </div>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  {totalBreachesOccurred} RECORDED
                </span>
              </div>

            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-slate-500 font-bold block">COMPLIANCE CODE RE-LOCK SCHEDULES</span>
            <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
              If the center integrity score drops below <strong>80%</strong>, the local Prahari server initiates an automated security freeze. Observer physical biometric credentials are required to decrypt printing packets for incoming afternoon sessions.
            </p>
          </div>

        </div>

        {/* Right Side: Integrity Event Logs Timeline */}
        <div className="bg-white border border-slate-200 rounded-sm flex flex-col">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
              SECURING CORRIDOR / CHRONOS AUDIT TIMELINE
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
            {activityLogs.slice().reverse().map(log => {
              const isCritical = log.status === "Critical";
              const isWarning = log.status === "Warning";
              
              return (
                <div key={log.id} className={`p-3 rounded-sm border flex gap-3 ${
                  isCritical ? "bg-red-50 border-red-200 text-red-900" :
                  isWarning ? "bg-amber-50 border-amber-200 text-amber-900" :
                  "bg-slate-50 border-slate-200 text-slate-750"
                }`}>
                  <div className="font-bold shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="space-y-1 flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span className="underline">{log.action}</span>
                      <span className="text-[9px] font-mono font-medium text-slate-400">Ref: {log.systemReference}</span>
                    </div>
                    <p className="text-slate-650 text-[11px] font-sans leading-relaxed">{log.details}</p>
                    <div className="text-[9px] text-slate-500">Operator: {log.user} ({log.role})</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
