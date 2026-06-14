/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Question, GeneratedPaper, EvaluationJob, AuditLog, BlockchainRecord, ExamCenter } from "../types";
import { ShieldCheck, AlertCircle, FileText, Activity, Clock, Server, CheckSquare, PlusCircle } from "lucide-react";

interface DashboardModuleProps {
  questions: Question[];
  generatedPapers: GeneratedPaper[];
  evaluations: EvaluationJob[];
  auditLogs: AuditLog[];
  blockchainRecords: BlockchainRecord[];
  centers: ExamCenter[];
  onNavigateToTab: (tab: "DRONA" | "VEDA" | "MULYA" | "SAKSHYA" | "DIRECTORY") => void;
}

export default function DashboardModule({
  questions,
  generatedPapers,
  evaluations,
  auditLogs,
  blockchainRecords,
  centers,
  onNavigateToTab
}: DashboardModuleProps) {
  
  // Computations for Admin indicators
  const pendingApprovalsCount = questions.filter(q => q.status === "Pending Review").length;
  const draftPapersCount = generatedPapers.filter(p => p.status === "Draft").length;
  const sealedPapersCount = generatedPapers.filter(p => p.status === "Securely Sealed").length;
  const pendingVerificationCount = evaluations.filter(e => e.verificationStatus === "Pending Double-Blind Verification").length;
  const flaggedEvaluationCount = evaluations.filter(e => e.verificationStatus === "Flagged For Audit").length;
  
  // CCTV state
  const offlineCentersCount = centers.filter(c => c.cctvStatus === "OFFLINE").length;

  return (
    <div className="space-y-6">
      
      {/* Structural Headers with Status Banner */}
      <div className="bg-slate-900 border-l-4 border-slate-700 text-white p-4 justify-between flex flex-wrap items-center gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase">SYSTEM OVERVIEW</span>
          <h2 className="text-base font-bold font-mono tracking-normal">PORTAL ADMINISTRATION DASHBOARD</h2>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="border-r border-slate-800 pr-4">
            <div className="text-[10px] text-slate-500">EXAM CENTERS</div>
            <div className="font-semibold text-emerald-400">{centers.length} Registered</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">CCTV MONITORING</div>
            <div className={`${offlineCentersCount > 0 ? "text-amber-500 font-bold" : "text-emerald-400 font-semibold"}`}>
              {offlineCentersCount > 0 ? `${offlineCentersCount} Sites Offline` : "All Feeds Active"}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Items Awaiting Attention (Dense, Urgent Warnings) */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">Action Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div
            onClick={() => onNavigateToTab("DRONA")}
            className="admin-card p-4 hover:border-slate-400 cursor-pointer transition-all bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500">PENDING BOARD APPROVALS</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">{pendingApprovalsCount} Questions</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Awaiting syllabus board sign-off</p>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${pendingApprovalsCount > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab("MULYA")}
            className="admin-card p-4 hover:border-slate-400 cursor-pointer transition-all bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500">GRADING VERIFICATION</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">{pendingVerificationCount} Gradesets</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Ready for verification Check</p>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${pendingVerificationCount > 0 ? "bg-blue-100 text-blue-700 font-bold" : "bg-slate-100 text-slate-400"}`}>
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab("MULYA")}
            className="admin-card p-4 hover:border-slate-400 cursor-pointer transition-all bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500">OFFLINE SITE ALERTS</div>
              <div className="text-xl font-bold font-mono text-red-800 mt-1">{flaggedEvaluationCount + offlineCentersCount} Feed Warnings</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Offline CCTV check required</p>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${(flaggedEvaluationCount + offlineCentersCount) > 0 ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-100 text-slate-400"}`}>
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigateToTab("VEDA")}
            className="admin-card p-4 hover:border-slate-400 cursor-pointer transition-all bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500">GENERATED EXAMS</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">{sealedPapersCount} Papers</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Ready for distribution</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Core Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Recent Generations & Active CCTV Map logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Generations */}
          <div className="admin-card bg-white rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-650 tracking-wider">COMPILED ASSESSMENT PACKS</span>
              <button onClick={() => onNavigateToTab("VEDA")} className="text-[11px] font-mono text-slate-700 hover:underline">Manage Papers</button>
            </div>

            <div className="divide-y divide-slate-100">
              {generatedPapers.map(p => (
                <div key={p.id} className="p-3.5 hover:bg-slate-50 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{p.code}</span>
                      <span className="text-[10px] text-slate-500">{p.subject}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 mt-1">{p.title}</h4>
                    <p className="font-mono text-[9px] text-slate-400 mt-1 truncate max-w-sm" title={p.sha256Hash}>
                      Document Hash: {p.sha256Hash.slice(0, 24)}...
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className={`inline-block text-[9px] font-bold border rounded px-1.5 py-0.2 ${
                      p.status === "Released" ? "bg-green-55 border-green-200 text-green-800" : "bg-blue-50 border-blue-250 text-blue-800"
                    }`}>
                      {p.status}
                    </span>
                    <div className="text-[9px] font-mono text-slate-400 mt-2">{new Date(p.generatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Center Monitoring Tallies */}
          <div className="admin-card bg-white rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-650 tracking-wider">REGIONAL EXAM CENTERS</span>
              <button onClick={() => onNavigateToTab("DIRECTORY")} className="text-[11px] font-mono text-slate-700 hover:underline">View All Sites</button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {centers.slice(0, 3).map(c => (
                <div key={c.id} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-450 font-bold">{c.centerCode}</span>
                    <h5 className="font-semibold text-slate-900 mt-0.5">{c.name}</h5>
                    <span className="text-[10px] text-slate-450">{c.city}, {c.state}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">CAMERA STREAM STATUS</div>
                      <div className={`font-mono text-[10px] font-bold flex items-center gap-1 mt-0.5 ${c.cctvStatus === "ONLINE" ? "text-green-700" : "text-red-700"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.cctvStatus === "ONLINE" ? "bg-green-600 animate-pulse" : "bg-red-600"}`} />
                        {c.cctvStatus} ({c.secureStreams} Streams Connected)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: System Logs & Audit summaries */}
        <div className="space-y-6">
          
          {/* Activity Audit Tracker */}
          <div className="admin-card p-4 bg-slate-900 border-slate-800 text-slate-200 font-mono text-xs rounded-sm space-y-3.5">
            <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Activity Audit Tracker</span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">SYNCHRONIZED</span>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed">
              <div className="flex justify-between">
                <span className="text-slate-500">AUDITED RECORDS:</span>
                <span className="text-slate-100 font-semibold">{blockchainRecords.length} Items Logged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PORTAL STATUS:</span>
                <span className="text-slate-100">Verified & Secure</span>
              </div>
              <div className="flex justify-between truncate">
                <span className="text-slate-500">LATEST ACTIVITY ID:</span>
                <span className="text-slate-350 select-all font-bold">{blockchainRecords[0]?.transactionHash.slice(0, 18)}...</span>
              </div>
              <button
                onClick={() => onNavigateToTab("SAKSHYA")}
                className="w-full text-center bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer pt-1.5 pb-1.5 px-3 block font-bold text-[10px] rounded-sm"
              >
                Go to Audit Records
              </button>
            </div>
          </div>

          {/* Recent Audit events */}
          <div className="admin-card bg-white rounded-sm overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
              <span className="text-[11px] font-mono font-bold text-slate-600 tracking-wider">PORTAL SECURITY LOG</span>
            </div>

            <div className="p-3 text-[11px] font-mono divide-y divide-slate-100 space-y-2">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="pt-2 first:pt-0">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{log.actionCode}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-900 mt-1 font-sans leading-relaxed text-xs">{log.actionDetails}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
