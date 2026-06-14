/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AdminUser, ExamCenter, Subject, AuditLog } from "../types";
import { Users, Server, Shield, ToggleLeft, Video, CheckCircle2, Cloud, HardDrive, KeyRound, Radio, Search } from "lucide-react";

interface AdminDirectoryProps {
  users: AdminUser[];
  centers: ExamCenter[];
  subjects: Subject[];
  auditLogs: AuditLog[];
  onToggleCctv: (id: string) => void;
}

export default function AdminDirectory({
  users,
  centers,
  subjects,
  auditLogs,
  onToggleCctv
}: AdminDirectoryProps) {
  const [activeSegment, setActiveSegment] = useState<"USERS" | "CENTERS" | "SUBJECTS" | "LOGS" | "SETTINGS">("USERS");
  const [logFilterQuery, setLogFilterQuery] = useState("");

  const filteredLogs = auditLogs.filter(log => {
    if (!logFilterQuery.trim()) return true;
    const query = logFilterQuery.toLowerCase();
    return (
      log.userEmail.toLowerCase().includes(query) ||
      log.actionCode.toLowerCase().includes(query) ||
      log.actionDetails.toLowerCase().includes(query) ||
      log.ipAddress.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title with Segment controllers */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">SYSTEM REPOSITORIES & SECURE PARAKH CONTROLS</h2>
          <p className="text-xs text-slate-500">
            Control center settings, physical CCTV security monitoring, authority access catalogs, and operational sys-logs.
          </p>
        </div>

        {/* Small tabs */}
        <div className="flex gap-1 border border-slate-200 bg-slate-100 p-0.5 rounded-sm">
          <button
            onClick={() => setActiveSegment("USERS")}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer rounded-sm ${activeSegment === "USERS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveSegment("CENTERS")}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer rounded-sm ${activeSegment === "CENTERS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600"}`}
          >
            CCTV & Centers
          </button>
          <button
            onClick={() => setActiveSegment("SUBJECTS")}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer rounded-sm ${activeSegment === "SUBJECTS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600"}`}
          >
            Syllabus Subjects
          </button>
          <button
            onClick={() => setActiveSegment("LOGS")}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer rounded-sm ${activeSegment === "LOGS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600"}`}
          >
            Sys-Logs
          </button>
          <button
            onClick={() => setActiveSegment("SETTINGS")}
            className={`px-2.5 py-1 text-xs font-semibold cursor-pointer rounded-sm ${activeSegment === "SETTINGS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600"}`}
          >
            Cryptographic Keys
          </button>
        </div>
      </div>

      {activeSegment === "USERS" && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200 text-xs text-slate-605">
            Admin credentials represent authorized civil officers logged on the PARAKH systemic grid. All actions are traced to designated email, clearance tiers, and hardware token IDs.
          </div>

          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-4 py-2.5 font-bold text-[10px]">OFFICER ID</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">NAME & EMAIL</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">ASSESSMENT GRID ROLE</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">CLEARANCE LEVEL</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">MFA TOKEN SECURE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-950">{u.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-slate-500 font-mono text-[10px]">{u.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-650 font-semibold font-mono">{u.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                          u.clearanceLevel === "LEVEL_3" ? "bg-red-50 text-red-800 border-red-250" :
                          u.clearanceLevel === "LEVEL_2" ? "bg-amber-50 text-amber-800 border-amber-250" :
                          "bg-blue-50 text-blue-800 border-blue-250"
                        }`}>
                          {u.clearanceLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-green-700 uppercase">
                        {u.isMfaEnabled ? "✓ HARDWARE_MFA_ACTIVE" : "⚠️ BYPASS_MODE"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSegment === "CENTERS" && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono mb-1">
              <Video className="h-4 w-4" /> SECURE EXAM CENTER SURVEILLANCE FEED CONTROLS
            </h4>
            <p className="text-xs text-slate-650 mt-1 leading-normal">
              Physical examination centers are equipped with live CCTV streams feeding spatial anomaly metrics directly to the state control center. In the event of system outages or auditing disruptions, supervisors may override feeds to force immediate on-site verification drills.
            </p>
          </div>

          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-3 py-2.5 font-bold text-[10px]">CENTER CODE</th>
                    <th className="px-3 py-2.5 font-bold text-[10px]">CENTER NAME & REGION</th>
                    <th className="px-3 py-2.5 font-bold text-[10px] text-center">CAPACITY</th>
                    <th className="px-3 py-2.5 font-bold text-[10px] text-center">CCTV STATUS BAR</th>
                    <th className="px-3 py-2.5 font-bold text-[10px] text-center">SECURE STREAMS</th>
                    <th className="px-3 py-2.5 font-bold text-[10px] text-center">OVERRIDE TRIPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {centers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-3 font-mono font-bold text-slate-800">{c.centerCode}</td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-slate-400 text-[10px] font-mono">{c.city}, {c.state}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-800 font-mono">{c.capacity}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold border ${
                          c.cctvStatus === "ONLINE" ? "bg-emerald-50 border-emerald-250 text-emerald-800" : "bg-red-50 border-red-250 text-red-800"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.cctvStatus === "ONLINE" ? "bg-emerald-600 animate-pulse" : "bg-red-600"
                          }`} />
                          {c.cctvStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold">{c.secureStreams} Feeds</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => onToggleCctv(c.id)}
                          className={`px-3 py-1 text-[10px] font-semibold cursor-pointer rounded-sm border ${
                            c.cctvStatus === "ONLINE" 
                              ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100" 
                              : "bg-emerald-50 text-emerald-990 border-emerald-300 hover:bg-emerald-100"
                          }`}
                        >
                          {c.cctvStatus === "ONLINE" ? "Simulate Signal Trip" : "Reconnect CCTV Feed"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSegment === "SUBJECTS" && (
        <div className="space-y-4">
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-4 py-2.5 font-bold text-[10px]">SUBJECT CODE</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">DEPARTMENT NAME</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">ACADEMIC DOMAIN</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">CHAPTERS</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">APPROVED QUESTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold rounded font-mono">
                          {s.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500 font-mono">{s.chaptersCount} Units</td>
                      <td className="px-4 py-3 text-center text-slate-800 font-mono font-bold">{s.totalQuestions} items</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSegment === "LOGS" && (
        <div className="space-y-4">
          <div className="admin-card p-4 bg-white flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={logFilterQuery}
                onChange={(e) => setLogFilterQuery(e.target.value)}
                placeholder="Audit match user, action indices, ip profiles..."
                className="admin-input h-9 pl-7 pr-2 w-full text-xs"
              />
            </div>
            {logFilterQuery && (
              <button
                onClick={() => setLogFilterQuery("")}
                className="text-xs text-slate-600 hover:text-slate-950 cursor-pointer font-medium"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-4 py-2 font-bold text-[10px]">TIME REFERENCE</th>
                    <th className="px-4 py-2 font-bold text-[10px]">ACTION SECURITY CODE</th>
                    <th className="px-4 py-2 font-bold text-[10px]">COMMIT FOOTPRINT EMAIL</th>
                    <th className="px-4 py-2 font-bold text-[10px]">TRANSACTION DATA</th>
                    <th className="px-4 py-2 font-bold text-[10px] text-center">METRIC REFERENCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-slate-950 text-slate-350">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-900 border-b border-slate-900 last:border-b-0 leading-relaxed">
                      <td className="px-4 py-2 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 text-red-400 font-bold whitespace-nowrap">{log.actionCode}</td>
                      <td className="px-4 py-2 text-slate-300">{log.userEmail}</td>
                      <td className="px-4 py-2 text-slate-100 font-sans text-xs">{log.actionDetails}</td>
                      <td className="px-4 py-2 text-center text-slate-400 whitespace-nowrap">IP: {log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSegment === "SETTINGS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="admin-card p-5 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono">System Integrity Verification Credentials</h3>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-400">MASTER SYSTEM DATA SEED CERTIFICATE</span>
                <div className="p-2.5 bg-slate-50 border border-slate-300 text-slate-800 break-all select-all mt-1">
                  SHA256: 4df13eeb2031a0ea212bc0f7a2ea49abb09bfac0d8c26c2048abcdfdfd72eb0a1
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">SECURE SIGNING KEY SCHEME</span>
                <div className="p-2 bg-slate-50 border border-slate-300 text-slate-650 mt-1">
                  RSA-2048: PARAKH_PRIMARY_ROOT_KEY_EXAM (VALID)
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 font-sans text-amber-800">
                ⚠️ Operational Directive: Modifying these primary verification key sets invalidates signed validation attributes. Do not rotate active keys during active evaluations.
              </div>
            </div>
          </div>

          <div className="admin-card p-5 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono">Central Registry Connection Status</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Cloud className="h-8 w-8 text-slate-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">National Central Registry Hub</h4>
                  <p className="text-slate-500 mt-0.5">Connection status is fully compliant under SLA. Active sync detected across national assessment registries.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <HardDrive className="h-8 w-8 text-slate-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Primary Systems Cache</h4>
                  <p className="text-slate-500 mt-0.5">Cache usage: 22.4 MB allocated. Automatically updated periodically during assessment events.</p>
                </div>
              </div>
              
              <div className="p-3 bg-slate-100 text-slate-600 font-mono text-[10px] leading-relaxed">
                SECURITY_HASH: AES-GCM-256<br />
                AUDIT_LOG_TRACKER: SYNCED<br />
                MIME_CHECKS: STRICT
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
