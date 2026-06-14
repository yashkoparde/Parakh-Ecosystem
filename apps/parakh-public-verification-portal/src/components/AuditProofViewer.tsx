/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerificationEvent } from '../types';
import { Database, ShieldCheck, ClipboardCheck, Clock, Check, AlertCircle } from 'lucide-react';

interface AuditProofViewerProps {
  auditLogs: VerificationEvent[];
  onClearHistory: () => void;
}

export default function AuditProofViewer({ auditLogs, onClearHistory }: AuditProofViewerProps) {
  return (
    <div className="bg-white border border-[#CBD5E1] p-6 rounded-[4px] shadow-sm mt-8" id="audit-proof-ledger-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-4 mb-6 gap-4">
        <div className="flex items-center space-x-2.5">
          <Database className="w-5 h-5 text-[#334155]" />
          <div>
            <h2 className="text-lg font-sans font-semibold text-[#0F172A]">
              Session Verification Audit Log
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Public transparency ledger of localized verification events performed in this session
            </p>
          </div>
        </div>
        
        {auditLogs.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-[#991B1B] hover:text-red-700 font-medium border border-[#991B1B]/10 hover:bg-[#991B1B]/5 px-3 py-1.5 rounded-[4px] transition-all self-start sm:self-auto"
          >
            Clear Session Audit History
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Core explanation card (resembles audit agency documentation) */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[4px] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex space-x-3 items-start">
            <ShieldCheck className="w-5 h-5 text-[#166534] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Secure Local Processing</h4>
              <p className="text-[11px] text-[#64748B] mt-1 leading-normal">
                Files are analyzed in local browser memory. Raw document data is never saved or uploaded to remote servers.
              </p>
            </div>
          </div>
          <div className="flex space-x-3 items-start border-t md:border-t-0 md:border-l border-[#CBD5E1] pt-4 md:pt-0 md:pl-4">
            <ClipboardCheck className="w-5 h-5 text-[#0F172A] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Factual Index Matching</h4>
              <p className="text-[11px] text-[#64748B] mt-1 leading-normal">
                Validation performs a one-to-one signature comparison using official board registry identifiers.
              </p>
            </div>
          </div>
          <div className="flex space-x-3 items-start border-t md:border-t-0 md:border-l border-[#CBD5E1] pt-4 md:pt-0 md:pl-4">
            <Clock className="w-5 h-5 text-[#B45309] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">Independent Auditing</h4>
              <p className="text-[11px] text-[#64748B] mt-1 leading-normal">
                Academic institutions can compute text hashes offline to compare them with the official public registry indexes.
              </p>
            </div>
          </div>
        </div>

        {/* Ledger items list */}
        {auditLogs.length === 0 ? (
          <div className="py-12 text-center bg-[#F8FAFC] rounded-[4px] border border-dashed border-[#CBD5E1]">
            <span className="text-xs text-[#64748B]">No query events registered. Run a document check or search.</span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#CBD5E1] rounded-[4px]">
            <table className="w-full text-left font-sans border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white text-[10px] uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Event ID / Time</th>
                  <th className="py-3 px-4">Verification Type</th>
                  <th className="py-3 px-4">Identified Reference</th>
                  <th className="py-3 px-4">Computed Cryptographic Hash (SHA-256)</th>
                  <th className="py-3 px-4 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-[#0F172A]">{log.id}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{log.timestamp}</div>
                    </td>
                    <td className="py-3 px-4 text-[#334155] font-medium">
                      {log.documentType}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#334155]">
                      {log.lookupReference || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#64748B]">
                      <div className="max-w-[200px] sm:max-w-xs md:max-w-md truncate" title={log.computedHash}>
                        {log.computedHash}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-[4px] font-medium text-[11px] ${
                        log.status === 'Verified' 
                          ? 'bg-[#DCFCE7] text-[#166534]' 
                          : log.status === 'Modified' 
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : log.status === 'Under Review'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {log.status === 'Verified' ? (
                          <Check className="w-3 h-3 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 shrink-0" />
                        )}
                        <span>{log.status.toUpperCase()}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
