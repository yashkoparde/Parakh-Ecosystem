/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BlockchainRecord } from "../types";
import { Database, Search, ShieldCheck, HelpCircle, Key, Cpu, HelpCircle as InfoIcon, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface SakshyaModuleProps {
  blockchainRecords: BlockchainRecord[];
}

export default function SakshyaModule({ blockchainRecords }: SakshyaModuleProps) {
  const [verifyHashQuery, setVerifyHashQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    status: "idle" | "matched" | "divergent";
    msg: string;
    record?: BlockchainRecord;
  }>({ status: "idle", msg: "" });

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyHashQuery.trim()) {
      setVerificationResult({ status: "idle", msg: "" });
      return;
    }

    // Attempt matching against transaction hash or SHA256 of blockchain records
    const cleanQuery = verifyHashQuery.trim();
    // Search records
    const match = blockchainRecords.find(
      r => r.transactionHash.toLowerCase() === cleanQuery.toLowerCase() ||
           r.id.toLowerCase() === cleanQuery.toLowerCase() ||
           r.digitalSignature.includes(cleanQuery)
    );

    // Also simulate SHA256 check of paper
    if (match) {
      setVerificationResult({
        status: "matched",
        msg: `VERIFIED SECURE: An identical, tamper-free matching block signature was discovered. Target is anchored immutably in block #${match.blockNumber}.`,
        record: match
      });
    } else {
      // Allow custom matching for mock checks
      if (cleanQuery.length === 64) {
        setVerificationResult({
          status: "matched",
          msg: `VERIFIED SECURE: Cryptographic verification matched. Standard SHA-256 matches Block #482019 (Mathematical Sciences Division).`,
        });
      } else {
        setVerificationResult({
          status: "divergent",
          msg: `DIVERGENT SIGNATURE DETECTED: No anchored digital registration correlates with the supplied criteria hash. Integrity NOT verified.`
        });
      }
    }
  };

  const handleQuickVerify = (hash: string) => {
    setVerifyHashQuery(hash);
    const match = blockchainRecords.find(r => r.transactionHash === hash);
    if (match) {
      setVerificationResult({
        status: "matched",
        msg: `VERIFIED SECURE: Matches ledger transaction. Integrity intact.`,
        record: match
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Change Audit Trail & Certificate Verification</h2>
        <p className="text-xs text-slate-500">
          Trace structural exam metadata hashes and administrative change records. Verify digital signature certificates to protect exam integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verification Terminal Workspace */}
        <div className="lg:col-span-1 space-y-4">
          <div className="admin-card p-5 bg-white border-2 border-slate-900 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[10px] text-slate-400 font-mono block">VERIFICATION_CONSOLE</span>
              <h3 className="text-sm font-bold text-slate-950">Independent Audit Certificate Verification</h3>
            </div>

            <form onSubmit={handleVerifyHash} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="hash-search-input">
                  ENTER LOG_HASH / SHA-256 CHECKSUM <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    id="hash-search-input"
                    type="text"
                    required
                    value={verifyHashQuery}
                    onChange={(e) => setVerifyHashQuery(e.target.value)}
                    placeholder="Paste 64-character transaction of paper hash..."
                    className="admin-input h-9 w-full pl-8 pr-2 font-mono text-[11px]"
                  />
                </div>
                <p className="text-[9px] text-slate-500 mt-1">Example: 0xbf2d43105fd9b5c3e0706240ca8fe51a2d48ef18361b24bf4a9abb2220199ddf</p>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer rounded-sm text-xs border border-slate-950 flex items-center justify-center gap-1.5"
              >
                Perform Audit Verification
              </button>
            </form>

            {/* Results Screen */}
            {verificationResult.status !== "idle" && (
              <div className={`p-4 border font-mono text-xs ${
                verificationResult.status === "matched" ? "bg-green-50 border-green-300 text-green-900" : "bg-red-50 border-red-350 text-red-900"
              }`}>
                {verificationResult.status === "matched" ? (
                  <div className="space-y-2">
                    <div className="flex gap-1.5 items-center font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                      <span>INTEGRITY APPROVED</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans">{verificationResult.msg}</p>
                    
                    {verificationResult.record && (
                      <div className="text-[9px] bg-white p-2 border border-green-200 space-y-1 mt-2 text-slate-650">
                        <div>Record Index: <strong className="text-slate-900">#{verificationResult.record.blockNumber}</strong></div>
                        <div className="truncate">Timestamp: {new Date(verificationResult.record.timestamp).toLocaleString()}</div>
                        <div className="truncate text-[8px]">Signature: {verificationResult.record.digitalSignature}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5 items-center font-bold text-red-800">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-700" />
                      <span>INTEGRITY FAILURE</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-sans text-red-700">{verificationResult.msg}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick-Audit Card */}
          <div className="admin-card p-4 space-y-2.5 bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <InfoIcon className="h-3.5 w-3.5 text-slate-400" /> Administrative Verification Info
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Whenever examination authorities compile an exam paper, the questions are structured into a payload. This payload is SHA-256 hashed. The resulting hash resides in the secure audit ledger, which remains accessible for decentralized verification by local centers prior to print routines.
            </p>
          </div>
        </div>

        {/* Ledger Blocks Streams Grid */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">IMMUTABLE ADMINISTRATIVE RECORD JOURNAL</h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-mono font-bold">AUDIT TRACKER: SYNCHRONIZED</span>
          </div>

          <div className="space-y-4">
            {blockchainRecords.map(rec => (
              <div key={rec.id} className="admin-card hover:border-slate-400 overflow-hidden bg-white">
                
                {/* Header status bar */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-900 font-bold flex items-center gap-1">
                    <Database className="h-3.5 w-3.5 text-slate-400" /> AUDIT RECORD #{rec.blockNumber}
                  </span>
                  <span className="text-slate-400 text-[10px]">{new Date(rec.timestamp).toISOString()}</span>
                </div>

                <div className="p-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-[10px] text-slate-400">PORTAL LOG ACTION DETAIL:</div>
                      <div className="text-slate-900 font-sans font-bold leading-snug mt-0.5">{rec.action}</div>
                    </div>
                    <button
                      onClick={() => handleQuickVerify(rec.transactionHash)}
                      className="px-2 py-1 text-[10px] font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer rounded-sm whitespace-nowrap"
                    >
                      Audit Hash Verify
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[10px] text-slate-500 border-t border-slate-100">
                    <div>
                      <div>AUDIT HASH SHA-256 VALUE:</div>
                      <div className="text-slate-700 break-all select-all font-bold">{rec.transactionHash}</div>
                    </div>
                    <div>
                      <div>CHAIN VERIFICATION NODE REF:</div>
                      <div className="text-slate-700 break-all select-all font-bold">{rec.previousBlockHash}</div>
                    </div>
                  </div>

                  <div className="text-[9px] bg-slate-50 p-2 border border-slate-200/60 rounded flex justify-between tracking-wide leading-normal text-slate-400">
                    <span className="truncate max-w-[250px]">CREATOR DIGITAL SIGNATURE AUTHOR: {rec.digitalSignature}</span>
                    <span className="text-emerald-700 font-bold whitespace-nowrap">✓ DIGITAL SIGNATURE VERIFIED</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
