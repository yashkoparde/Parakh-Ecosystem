/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Candidate, PaperRelease, PrintBatch, IncidentReport, CenterConfig } from "../types";
import { FileText, Shield, Key, Printer, AlertTriangle, Printer as PrinterIcon, CheckSquare, PencilLine } from "lucide-react";

interface ReportsViewProps {
  candidates: Candidate[];
  paperReleases: PaperRelease[];
  printBatches: PrintBatch[];
  incidentReports: IncidentReport[];
  centerConfig: CenterConfig;
}

export default function ReportsView({
  candidates,
  paperReleases,
  printBatches,
  incidentReports,
  centerConfig
}: ReportsViewProps) {
  const [stampPin, setStampPin] = useState("");
  const [signOffCompleted, setSignOffCompleted] = useState(false);
  const [signOffError, setSignOffError] = useState("");

  const totalCandidates = candidates.length;
  const verifiedCount = candidates.filter(c => c.verificationStatus === "Verified").length;
  const rejectedCount = candidates.filter(c => c.verificationStatus === "Rejected").length;
  const absentCount = candidates.filter(c => c.verificationStatus === "Absent").length;
  const duplicateCount = candidates.filter(c => c.verificationStatus === "Duplicate").length;

  const totalPrinted = printBatches.reduce((acc, curr) => acc + curr.printed, 0);
  const totalIncidentsCount = incidentReports.length;

  const handleExecuteSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (stampPin !== "9042-STAMP") {
      setSignOffError("ERROR: Official submission signature PIN invalid. Enter '9042-STAMP' as certified bypass validation.");
      return;
    }
    setSignOffCompleted(true);
    setSignOffError("");
  };

  return (
    <div className="space-y-6">
      
      {/* Information Header Block */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            PARAKH DIGTIALLY STAMPED CLOSURE REPORT
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Generate and digitally endorse of the terminal session parameters. Handover summaries require synchronous dual authorization signatures of the Superintendent and NTA Observer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (Col-span-8): Printable Government Dispatch Summary */}
        <div className="lg:col-span-8 bg-white border border-slate-300 p-6 rounded-sm space-y-6 font-mono text-xs text-slate-800">
          
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800 font-sans">
            <h3 className="text-sm font-bold tracking-widest text-[#0F172A]">NATIONAL TESTING AGENCY</h3>
            <h4 className="text-xs font-semibold text-slate-700 uppercase">PARAKH EXAMINATION STATUS CONVEYANCE BRIEF</h4>
            <p className="text-[10px] text-slate-500 font-mono">Date-stamp: 12-JUN-2026 • Center: {centerConfig.centerId}</p>
          </div>

          {/* Identification Section */}
          <div className="space-y-1.5 py-2 border-b border-dashed border-slate-300">
            <span className="font-bold underline text-[#0F172A] block uppercase text-[10px]">I. CENTER CLASSIFICATION</span>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div><strong>Center Code:</strong> {centerConfig.centerId}</div>
              <div><strong>NIC VPN Tunnel Host:</strong> {centerConfig.currentIp}</div>
              <div className="col-span-2"><strong>Institution Name:</strong> {centerConfig.centerName}, {centerConfig.city}, {centerConfig.state}</div>
              <div><strong>Chief Coordinator:</strong> {centerConfig.chiefSuperintendent}</div>
              <div><strong>Central Representative Observer:</strong> {centerConfig.observerName}</div>
            </div>
          </div>

          {/* Candidate Metrics Section */}
          <div className="space-y-1.5 py-2 border-b border-dashed border-slate-300">
            <span className="font-bold underline text-[#0F172A] block uppercase text-[10px]">II. CANDIDATE ROSTER RECONCILIATION</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
              <div><strong>Total Registered:</strong> {totalCandidates} Candidates</div>
              <div><strong>Verified (Present):</strong> {verifiedCount} Candidates</div>
              <div><strong>Absent:</strong> {absentCount} Candidates</div>
              <div><strong>Biometric Rejects:</strong> {rejectedCount} Candidates</div>
              <div><strong>Duplicates Flagged:</strong> {duplicateCount} Candidates</div>
              <div className="col-span-3">
                <strong>Roster Clearance Accuracy Ratio:</strong> {totalCandidates > 0 ? ((verifiedCount / totalCandidates) * 100).toFixed(1) : 0}% Check-in rate
              </div>
            </div>
          </div>

          {/* Paper Release / printing Section */}
          <div className="space-y-1.5 py-2 border-b border-dashed border-slate-300">
            <span className="font-bold underline text-[#0F172A] block uppercase text-[10px]">III. PRAHARI RELEASES & DISTRIBUTION</span>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div><strong>Total Syllabus Packages Decrypted:</strong> {paperReleases.filter(p => p.status === "Released").length}</div>
              <div><strong>Total Duplex Copying Spools:</strong> {printBatches.length} Batches</div>
              <div><strong>Watermarked Sheets Finished:</strong> {totalPrinted} Copies</div>
              <div><strong>Estimated Audit Discrepancies:</strong> 0 Sheets out of balance</div>
            </div>
          </div>

          {/* Security and Integrity Alert Section */}
          <div className="space-y-1.5 py-2 border-b border-dashed border-slate-300">
            <span className="font-bold underline text-[#0F172A] block uppercase text-[10px]">IV. DRISHTI COMPLIANCE & SECURITY INCIDENTS</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><strong>RF Signal Intrusions Detected:</strong> {incidentReports.filter(i => i.incidentType === "Device Detection").length} alerts</div>
              <div><strong>Identity Impersonation Incidents:</strong> {incidentReports.filter(i => i.incidentType === "Impersonation").length} claims</div>
              <div className="col-span-2">
                <strong>Current Compliance Rating:</strong> {centerConfig.isLockedDown ? "TERMINAL DISCHARGED LOCKDOWN" : "98.8% COMPLIANT CLASS AA"}
              </div>
            </div>
          </div>

          {/* Digital Signature Footer Verification */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-[11px] font-sans">
            <div className="border-t border-slate-400 pt-4 text-center space-y-1">
              <span className="font-bold block text-slate-800">
                {signOffCompleted ? "Dr. Rameshwar Prasad" : "_______________________________"}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">CHIEF SUPERINTENDENT SIGNATURE</span>
              {signOffCompleted && (
                <span className="text-[9px] font-mono text-emerald-700 font-bold block bg-emerald-50 max-w-xs mx-auto border border-emerald-300 rounded py-0.5 px-1 uppercase">
                  ✓ SECURED DIGISIGN: {centerConfig.secureKey}
                </span>
              )}
            </div>

            <div className="border-t border-slate-400 pt-4 text-center space-y-1">
              <span className="font-bold block text-slate-800">
                {signOffCompleted ? "Prof. Animesh Sen" : "_______________________________"}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">CENTRAL OBSERVER SIGNATURE</span>
              {signOffCompleted && (
                <span className="text-[9px] font-mono text-emerald-700 font-bold block bg-emerald-50 max-w-xs mx-auto border border-emerald-300 rounded py-0.5 px-1 uppercase">
                  ✓ OBSERVER KEY APPROVED: AS-904
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Right Side (Col-span-4): Digital Submission Action Form */}
        <div className="lg:col-span-4">
          {!signOffCompleted ? (
            <div className="bg-white border-2 border-slate-800 p-4 rounded-sm space-y-4 font-mono text-xs">
              <div className="border-b border-slate-205 pb-2">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">ACTION CONSOLE</span>
                <h3 className="font-bold text-[#0F172A] mt-0.5">ENDORSE CLOSURE BRIEF</h3>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 font-sans">
                To digitally stamp this brief and broadcast secure parameters to NTA Head Office, please supply the dual operations submission validation stamp token PIN.
              </p>

              <form onSubmit={handleExecuteSignOff} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-705 font-bold">ENTER DIGITAL SUBMISSION STAMP PIN</label>
                  <input
                    id="stamp-submission-pin"
                    type="password"
                    required
                    value={stampPin}
                    onChange={(e) => setStampPin(e.target.value)}
                    placeholder="Input '9042-STAMP' for test"
                    className="bg-white border border-slate-350 p-2 text-xs"
                  />
                </div>

                {signOffError && (
                  <div className="text-[11px] text-red-800 p-2 bg-red-50 border border-red-250 rounded font-mono font-bold leading-normal">
                    {signOffError}
                  </div>
                )}

                <button
                  id="btn-execute-sign-off"
                  type="submit"
                  className="w-full bg-[#1E293B] hover:bg-slate-800 text-white font-bold font-mono py-2 rounded-sm border border-slate-700 uppercase"
                >
                  STAMP AND SEAL RECORDS
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50 border-2 border-emerald-800 p-4 rounded-sm space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-900 border-b border-emerald-300 pb-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span className="font-bold uppercase">DISPATCH CONFIRMED</span>
              </div>
              
              <p className="text-[11px] leading-relaxed text-emerald-800 font-sans">
                The shift report brief has been frozen, digitally countersigned by the local operational cryptosystem, and dispatched securely over VPN NIC pipes to regional command directories.
              </p>

              <button
                id="btn-print-summary-dispatch"
                onClick={() => window.print()}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-mono font-bold py-2 rounded-sm border border-emerald-700 flex items-center justify-center gap-1.5 uppercase transition-colors"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                Trigger Hardware Print PDF
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
