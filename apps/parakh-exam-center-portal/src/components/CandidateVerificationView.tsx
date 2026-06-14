/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Candidate, ExamSession } from "../types";
import { UserCheck, ShieldAlert, CheckCircle, XCircle, AlertOctagon, HelpCircle, Search, Filter, ShieldCheck, Fingerprint, RefreshCcw } from "lucide-react";

interface CandidateVerificationViewProps {
  candidates: Candidate[];
  sessions: ExamSession[];
  onVerifyCandidate: (candidateId: string, status: Candidate["verificationStatus"], method?: Candidate["verificationMethod"], score?: number, remarks?: string) => void;
}

export default function CandidateVerificationView({
  candidates,
  sessions,
  onVerifyCandidate
}: CandidateVerificationViewProps) {
  const [selectedCandId, setSelectedCandId] = useState<string>(candidates.find(c => c.verificationStatus === "Pending")?.id || candidates[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);
  const [overrideRemarks, setOverrideRemarks] = useState<string>("");

  const activeCandidate = candidates.find(c => c.id === selectedCandId);

  // Filtered array
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.rollNo.includes(searchQuery) ||
                          cand.seatNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || cand.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const triggerScanSimulate = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
    }, 1500);
  };

  const handleApplyVerification = (status: Candidate["verificationStatus"], method: Candidate["verificationMethod"]) => {
    if (!activeCandidate) return;
    const score = status === "Verified" ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 20) + 15;
    const remarksText = overrideRemarks || (status === "Verified" 
      ? `Authenticated successfully via ${method}. Dual hash accepted.` 
      : `Manual override triggered. Flagged status: ${status}. Remarks recorded.`);
    
    onVerifyCandidate(activeCandidate.id, status, method, score, remarksText);
    setOverrideRemarks("");
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary Cards for Verifications */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-white border border-slate-200 p-2 text-center rounded-sm">
          <span className="text-[9px] text-slate-500 block">TOTAL CENTER ROSTER</span>
          <span className="text-sm font-bold text-slate-800">{candidates.length}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-2 text-center rounded-sm">
          <span className="text-[9px] text-emerald-700 block">TOTAL VERIFIED</span>
          <span className="text-sm font-bold text-emerald-800">{candidates.filter(c => c.verificationStatus === "Verified").length}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-2 text-center rounded-sm">
          <span className="text-[9px] text-amber-700 block">AWAITING REVIEW</span>
          <span className="text-sm font-bold text-amber-800">{candidates.filter(c => c.verificationStatus === "Pending").length}</span>
        </div>
        <div className="bg-red-50 border border-red-200 p-2 text-center rounded-sm">
          <span className="text-[9px] text-red-700 block">DUPLICATES & REJECTS</span>
          <span className="text-sm font-bold text-red-800">
            {candidates.filter(c => c.verificationStatus === "Rejected" || c.verificationStatus === "Duplicate").length}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2 text-center rounded-sm">
          <span className="text-[9px] text-slate-500 block">ABSENT CANDIDATES</span>
          <span className="text-sm font-bold text-slate-850">{candidates.filter(c => c.verificationStatus === "Absent").length}</span>
        </div>
      </div>

      {/* Primary Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (Col-span-5): Search, Filters, and Candidate Selection Tree */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-sm flex flex-col h-[580px]">
          
          {/* Filters Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="search-candidates-input"
                type="text"
                placeholder="Search Candidate Roll, Name, Seat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-sm pl-8 pr-3 py-1.5 text-xs text-slate-800 font-sans focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">STATUS FILTER:</span>
              <div className="flex flex-wrap gap-1 font-mono">
                {["All", "Pending", "Verified", "Rejected", "Duplicate", "Absent"].map(f => (
                  <button
                    key={f}
                    id={`filter-status-${f}`}
                    onClick={() => setStatusFilter(f)}
                    className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold tracking-tight transition-colors ${
                      statusFilter === f 
                        ? "bg-slate-800 text-white border border-slate-800" 
                        : "bg-white border border-slate-200 hover:bg-slate-100/50 text-slate-600"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roster list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">
                ⊘ NO MATCHES FOUND FOR TARGET CRITERIA.
              </div>
            ) : (
              filteredCandidates.map(cand => {
                const isSelected = cand.id === selectedCandId;
                return (
                  <button
                    key={cand.id}
                    id={`select-cand-${cand.id}`}
                    onClick={() => {
                      setSelectedCandId(cand.id);
                      setOverrideRemarks("");
                    }}
                    className={`w-full text-left p-3 flex justify-between items-center transition-colors ${
                      isSelected ? "bg-slate-50 border-r-4 border-[#0F172A]" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-xs font-sans">{cand.name}</div>
                      <div className="text-[10px] text-slate-550 font-mono mt-0.5">
                        ROLL: {cand.rollNo} • Seat: {cand.seatNumber}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold font-mono border ${
                        cand.verificationStatus === "Verified" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                        cand.verificationStatus === "Pending" ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse" :
                        cand.verificationStatus === "Rejected" ? "bg-red-150 text-red-800 border-red-300" :
                        cand.verificationStatus === "Duplicate" ? "bg-purple-100 text-purple-800 border-purple-300" :
                        "bg-slate-100 text-slate-600 border border-slate-300"
                      }`}>
                        {cand.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side (Col-span-7): Primary Live Verification Workspace Panel */}
        <div className="lg:col-span-7">
          {activeCandidate ? (
            <div className="bg-white border border-slate-200 rounded-sm h-[580px] flex flex-col">
              
              {/* Card Title */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
                    BIOMETRIC IDENTITY ACQUISITION STATION
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Compare candidate biometrics against physical identity card, NTA roster profile, and Aadhaar database records.
                  </p>
                </div>
                <span className="text-[11px] text-slate-700 font-mono font-semibold">UNIT: ID-STN-B</span>
              </div>

              {/* Roster Information Panel */}
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                
                {/* Candidate Information Header Detail Card */}
                <div className="flex flex-col md:flex-row gap-4 items-start pb-4 border-b border-slate-100">
                  
                  {/* Photo Placeholder */}
                  <div className="w-24 h-24 bg-slate-100 border border-slate-300 flex flex-col justify-center items-center rounded-sm font-mono text-center text-slate-400 p-2 text-[9px] select-none uppercase shrink-0">
                    <UserCheck className="w-8 h-8 text-slate-400 mb-1" />
                    <span>PHOTO PREVIEW</span>
                    <span className="text-[8px] text-slate-500 font-mono border border-slate-200 bg-white px-1 mt-1 rounded whitespace-nowrap">
                      {activeCandidate.rollNo}
                    </span>
                  </div>

                  {/* Text properties */}
                  <div className="space-y-1.5 flex-1 font-sans">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{activeCandidate.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">STATION ID: {activeCandidate.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        activeCandidate.verificationStatus === "Verified" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                        activeCandidate.verificationStatus === "Pending" ? "bg-amber-100 text-amber-800 border-amber-300" :
                        activeCandidate.verificationStatus === "Rejected" ? "bg-red-100 text-red-00 border-red-300" :
                        activeCandidate.verificationStatus === "Duplicate" ? "bg-purple-100 text-purple-850 border-purple-300" :
                        "bg-slate-200 text-slate-700 border border-slate-300"
                      }`}>
                        {activeCandidate.verificationStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px] text-slate-600">
                      <div><strong className="text-slate-800">ROLL NUMBER:</strong> {activeCandidate.rollNo}</div>
                      <div><strong className="text-slate-800">SEAT ASSIGNED:</strong> {activeCandidate.seatNumber}</div>
                      <div><strong className="text-slate-800">SUBJECT KEY:</strong> Mathematics - DL7</div>
                      <div><strong className="text-slate-800">EXAM DATE:</strong> 12-JUN-2026</div>
                    </div>
                  </div>
                </div>

                {/* Biometric acquisition live stream simulator */}
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 tracking-wider">SECURED COMPLIANCE BIOMETRICS CHECK</span>
                    <button
                      id="simulate-biometric-scan"
                      type="button"
                      onClick={triggerScanSimulate}
                      disabled={biometricScanning}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-755 border border-slate-300 text-[10px] px-2 py-1 rounded-sm font-bold flex items-center gap-1 uppercase transition-colors"
                    >
                      <Fingerprint className={`w-3.5 h-3.5 ${biometricScanning ? "animate-pulse text-amber-600" : "text-slate-650"}`} />
                      {biometricScanning ? "ACQUIRING..." : "RE-SCAN BIOMETRIC"}
                    </button>
                  </div>

                  {biometricScanning ? (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-300 text-center rounded-sm space-y-2">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-600 border-t-transparent"></div>
                      <div className="text-xs text-slate-650 font-bold">CONTACTING SECURE IDENTITY DATABASE... ESTABLISHING CONNECTION...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-[10px] text-slate-500 block">THUMBPRINT</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className={`${activeCandidate.biometricScore && activeCandidate.biometricScore > 80 ? "text-emerald-700" : "text-amber-700"} font-bold`}>
                            {activeCandidate.biometricScore ? `${activeCandidate.biometricScore}% MATCH` : "NOT SCANNED"}
                          </span>
                          <span className="text-[9px] text-slate-400">FPS-900</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-[10px] text-slate-500 block">RETINAL PROFILE</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-slate-650 font-bold">
                            {activeCandidate.verificationStatus === "Verified" ? "99.2% SECURED" : "PENDING DETECT"}
                          </span>
                          <span className="text-[9px] text-slate-400">RET-44</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-[10px] text-slate-500 block">AADHAAR BIOPASS</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className={`${activeCandidate.verificationStatus === "Verified" ? "text-emerald-700" : "text-slate-600"} font-bold`}>
                            {activeCandidate.verificationStatus === "Verified" ? "VERIFIED v3" : "NOT ATTEMPTED"}
                          </span>
                          <span className="text-[9px] text-slate-400">UIDAI HOST</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCandidate.remarks && (
                    <div className="text-[11px] text-slate-650 bg-slate-50 p-2.5 rounded border border-slate-200 leading-normal">
                      <strong>DIAGNOSTIC ARCHIVE LOG:</strong> {activeCandidate.remarks}
                    </div>
                  )}
                </div>

                {/* Verification Decisions Area */}
                {activeCandidate.verificationStatus === "Pending" && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 font-mono">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">ADDITIONAL LOG REMARKS OR REASON FOR OVERRIDE</label>
                      <input
                        id="verification-remarks-override"
                        type="text"
                        placeholder="e.g. Identity matches aadhaar photo. Manual confirmation."
                        value={overrideRemarks}
                        onChange={(e) => setOverrideRemarks(e.target.value)}
                        className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-sans"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        id="btn-verify-success"
                        onClick={() => handleApplyVerification("Verified", "Biometric (Thumbprint)")}
                        className="bg-[#166534] text-white hover:bg-emerald-800 font-bold px-3 py-1.5 rounded-sm flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> VERIFY (THUMB MATCH)
                      </button>

                      <button
                        id="btn-verify-aadhaar-manual"
                        onClick={() => handleApplyVerification("Verified", "Aadhaar e-KYC")}
                        className="bg-blue-800 text-white hover:bg-blue-900 font-bold px-3 py-1.5 rounded-sm flex items-center gap-1"
                      >
                        <ShieldCheck className="w-4 h-4" /> MANUAL AADHAAR OVERRIDE
                      </button>

                      <button
                        id="btn-verify-reject"
                        onClick={() => handleApplyVerification("Rejected", "Manual Override")}
                        className="bg-[#991B1B] text-white hover:bg-red-800 font-bold px-3 py-1.5 rounded-sm flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> REJECT CODES
                      </button>

                      <button
                        id="btn-verify-duplicate"
                        onClick={() => handleApplyVerification("Duplicate", "Manual Override")}
                        className="bg-purple-800 text-white hover:bg-purple-900 font-bold px-3 py-1.5 rounded-sm flex items-center gap-1"
                      >
                        <AlertOctagon className="w-4 h-4" /> REJECT DUPLICATE ID
                      </button>

                      <button
                        id="btn-verify-absent"
                        onClick={() => handleApplyVerification("Absent", "Manual Override")}
                        className="bg-slate-600 text-white hover:bg-slate-700 font-bold px-3 py-1.5 rounded-sm"
                      >
                        ABSENT
                      </button>
                    </div>
                  </div>
                )}

                {activeCandidate.verificationStatus !== "Pending" && (
                  <div className="pt-4 border-t border-slate-150 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">IDENTITY DECISION PRE-LOCKED BY SECTOR STATION INCIDENT #472.</span>
                    <button
                      id="reset-candidate-state"
                      onClick={() => onVerifyCandidate(activeCandidate.id, "Pending")}
                      className="text-slate-700 hover:underline text-[10px] font-bold font-mono"
                    >
                      (RESET TO PENDING FOR AUDITING)
                    </button>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs border border-slate-200 bg-white">
              ✓ ROSTER COMPLETED. NO SELECTED CANDIDATE LOG FOUND.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
