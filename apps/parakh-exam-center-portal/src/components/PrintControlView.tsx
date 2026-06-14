/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PrintBatch, PaperRelease } from "../types";
import { Printer, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play, HelpCircle, HardDrive } from "lucide-react";

interface PrintControlViewProps {
  printBatches: PrintBatch[];
  paperReleases: PaperRelease[];
  onAddPrinterLog: (batchId: string, printedCount: number) => void;
  onUpdateBatchStatus: (batchId: string, status: "Scheduled" | "Printing" | "Completed" | "Warning" | "Critical") => void;
}

export default function PrintControlView({
  printBatches,
  paperReleases,
  onAddPrinterLog,
  onUpdateBatchStatus
}: PrintControlViewProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(printBatches[0]?.id || "");
  const selectedBatch = printBatches.find(b => b.id === selectedBatchId);

  const handleSimulateCycle = (batchId: string) => {
    const batch = printBatches.find(b => b.id === batchId);
    if (!batch) return;
    if (batch.printed >= batch.totalRequired) {
      onUpdateBatchStatus(batchId, "Completed");
      return;
    }

    // Advance printed count by 40 copies
    const newPrinted = Math.min(batch.totalRequired, batch.printed + 40);
    onAddPrinterLog(batchId, newPrinted);
    
    if (newPrinted === batch.totalRequired) {
      onUpdateBatchStatus(batchId, "Completed");
    } else {
      onUpdateBatchStatus(batchId, "Printing");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Information Header */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            SECURE HIGH-OUTPUT PRINT CONTROL MODULE
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Secure local duplex copying units are equipped with physical tray locking devices. Operation is restricted to authorised biometric-verified IT operators under video feed monitoring.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#1E293B] text-slate-100 border border-slate-700 text-[10px] uppercase font-mono px-2 py-1 font-semibold rounded-xs">
            Custody Vault Level: LOCK
          </span>
        </div>
      </div>

      {/* Main Print Console Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Printed Queue and Printer Status */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Hardware List Status */}
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                SECURED HARDWARE STATIONS
              </span>
            </div>
            <div className="p-3 space-y-3 font-mono text-xs">
              
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold flex items-center gap-1"><Printer className="w-3.5 h-3.5 text-slate-500" /> STN-01 (Main)</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-emerald-300">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5">Tray Lock: ENCRYPTED</div>
                <div className="text-[10px] text-slate-500">Decryption IP: 10.12.89.51</div>
                <div className="text-[10px] text-slate-600 font-bold mt-1">Spool Status: Idle - Secure handshake ready</div>
              </div>

              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold flex items-center gap-1"><Printer className="w-3.5 h-3.5 text-slate-500" /> STN-02 (Aux)</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-emerald-300">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5">Tray Lock: ENCRYPTED</div>
                <div className="text-[10px] text-slate-500">Decryption IP: 10.12.89.52</div>
                <div className="text-[10px] text-slate-600 font-bold mt-1">Spool Status: Spooling batch #PB-002</div>
              </div>

              <div className="border border-slate-200 p-2.5 rounded bg-red-50 border-red-200">
                <div className="flex justify-between items-center text-red-900">
                  <span className="font-bold flex items-center gap-1"><Printer className="w-3.5 h-3.5 text-red-700" /> STN-03 (Backup)</span>
                  <span className="bg-red-100 text-red-800 px-1 py-0.2 rounded-xs text-[9px] font-semibold border border-red-300">DIAGNOSTIC BLOCK</span>
                </div>
                <div className="text-[10px] text-red-700 mt-1.5">Tray Lock: RECON-LOCK</div>
                <div className="text-[10px] text-red-700">Decryption IP: 10.12.89.53</div>
                <div className="text-[10px] text-red-900 font-bold mt-1">Error code: OPR-TRAY-OPEN-BYPASS</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-205 p-3.5 rounded-sm space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold font-mono text-[#0F172A]">
              <HardDrive className="w-4 h-4 text-slate-700" />
              <span>CUSTODIAL WATERMARKING</span>
            </div>
            <p className="text-slate-600 leading-normal text-[11px]">
              Every page printed is injected with a <strong>Secured Forensic Micro-dot Grid Layer</strong> representing the individual Center ID, date stamp, and biometric approval code of the operator.
            </p>
          </div>
        </div>

        {/* Right Side: Active Batches & Batch logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Logs / Batches Table */}
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                SECURE PRINT BATCH RECONCILIATION LEDGER
              </span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 text-slate-700 font-mono font-semibold rounded-xs">
                TOTAL TRACKED BATCHES: {printBatches.length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Batch ID</th>
                    <th className="px-4 py-2.5">Subject Paper</th>
                    <th className="px-4 py-2.5">IP Router</th>
                    <th className="px-4 py-2.5 text-center">Printed Status</th>
                    <th className="px-4 py-2.5 text-right">Operations Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printBatches.map(batch => {
                    const progressPercent = Math.round((batch.printed / batch.totalRequired) * 100);
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-800">{batch.id}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="font-bold text-[#0F172A] font-sans block">{batch.subject}</span>
                          <span className="text-[11px] text-slate-500 font-sans block">{batch.examName}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">{batch.printerIp} <span className="block text-[9px] text-slate-400">({batch.printerName.split(" ")[0]})</span></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-slate-800">{batch.printed} / {batch.totalRequired}</span>
                            <div className="w-24 bg-slate-200 h-1.5 rounded-sm overflow-hidden">
                              <div className={`h-full ${progressPercent === 100 ? "bg-emerald-600" : "bg-amber-600 animate-pulse"}`} style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <span className="text-[9px] text-slate-450">{progressPercent}% complete</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              batch.status === "Completed" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                              batch.status === "Printing" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                              "bg-slate-100 text-slate-600 border border-slate-300"
                            }`}>
                              {batch.status.toUpperCase()}
                            </span>
                            {batch.status !== "Completed" && (
                              <button
                                id={`simulate-cycle-${batch.id}`}
                                onClick={() => handleSimulateCycle(batch.id)}
                                className="bg-[#1E293B] hover:bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-xs font-mono font-medium border border-slate-600 flex items-center gap-0.5"
                                title="Run print cycle progress (simulates hardware output)"
                              >
                                <Play className="w-2.5 h-2.5" /> CYCLE
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traceability Audit Trail section */}
          <div className="bg-white border border-slate-200 rounded-sm p-4 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
                PRINT DEPOSITARY LOG & AUDIT SIGNATURES
              </h4>
            </div>
            
            <div className="space-y-3 font-mono text-xs text-slate-600 p-3 bg-slate-50 border border-slate-200 rounded-sm">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span>08:17:10: CMD printed initiate copy payload</span>
                <span className="text-[#0F172A] font-bold">BATCH #PB-001 INITIATED</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span>08:18:00: Staged microdot dynamic seed grid</span>
                <span className="text-slate-500">SEED: {paperReleases[0]?.secureDownloadKey || "SEC-D1"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span>08:21:40: Terminal STN-01 reporting complete spool packet</span>
                <span className="text-emerald-700 font-bold">240 COPIES VERIFIED</span>
              </div>
              <div className="flex justify-between py-1 text-[10px] text-slate-400">
                <span>RECONCILIATION RESULT:</span>
                <span className="text-emerald-600 font-bold">SECURED STORAGE INTEGRITY BALANCED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
