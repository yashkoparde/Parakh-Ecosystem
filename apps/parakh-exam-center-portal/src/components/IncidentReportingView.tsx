/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { IncidentReport, Candidate } from "../types";
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2, ChevronRight, FileSpreadsheet, Lock } from "lucide-react";

interface IncidentReportingViewProps {
  incidentReports: IncidentReport[];
  candidates: Candidate[];
  onSubmitIncident: (report: Omit<IncidentReport, "id" | "timestamp">) => void;
}

export default function IncidentReportingView({
  incidentReports,
  candidates,
  onSubmitIncident
}: IncidentReportingViewProps) {
  const [incidentType, setIncidentType] = useState<IncidentReport["incidentType"]>("Impersonation");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Hall 101");
  const [personnelInvolved, setPersonnelInvolved] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [evidenceAttached, setEvidenceAttached] = useState("");
  const [severity, setSeverity] = useState<IncidentReport["severity"]>("Warning");
  
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitIncident({
      incidentType,
      description,
      location,
      personnelInvolved,
      candidateId: candidateId || undefined,
      evidenceAttached: evidenceAttached || "LOCAL_RECON_CAPTURE.png",
      status: "Pending Investigation",
      severity
    });

    // Reset Form
    setDescription("");
    setPersonnelInvolved("");
    setCandidateId("");
    setEvidenceAttached("");
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Information Header Block */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            EXAMINATION INCIDENT REPORTING SYSTEM
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Filing an incident generates an immediate audit log on national NTA servers. All fields require deliberate verification of details under penalty of procedural disqualification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Official Government Issue Reporting Form (Col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-205 rounded-sm">
          <div className="border-b border-slate-205 bg-slate-50 px-4 py-2.5">
            <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
              SUBMIT SECURED INCIDENT DOSSIER
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">INCIDENT CLASSIFICATION</label>
                <select
                  id="incident-form-type"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as IncidentReport["incidentType"])}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-mono"
                >
                  <option value="Impersonation">Impersonation Check</option>
                  <option value="Device Detection">RF / Electronic Device</option>
                  <option value="Cheating / Sheet Exchange">Candidate Compromise</option>
                  <option value="Paper Distribution Delay">Distribution Issue</option>
                  <option value="Staff Misconduct">Staff Misconduct</option>
                  <option value="Other Technical Issue">Other Technical Anomalies</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">SEVERITY PROTOCOL</label>
                <select
                  id="incident-form-severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentReport["severity"])}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-mono font-semibold"
                >
                  <option value="Low">Low Compliance Concern</option>
                  <option value="Warning">Warning Level Anomalies</option>
                  <option value="Critical">Critical Breach Outbreak</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] font-bold text-slate-700">DETAILED VERB DESCRIPTION OF EVENT</label>
              <textarea
                id="incident-form-description"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Submit exact details: Candidate rolls, seat number, precise timeframe, observations, and initial containment actions taken."
                className="bg-white border border-slate-305 p-2 text-xs font-sans rounded-sm text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">LOCATION OF INCIDENT</label>
                <input
                  id="incident-form-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hall 101 Desk C"
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">PERSONNEL RESPONDING / WITNESSES</label>
                <input
                  id="incident-form-personnel"
                  type="text"
                  required
                  value={personnelInvolved}
                  onChange={(e) => setPersonnelInvolved(e.target.value)}
                  placeholder="Involving staff names & IDs"
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">LINK TO CANDIDATE ROLL (OPTIONAL)</label>
                <select
                  id="incident-form-candidate"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-850 rounded-sm font-mono"
                >
                  <option value="">-- No specific Candidate linked --</option>
                  {candidates.map(cand => (
                    <option key={cand.id} value={cand.id}>
                      {cand.name} ({cand.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">PHYSICAL LOG EVIDENCE ATTACHMENT</label>
                <input
                  id="incident-form-evidence"
                  type="text"
                  value={evidenceAttached}
                  onChange={(e) => setEvidenceAttached(e.target.value)}
                  placeholder="e.g. PHOTO_CAPTURE_0842.JPG"
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs rounded-sm font-mono"
                />
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs font-bold rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>DOSSIER COMMITTED SUCCESS TO SECURE ARCHIVE BUFFER.</span>
              </div>
            )}

            <div className="pt-2">
              <button
                id="btn-submit-incident"
                type="submit"
                className="w-full bg-[#991B1B] hover:bg-red-800 text-white font-mono font-bold py-2 px-4 rounded-sm border border-red-750 flex items-center justify-center gap-1 uppercase transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                COMMIT REPORT AND SYNC DEPOSITORIES
              </button>
            </div>
          </form>
        </div>

        {/* Right Hand: Structured Active Dossier List (Col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
              SUBMITTED EXAM COMPLIANCE DOSSIERS ({incidentReports.length})
            </span>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[520px]">
            {incidentReports.map(report => {
              const isCritical = report.severity === "Critical";
              const isWarning = report.severity === "Warning";
              
              return (
                <div key={report.id} className={`border rounded-sm ${
                  isCritical ? "border-red-300 bg-red-50/40" : "border-slate-250 bg-slate-50/40"
                }`}>
                  <div className={`p-2.5 font-mono text-xs flex justify-between items-center ${
                    isCritical ? "bg-red-900 text-slate-100" : "bg-slate-800 text-slate-200"
                  }`}>
                    <span className="font-bold uppercase tracking-wider">{report.incidentType}</span>
                    <span className="bg-slate-950 px-2 py-0.2 rounded text-[9px] font-bold">
                      ID: {report.id}
                    </span>
                  </div>

                  <div className="p-3 space-y-2.5 text-xs">
                    <p className="text-slate-800 font-sans leading-relaxed text-[11px]">{report.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-2 border-t border-dashed border-slate-200 font-mono text-[10px] text-slate-600">
                      <div>
                        <strong>LOCATION:</strong><br />
                        <span className="font-sans text-slate-800">{report.location}</span>
                      </div>
                      <div>
                        <strong>RESPONDER:</strong><br />
                        <span className="font-sans text-slate-800">{report.personnelInvolved}</span>
                      </div>
                      <div>
                        <strong>EVIDENCE LOG:</strong><br />
                        <span className="text-slate-800 select-all">{report.evidenceAttached}</span>
                      </div>
                      <div>
                        <strong>TIMESTAMP:</strong><br />
                        <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div>
                        <strong>SEVERITY PROTOCOL:</strong><br />
                        <span className={`font-bold ${isCritical ? "text-red-800" : isWarning ? "text-amber-800" : "text-slate-600"}`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <strong>DOSSIER STATUS:</strong><br />
                        <span className="text-blue-800 font-bold uppercase">{report.status}</span>
                      </div>
                    </div>
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
