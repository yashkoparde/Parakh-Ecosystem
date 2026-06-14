/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PaperRelease, CenterStaff, ExamSession } from "../types";
import { Key, ShieldCheck, Check, AlertTriangle, Printer, FileDown, Lock, Eye, EyeOff } from "lucide-react";

interface PaperReleaseViewProps {
  paperReleases: PaperRelease[];
  staff: CenterStaff[];
  sessions: ExamSession[];
  onAuthorizeRelease: (releaseId: string, officerRole: "Chief" | "Observer") => void;
  onFinalDecryptRelease: (releaseId: string, securePin: string) => void;
  onInitiatePrintBatch: (releaseId: string, printerIp: string, copies: number) => void;
  activityLogsCount: number;
}

export default function PaperReleaseView({
  paperReleases,
  staff,
  sessions,
  onAuthorizeRelease,
  onFinalDecryptRelease,
  onInitiatePrintBatch,
  activityLogsCount
}: PaperReleaseViewProps) {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(paperReleases[1]?.id || paperReleases[0]?.id || "");
  const [securePin, setSecurePin] = useState<string>("");
  const [pinVisible, setPinVisible] = useState<boolean>(false);
  const [manualPinError, setManualPinError] = useState<string>("");
  const [printerIp, setPrinterIp] = useState<string>("10.12.89.51");
  const [printCopies, setPrintCopies] = useState<number>(240);
  const [isConfirmingRelease, setIsConfirmingRelease] = useState<boolean>(false);

  const activeRelease = paperReleases.find(p => p.id === selectedReleaseId);

  // Officers biometrically verified present
  const chiefOfficerObj = staff.find(s => s.role === "Chief Superintendent");
  const observerOfficerObj = staff.find(s => s.role === "Observer (NTA/Central)");

  const handleDualAuthorize = (role: "Chief" | "Observer") => {
    if (!activeRelease) return;
    onAuthorizeRelease(activeRelease.id, role);
    setManualPinError("");
  };

  const handleDecryptHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRelease) return;
    if (activeRelease.approvedBy?.length !== 2) {
      setManualPinError("Dual Officer Authorization is strictly required prior to decrypting cryptographic headers.");
      return;
    }
    if (securePin !== "9042-AUTH") {
      setManualPinError("CRYPTOGRAPHIC ERROR: Secure Decryption Key PIN rejected. Input '9042-AUTH' as temporary testing token.");
      return;
    }
    onFinalDecryptRelease(activeRelease.id, securePin);
    setSecurePin("");
    setManualPinError("");
    setIsConfirmingRelease(false);
  };

  const handleCreatePrintBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRelease || activeRelease.status !== "Released") return;
    onInitiatePrintBatch(activeRelease.id, printerIp, printCopies);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Context Panel */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            SECURE EXAM PAPER DECRYPTION CONSOLE
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            This module decrypts the secure examination syllabus payload. Dual physical identity tokens are decrypted locally; no key is transmitted in plaintext outside NIC VPN boundaries.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] uppercase font-mono px-2 py-1 font-semibold rounded-xs">
            NIC Tunnel Active
          </span>
          <span className="bg-slate-200 border border-slate-300 text-slate-700 text-[10px] uppercase font-mono px-2 py-1 font-semibold rounded-xs">
            TLS v1.3 Lock
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Release Grid Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2.5">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                SELECT EXAM PAPER INDEX
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {paperReleases.map(paper => {
                const isSelected = paper.id === selectedReleaseId;
                return (
                  <button
                    key={paper.id}
                    id={`select-paper-${paper.id}`}
                    onClick={() => {
                      setSelectedReleaseId(paper.id);
                      setManualPinError("");
                      setIsConfirmingRelease(false);
                    }}
                    className={`w-full text-left p-3 text-xs block transition-colors ${
                      isSelected ? "bg-slate-50 border-l-4 border-slate-800" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">{paper.id} </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        paper.status === "Released" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                        paper.status === "Ready" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        "bg-slate-100 text-slate-600 border border-slate-300"
                      }`}>
                        {paper.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 mt-1 font-sans">{paper.subject}</div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{paper.examName}</div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Release Ref: {paper.releaseTime} HRS</span>
                      <span>Auth: {paper.approvedBy?.length || 0}/2 Checked</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 space-y-2 rounded-sm text-xs font-mono">
            <span className="text-[10px] text-slate-500 font-bold block">SECURE OPERATIONAL NOTICE</span>
            <p className="text-[11px] leading-relaxed text-slate-600 font-sans">
              Decryption triggers immediate hardware integrity reporting. Once released, the paper must be printed, certified by the observer physically, and immediate logs compiled.
            </p>
          </div>
        </div>

        {/* Center/Right Screen: Main Secured Decryption Action Space */}
        <div className="lg:col-span-2 space-y-6">
          {activeRelease ? (
            <div className="bg-white border border-slate-200 rounded-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                  DECRYPTION AND DE-ESCROW SCREEN
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">RELEASING: {activeRelease.id}</span>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Paper Status Card */}
                <div className="border border-slate-200 p-4 bg-slate-50 hover:bg-slate-50/70 rounded-sm space-y-3 font-mono">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-450 block">SUBJECT LINE</span>
                      <span className="text-sm font-bold text-slate-800 font-sans">{activeRelease.subject}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeRelease.status === "Released" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-200 text-slate-700"
                    }`}>
                      {activeRelease.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-500 block">RELEASE WINDOW</span>
                      <span className="text-slate-900 font-bold">{activeRelease.releaseTime} AM</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">EST. CANDIDATES</span>
                      <span className="text-slate-900 font-bold">240 Active</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">EST. ROOMS</span>
                      <span className="text-slate-900 font-bold">Hall 101, 102</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ENCRYPTION ENGINE</span>
                      <span className="text-amber-800 font-bold">AES-GCM (NTA SHA)</span>
                    </div>
                  </div>
                </div>

                {/* Section A: Dual Authorization Step */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <span className="bg-slate-800 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]">1</span>
                    DUAL PHYSICAL IDENTIFICATION VERIFICATION
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Officer: Chief Superintendent */}
                    <div className="border border-slate-200 p-3.5 space-y-3 bg-slate-50 rounded-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">CHIEF SUPERINTENDENT TOKEN</span>
                        {activeRelease.approvedBy?.includes("Chief Superintendent DR-01") ? (
                          <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> SECURED
                          </span>
                        ) : (
                          <span className="text-amber-700 font-mono font-bold">MISSING AUTH</span>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-[10px] text-slate-500 font-sans flex-1">
                          Officer: <span className="font-semibold text-slate-800">{chiefOfficerObj?.name || "Dr. Rameshwar"}</span>
                          <span className="block italic">Biometric Token Hash: BIO-CHIEF-01</span>
                        </div>
                        {!activeRelease.approvedBy?.includes("Chief Superintendent DR-01") && activeRelease.status !== "Released" && (
                          <button
                            id="auth-officer-chief"
                            onClick={() => handleDualAuthorize("Chief")}
                            className="bg-[#1E293B] text-slate-100 hover:bg-slate-800 px-3 py-1 text-xs rounded-sm font-mono tracking-wider transition-colors"
                          >
                            BIOMETRIC BYPASS
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Second Officer: Central Observer */}
                    <div className="border border-slate-200 p-3.5 space-y-3 bg-slate-50 rounded-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">NTA CENTRAL OBSERVER TOKEN</span>
                        {activeRelease.approvedBy?.includes("NTA Observer AS-02") ? (
                          <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> SECURED
                          </span>
                        ) : (
                          <span className="text-amber-700 font-mono font-bold">MISSING AUTH</span>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="text-[10px] text-slate-500 font-sans flex-1">
                          Officer: <span className="font-semibold text-slate-800">{observerOfficerObj?.name || "Prof. Animesh Sen"}</span>
                          <span className="block italic">Biometric Token Hash: BIO-OBS-02</span>
                        </div>
                        {!activeRelease.approvedBy?.includes("NTA Observer AS-02") && activeRelease.status !== "Released" && (
                          <button
                            id="auth-officer-observer"
                            onClick={() => handleDualAuthorize("Observer")}
                            className="bg-[#1E293B] text-slate-100 hover:bg-slate-800 px-3 py-1 text-xs rounded-sm font-mono tracking-wider transition-colors"
                          >
                            BIOMETRIC BYPASS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Cryptographic Handshake and PIN verification */}
                {activeRelease.status !== "Released" ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <span className="bg-slate-800 text-white w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]">2</span>
                      SECURE TERMINAL DE-ESCROW HANDSHAKE
                    </h4>

                    {activeRelease.approvedBy?.length !== 2 ? (
                      <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono text-slate-500 text-center rounded-sm">
                        ⚠️ Dual physical identification required to unlock cryptographic terminal handshake input.
                      </div>
                    ) : (
                      <form onSubmit={handleDecryptHandshake} className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700 font-mono flex items-center gap-1">
                            ENTER SECURE PAYLOAD DESCRPTION KEY PIN
                            <span className="text-[10px] font-normal text-slate-400 font-sans">(Input '9042-AUTH' for testing payload)</span>
                          </label>
                          <div className="relative flex">
                            <input
                              id="release-secure-pin"
                              type={pinVisible ? "text" : "password"}
                              value={securePin}
                              onChange={(e) => setSecurePin(e.target.value)}
                              placeholder="••••-••••"
                              required
                              className="bg-white border border-slate-350 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-mono w-full"
                            />
                            <button
                              id="toggle-pin-visibility"
                              type="button"
                              onClick={() => setPinVisible(!pinVisible)}
                              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                            >
                              {pinVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {manualPinError && (
                          <div className="text-xs font-mono text-red-800 font-bold p-2 bg-red-50 border border-red-250 rounded">
                            {manualPinError}
                          </div>
                        )}

                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            id="trigger-handshake"
                            type="submit"
                            className="bg-[#166534] text-white hover:bg-[#12532a] font-mono px-4 py-1.5 rounded-sm font-bold tracking-wider"
                          >
                            EXECUTE DECRYPTION HANDSHAKE
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  // Released state! Shows secure key & allows printing batch initiation
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs space-y-1.5 font-mono">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        DECRYPTED SUCCESS - CRICUT DE-ESCROW COMPLETE
                      </div>
                      <div className="text-emerald-800 mt-2">
                        SECURE PAYLOAD ACCESS KEY: <span className="font-bold bg-white px-2 py-0.5 border border-emerald-350 text-slate-900 rounded select-all">{activeRelease.secureDownloadKey}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                        HANDSHAKE CODES: {activeRelease.approvedBy?.join(" 🡘 ")} (Handshake completed at {activeRelease.releaseTime} AM). Micro-dots watermarking successfully injected into print server pipeline.
                      </p>
                    </div>

                    {/* Section C: Initiate Print Batch Form */}
                    <div className="border border-slate-200 rounded-sm bg-slate-50/50">
                      <div className="border-b border-slate-250 px-4 py-2 bg-slate-100">
                        <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider">
                          START PRINT BATCH FOR HIGH-OUTPUT PRINTERS
                        </span>
                      </div>
                      
                      <form onSubmit={handleCreatePrintBatchSubmit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-700 font-bold">ROUTE TO PRINTER SYSTEM IP</label>
                          <select
                            id="select-printer-ip"
                            value={printerIp}
                            onChange={(e) => setPrinterIp(e.target.value)}
                            className="bg-white border border-slate-350 px-2 py-1.5 rounded-sm"
                          >
                            <option value="10.12.89.51">PRINTER-01 (10.12.89.51) H-OUT</option>
                            <option value="10.12.89.52">PRINTER-02 (10.12.89.52) H-OUT</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-700 font-bold">VOLUME QUANTITY (COPIES)</label>
                          <input
                            id="print-copies-qty"
                            type="number"
                            min="10"
                            max="500"
                            value={printCopies}
                            onChange={(e) => setPrintCopies(parseInt(e.target.value) || 240)}
                            className="bg-white border border-slate-350 px-2 py-1.5 rounded-sm"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <button
                            id="trigger-print-batch"
                            type="submit"
                            className="w-full bg-[#1E293B] text-white hover:bg-slate-800 font-bold font-mono py-1.5 px-3 rounded-sm border border-slate-700 hover:border-slate-800 flex items-center justify-center gap-1.5 uppercase transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            SPAWN DIRECT PRINTING
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              NO ACTIONABLE PAPER AVAILABLE OR DETECTED.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
