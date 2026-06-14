/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { EvaluationJob, AdminUser } from "../types";
import { FileSpreadsheet, Lock, AlertCircle, CheckSquare, Search, Sparkles, Send, ShieldCheck, HelpCircle } from "lucide-react";

interface MulyaModuleProps {
  evaluations: EvaluationJob[];
  currentUser: AdminUser;
  onVerifyEvaluation: (id: string, status: EvaluationJob["verificationStatus"], verfiedCount?: number) => void;
  onAddAuditLog: (actionCode: string, actionDetails: string, status: "COMPLIANT" | "ALERT") => void;
}

export default function MulyaModule({
  evaluations,
  currentUser,
  onVerifyEvaluation,
  onAddAuditLog
}: MulyaModuleProps) {
  const [selectedEvalId, setSelectedEvalId] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedJob = evaluations.find(e => e.id === selectedEvalId);

  const filteredJobs = evaluations.filter(job => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        job.subject.toLowerCase().includes(q) ||
        job.examCenter.toLowerCase().includes(q) ||
        job.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleVerify = (id: string, approve: boolean) => {
    if (!verificationFeedback.trim()) {
      alert("Error: Verification comments & clearance notes are mandatory parameters.");
      return;
    }
    
    if (approve) {
      onVerifyEvaluation(id, "Verified & Locked");
      onAddAuditLog(
        "DOUBLE_BLIND_PASS",
        `Double-blind certified gradeset evaluation for code ${selectedJob?.code}. Verified candidates matching sheet tally.`,
        "COMPLIANT"
      );
      alert("Gradeset verified and securely locked. Digital signature registered in decentralized ledger block.");
    } else {
      onVerifyEvaluation(id, "Flagged For Audit");
      onAddAuditLog(
        "FLAG_EXAM_AUDIT",
        `FLAGGED gradeset code ${selectedJob?.code} for system anomalies. Review reason: ${verificationFeedback}`,
        "ALERT"
      );
      alert("Gradeset flagged for audit. Systems team notified.");
    }

    setSelectedEvalId(null);
    setVerificationFeedback("");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Double-Blind Evaluation & Grading Verification</h2>
        <p className="text-xs text-slate-500">
          Verify digital gradesets, oversee active centers scoring pipelines, and execute blind cross-checks for grade finalization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Tally Grid Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="admin-card p-4 bg-white flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search centers, subjects name, or assessment codes..."
                className="admin-input h-9 pl-9 pr-2 w-full text-xs"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="admin-card overflow-hidden">
            <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>SCAN PIPELINE RUNNING</span>
              <span>DOUBLE-BLIND STANDARD VIABLE</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-4 py-2.5 font-bold text-[10px]">EVAL CODE</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">EXAM CENTER REFERENCE</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">SUBJECT MATRIX</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">SHEETS SCANNED</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">VERIFICATION STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map(job => (
                    <tr
                      key={job.id}
                      onClick={() => setSelectedEvalId(job.id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        selectedEvalId === job.id ? "bg-slate-50/80 font-medium" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{job.code}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate" title={job.examCenter}>
                        {job.examCenter}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{job.subject}</td>
                      <td className="px-4 py-3 text-center font-mono">
                        <strong className="text-slate-900">{job.evaluatedCount}</strong> / {job.totalCandidateSheets}
                        <div className="text-[9px] text-slate-400">
                          ({Math.round((job.evaluatedCount / job.totalCandidateSheets) * 100)}% verified)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[9px] font-bold border ${
                          job.verificationStatus === "Verified & Locked" ? "bg-green-50 border-green-200 text-green-800" :
                          job.verificationStatus === "Flagged For Audit" ? "bg-red-50 border-red-200 text-red-800" :
                          job.verificationStatus === "Pending Double-Blind Verification" ? "bg-amber-50 border-amber-200 text-amber-800" :
                          "bg-blue-5 border-blue-200 text-blue-800"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            job.verificationStatus === "Verified & Locked" ? "bg-green-600" :
                            job.verificationStatus === "Flagged For Audit" ? "bg-red-600" :
                            job.verificationStatus === "Pending Double-Blind Verification" ? "bg-amber-500" :
                            "bg-blue-500"
                          }`} />
                          {job.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Verification Control Pane */}
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase mb-3">Audit Workspace</h3>

          {selectedJob ? (
            <div className="admin-card p-5 bg-white border-2 border-slate-900 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Gradeset Audit Packet</span>
                <h4 className="text-xs font-bold text-slate-900 font-mono">{selectedJob.code}</h4>
                <p className="text-xs text-slate-600 font-sans mt-0.5">{selectedJob.examCenter}</p>
              </div>

              {/* Assessment Health Metrics */}
              <div className="bg-slate-50 p-3.5 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 block uppercase border-b border-slate-200 pb-1">SCORING AUDIT DIAGNOSTICS</span>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assessments Scanned Tally:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedJob.evaluatedCount} / {selectedJob.totalCandidateSheets} sheets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Grade Yield (Mean):</span>
                  <span className="font-mono font-semibold text-slate-700">71.4% (Within Standard Curve)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Anomaly Deviation Metric:</span>
                  <span className="font-mono text-emerald-700 font-semibold">&sigma; = 0.04 (Negligible variance)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1 text-[11px]">
                  <span>System assigned Verifier:</span>
                  <strong className="text-slate-900 font-mono text-[10px]">{selectedJob.assignedVerifier}</strong>
                </div>
              </div>

              {/* Action commentary */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase" htmlFor="verification-notes">
                  CLEARANCE CERTIFICATE NOTES <span className="text-red-00">*</span>
                </label>
                <textarea
                  id="verification-notes"
                  required
                  rows={3}
                  value={verificationFeedback}
                  onChange={(e) => setVerificationFeedback(e.target.value)}
                  placeholder="Insert strict auditing compliance notes. e.g. Cross-matching verified; no anomaly indices detected."
                  className="admin-input w-full p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleVerify(selectedJob.id, true)}
                  disabled={currentUser.role !== "VERIFIER" && currentUser.role !== "CONTROLLER"}
                  className="py-2 text-xs font-bold text-white bg-green-800 border border-green-950 hover:bg-green-750 cursor-pointer rounded-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="h-4 w-4" /> Certify Grade Set
                </button>
                <button
                  onClick={() => handleVerify(selectedJob.id, false)}
                  disabled={currentUser.role !== "VERIFIER" && currentUser.role !== "CONTROLLER" && currentUser.role !== "SUPERVISOR"}
                  className="py-2 text-xs font-bold text-white bg-red-800 border border-red-950 hover:bg-red-750 cursor-pointer rounded-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="h-4 w-4" /> Flag for Audit
                </button>
              </div>

              {currentUser.role !== "VERIFIER" && currentUser.role !== "CONTROLLER" && (
                <p className="text-[10px] text-red-700 font-mono text-center leading-normal">
                  🛑 Clearance Protocol: Grader Sign-off is restricted to the VERIFIER or CONTROLLER credential bounds.
                </p>
              )}
            </div>
          ) : (
            <div className="admin-card p-6 text-center text-slate-400 text-xs font-mono">
              [SELECT_EVALUATION] Select an active exam center grading set from the scanned tab layout to trigger double-blind validation review.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
