/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Candidate, 
  PaperRelease, 
  PrintBatch, 
  DeviceEvent, 
  IncidentReport, 
  ExamSession, 
  CenterConfig 
} from "../types";
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  Printer, 
  UserCheck, 
  Network, 
  AlertTriangle, 
  ArrowRight,
  Database,
  Shield
} from "lucide-react";

interface DashboardViewProps {
  candidates: Candidate[];
  paperReleases: PaperRelease[];
  printBatches: PrintBatch[];
  deviceEvents: DeviceEvent[];
  incidentReports: IncidentReport[];
  sessions: ExamSession[];
  centerConfig: CenterConfig;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({
  candidates,
  paperReleases,
  printBatches,
  deviceEvents,
  incidentReports,
  sessions,
  centerConfig,
  onNavigate
}: DashboardViewProps) {
  // Compute key stats
  const activeSession = sessions.find(s => s.status === "Active") || sessions[0];
  const pendingCandidates = candidates.filter(c => c.verificationStatus === "Pending").length;
  const verifiedCandidates = candidates.filter(c => c.verificationStatus === "Verified").length;
  const totalPrintersOnline = centerConfig.totalPrinters;
  
  // High-severity alerts
  const criticalDetections = deviceEvents.filter(d => d.severity === "Critical" && d.status === "Under Investigation");
  const urgentIncidents = incidentReports.filter(i => i.severity === "Critical" && i.status !== "Closed");

  // Sum total printed so far
  const totalPrinted = printBatches.reduce((acc, curr) => acc + curr.printed, 0);
  const totalRequired = printBatches.reduce((acc, curr) => acc + curr.totalRequired, 0);

  return (
    <div className="space-y-6">
      {/* Official Status Header Bar */}
      <div className="bg-slate-900 text-slate-100 p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono rounded-sm">
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">ACTIVE EXAM SESSION</div>
          <div className="text-sm font-bold text-slate-200">
            {activeSession ? `${activeSession.examName} (${activeSession.subject})` : "NO ACTIVE SESSION"}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 block text-[9px]">CENTER CODE</span>
            <span className="text-slate-300 font-bold">{centerConfig.centerId}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 block text-[9px]">CONNECTION STATE</span>
            <span className="text-emerald-500 font-semibold">SECURE RE-VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Operational Stats Grid (Dense, Rectangular, No Glassmorphism) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Verification Widget */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">CANDIDATE CHECK-IN</span>
              <h3 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-1 font-mono">
                {verifiedCandidates} <span className="text-xs text-slate-400 font-normal">/ {candidates.length}</span>
              </h3>
            </div>
            <div className="bg-slate-100 p-1.5 rounded text-slate-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-105 flex items-center justify-between text-xs text-slate-500">
            <span>{pendingCandidates} Candidates Awaiting</span>
            <button 
              id="dash-jump-verify"
              onClick={() => onNavigate("candidate-verification")} 
              className="text-slate-800 hover:underline flex items-center gap-1 font-semibold"
            >
              Verify <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Paper Decryption Keys Widget */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">SECURE RELEASES</span>
              <h3 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-1 font-mono">
                {paperReleases.filter(p => p.status === "Released").length} <span className="text-xs text-slate-400 font-normal">/ {paperReleases.length}</span>
              </h3>
            </div>
            <div className="bg-slate-100 p-1.5 rounded text-slate-700">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-105 flex items-center justify-between text-xs text-slate-500">
            <span>Next release: 13:15 (Subject II)</span>
            <button 
              id="dash-jump-release"
              onClick={() => onNavigate("paper-release")} 
              className="text-slate-800 hover:underline flex items-center gap-1 font-semibold"
            >
              Decrypt <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Print Batch Production Widget */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">PRINT CONTROL COPIES</span>
              <h3 className="text-2xl font-bold tracking-tight mt-1 font-mono text-emerald-850">
                {totalPrinted} <span className="text-xs text-slate-400 font-normal">/ {totalRequired || 240} printed</span>
              </h3>
            </div>
            <div className="bg-slate-100 p-1.5 rounded text-slate-700">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-105 flex items-center justify-between text-xs text-slate-500">
            <span>{totalPrintersOnline} High-Output Printers Active</span>
            <button 
              id="dash-jump-print"
              onClick={() => onNavigate("print-control")} 
              className="text-slate-800 hover:underline flex items-center gap-1 font-semibold"
            >
              Queue <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Security / System Integrity Score Widget */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">INTEGRITY ALERTS</span>
              <h3 className="text-2xl font-bold tracking-tight text-red-800 mt-1 font-mono">
                {criticalDetections.length + urgentIncidents.length} <span className="text-xs text-slate-400 font-normal">active anomalies</span>
              </h3>
            </div>
            <div className={`p-1.5 rounded ${criticalDetections.length + urgentIncidents.length > 0 ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-105 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-red-750">
              {criticalDetections.length > 0 ? "RF Uplink Incident!" : "No Unresolved Breaches"}
            </span>
            <button 
              id="dash-jump-integrity"
              onClick={() => onNavigate("integrity-monitoring")} 
              className="text-slate-800 hover:underline flex items-center gap-1 font-semibold"
            >
              Monitor <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main operational workspacesplit layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - 2 Thirds: Session Status & Verification Work list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Sessions Overview Table */}
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                EXAMINATION SESSION STATUS LEDGER
              </h3>
              <span className="text-[10px] font-mono text-slate-500">UTC+05:30 SERVER TIME</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider font-mono">
                  <tr>
                    <th className="px-4 py-2">Session ID</th>
                    <th className="px-4 py-2">Subject / Exam Name</th>
                    <th className="px-4 py-2">Timeline</th>
                    <th className="px-4 py-2 text-center">Candidates Verified</th>
                    <th className="px-4 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {sessions.map(sess => (
                    <tr key={sess.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-700">{sess.id}</td>
                      <td className="px-4 py-3">
                        <span className="text-[#0F172A] block font-sans font-medium">{sess.subject}</span>
                        <span className="text-[10px] text-slate-500 font-sans block">{sess.examName}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-sans">{sess.startTime} - {sess.endTime}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {sess.verifiedCandidates} / {sess.totalCandidates}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          sess.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          sess.status === "Scheduled" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                          "bg-slate-200 text-slate-600 border border-slate-300"
                        }`}>
                          {sess.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Queue Preview */}
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                CANDIDATE VERIFICATION STREAM (PENDING REVIEWS)
              </h3>
              <button 
                id="dash-lnk-verify-full"
                onClick={() => onNavigate("candidate-verification")} 
                className="text-[11px] font-bold text-slate-700 hover:underline"
              >
                Launch Verification Suite →
              </button>
            </div>
            <div className="p-4">
              {candidates.filter(c => c.verificationStatus === "Pending").length === 0 ? (
                <div className="p-4 text-center text-slate-500 bg-slate-50 rounded border border-slate-150 font-mono text-xs">
                  ✓ NO PENDING CANDIDATE VERIFICATION REQUESTS IN CENTER QUEUE.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidates.filter(c => c.verificationStatus === "Pending").slice(0, 4).map(cand => (
                    <div key={cand.id} className="border border-slate-200 p-3 bg-slate-50 rounded-sm flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{cand.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ROLL: {cand.rollNo}</div>
                        <div className="text-[10px] text-slate-600 font-sans mt-0.5">Seat: {cand.seatNumber}</div>
                      </div>
                      <button
                        id={`dash-verify-cand-${cand.id}`}
                        onClick={() => onNavigate("candidate-verification")}
                        className="bg-[#1E293B] text-slate-100 hover:bg-slate-800 text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded-sm"
                      >
                        Launch Match
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secure Hardware Diagnostics (Printing Systems) */}
          <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
              SECURED HIGH-OUTPUT PRINT HARDWARE MODULES
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">PRINTER-01</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-emerald-300">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-2">IP: 10.12.89.51</div>
                <div className="text-[10px] text-slate-500">MFR: HP LaserJet Pro High Volume</div>
                <div className="text-[10px] text-slate-600 font-bold mt-1">STATUS: Secured Tray Lock engaged.</div>
              </div>

              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">PRINTER-02</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-emerald-300">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-2">IP: 10.12.89.52</div>
                <div className="text-[10px] text-slate-500">MFR: HP LaserJet Pro High Volume</div>
                <div className="text-[10px] text-slate-600 font-bold mt-1">STATUS: Printing reservoir stable.</div>
              </div>

              <div className="border border-slate-200 p-2.5 rounded bg-red-50 border-red-200">
                <div className="flex justify-between items-center text-red-900">
                  <span className="font-bold">PRINTER-03 (STBY)</span>
                  <span className="bg-red-100 text-red-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-red-300">DRAWER OPEN</span>
                </div>
                <div className="text-[10px] text-red-700 mt-2">IP: 10.12.89.53</div>
                <div className="text-[10px] text-red-700">MFR: HP LaserJet Pro High Volume</div>
                <div className="text-[10px] text-red-800 font-bold mt-1">STATUS: Optical bypass diagnostic trigger.</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - 1 Third: Central Integrity Feed & Official Bulletins */}
        <div className="space-y-6">
          
          {/* Compliance Integrity Alerts Module */}
          <div className="bg-white border-2 border-red-800 rounded-sm">
            <div className="border-b-2 border-red-800 bg-red-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider">SECURITY & COMPLIANCE ALERTS</span>
              </div>
              <span className="text-[9px] bg-red-950 font-mono px-1 rounded">HIGH ATTENTION</span>
            </div>
            
            <div className="p-4 space-y-4">
              {criticalDetections.length === 0 && urgentIncidents.length === 0 ? (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  ✓ NO ACTIVE CRITICAL COMPLIANCE THREATS RECORDED AT THIS HOUR.
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {criticalDetections.map(dev => (
                    <div key={dev.id} className="p-3 bg-red-50 border border-red-200 rounded-sm space-y-1">
                      <div className="flex justify-between text-red-900 font-bold">
                        <span>[RF SPEC ALERT]</span>
                        <span>{dev.dbmStrength} dBm</span>
                      </div>
                      <div className="text-red-800 font-semibold">{dev.deviceType} Detected at {dev.location}</div>
                      <div className="text-[10px] text-slate-600 mt-1">Frequency: {dev.freqMHz} MHz - Secure RF logging system</div>
                      <div className="mt-2 text-right">
                        <button
                          id={`dash-triage-${dev.id}`}
                          onClick={() => onNavigate("device-detection")}
                          className="bg-red-800 text-white text-[9px] px-2 py-0.5 rounded-xs hover:bg-red-900 font-bold"
                        >
                          RESPOND IMMEDIATELY
                        </button>
                      </div>
                    </div>
                  ))}

                  {urgentIncidents.map(inc => (
                    <div key={inc.id} className="p-3 bg-amber-50 border border-amber-300 rounded-sm space-y-1">
                      <div className="flex justify-between text-amber-900 font-bold">
                        <span>[INCIDENT UNRESOLVED]</span>
                        <span className="text-red-700">URGENT</span>
                      </div>
                      <div className="text-amber-800 font-semibold">{inc.incidentType} - {inc.location}</div>
                      <div className="text-[10px] text-slate-600 font-sans mt-1 line-clamp-2">{inc.description}</div>
                      <div className="mt-2 text-right">
                        <button
                          id={`dash-investigate-${inc.id}`}
                          onClick={() => onNavigate("incident-reporting")}
                          className="bg-amber-800 text-white text-[9px] px-2 py-0.5 rounded-xs hover:bg-amber-900 font-bold"
                        >
                          LAUNCH INQUEST
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secure System Circulars / Notices */}
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                OFFICIAL NTA CENTRAL CIRCULARS
              </span>
            </div>
            <div className="p-4 space-y-4 text-xs font-sans">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>CIRCULAR: NTA-ADV-2026-88</span>
                  <span>12-JUN-2026</span>
                </div>
                <h5 className="font-semibold text-slate-800">Compulsory Dual-Fingerprint Biometric Authentication</h5>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  All centers must enforce primary thumb AND secondary index verification on e-KYC units. Under no circumstances should manual token overwrite be permitted without Central Observer biometric bypass key.
                </p>
              </div>

              <div className="space-y-1 pb-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>CIRCULAR: PRH-COMM-14</span>
                  <span>11-JUN-2026</span>
                </div>
                <h5 className="font-semibold text-slate-800">Secure Watermarked Paper Administration</h5>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Decrypted papers generate dynamically coded patterns binding the Chief Superintendent verification token onto printed sheets to verify custody trails. Enforce immediate paper-batch audits.
                </p>
              </div>
            </div>
          </div>

          {/* Observer Handover & Terminal Lockdown State */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-700" />
              <span className="font-bold text-slate-850">NATIONAL CENTER COMPLIANCE</span>
            </div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Observer Presence:</span>
                <span className="text-emerald-700 font-bold">VERIFIED (IN-ROOM B)</span>
              </div>
              <div className="flex justify-between">
                <span>Biometric Check-in:</span>
                <span className="text-slate-700">07:44 (STF-02)</span>
              </div>
              <div className="flex justify-between">
                <span>Intranet Port Lock:</span>
                <span className="text-emerald-700 font-bold">STATE RE-ENGAGED</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[9px] text-slate-400 leading-normal">
                This operations terminal reports all audit traces directly to national servers. Tampering, unlogged key downloads, or offline operations will trigger automated encryption locks.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
