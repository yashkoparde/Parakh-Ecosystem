/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Building2, 
  Search, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  FileCheck2,
  Lock,
  SearchCode
} from 'lucide-react';
import { VerificationRecord, Certificate } from '../types';

interface VerificationModuleProps {
  verifications: VerificationRecord[];
  certificates: Certificate[];
}

export default function VerificationModule({ verifications, certificates }: VerificationModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeRecord, setActiveRecord] = useState<VerificationRecord | null>(null);

  // Verification Checker State
  const [typedRefCode, setTypedRefCode] = useState('');
  const [checkResult, setCheckResult] = useState<{
    status: 'success' | 'warning' | 'error' | null;
    message: string;
    details?: any;
  }>({ status: null, message: '' });

  // Filter list
  const filteredRecords = verifications.filter((rec) => {
    const matchesSearch = 
      rec.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' || 
      rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sandbox Live Verify Code Logic
  const handleLiveVerificationCheck = (e: FormEvent) => {
    e.preventDefault();
    if (!typedRefCode.trim()) {
      setCheckResult({ status: 'warning', message: 'Please enter a valid document number or reference hash to query.' });
      return;
    }

    const trimmed = typedRefCode.trim();
    // 1. Search certificates
    const matchingCertByNumber = certificates.find(
      c => c.documentNumber.toLowerCase() === trimmed.toLowerCase() || c.id.toLowerCase() === trimmed.toLowerCase()
    );

    // 2. Search verification requests
    const matchingRequestByRef = verifications.find(
      v => v.referenceNumber.toLowerCase() === trimmed.toLowerCase() || v.id.toLowerCase() === trimmed.toLowerCase()
    );

    if (matchingCertByNumber) {
      setCheckResult({
        status: 'success',
        message: 'DATABASE CORRESPONDENCE SECURE',
        details: {
          title: matchingCertByNumber.name,
          id: matchingCertByNumber.documentNumber,
          authority: matchingCertByNumber.issuingAuthority,
          stamp: matchingCertByNumber.verificationStatus,
          timestamp: matchingCertByNumber.issuedDate,
          hash: matchingCertByNumber.blockchainHash
        }
      });
    } else if (matchingRequestByRef) {
      setCheckResult({
        status: 'success',
        message: 'HISTORIC SYSTEM QUERY CORRESPONDENCE DETECTED',
        details: {
          title: matchingRequestByRef.documentType,
          id: matchingRequestByRef.referenceNumber,
          authority: matchingRequestByRef.requestedBy,
          stamp: matchingRequestByRef.status,
          timestamp: matchingRequestByRef.timestamp,
          hash: matchingRequestByRef.blockchainVerificationHash
        }
      });
    } else {
      setCheckResult({
        status: 'error',
        message: 'NO DIRECT MATCH ENCOUNTERED IN CENTRAL DATABASE',
        details: {
          title: 'Unknown Query Segment',
          id: trimmed,
          authority: 'External Lookup Entity',
          stamp: 'Unverified / Discrepancy',
          timestamp: 'June 12, 2026 Standard Time',
          hash: 'None — Reference signature lookup failed'
        }
      });
    }
  };

  return (
    <div id="verification-module-view" className="space-y-6">
      
      {/* Overview Block */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider">
          Verification Records & Authenticity Audits
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          National Academic Registry checks are saved permanently in a chronological audit log. Below you can view the historical queries executed by academic institutions, state recruiters, and scholarship boards against your certificates. You can also run a manual query against any local document identifier code in our lookup engine to verify current status.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT TWO COLUMNS: Audit Feed list */}
        <div className="xl:col-span-2 space-y-4">
          
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3.5 no-print">
            <h3 className="text-[11px] font-bold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-600" />
              Audit Queries Historical Log
            </h3>

            {/* Micro Filter Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="inp-verification-search"
                  type="text"
                  placeholder="Query by institution, document index, ID code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded focus:border-slate-500 focus:outline-none placeholder-slate-400 font-mono text-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <span className="text-xs font-mono text-slate-500">Filter:</span>
                <select
                  id="select-verification-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-300 rounded p-1.5 focus:outline-none bg-white font-mono text-slate-950"
                >
                  <option value="All">All Transactions</option>
                  <option value="Verified">Verified MATCH</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Rejected">Rejected MATCH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chronological Table Grid */}
          <div className="bg-white rounded border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-600 font-semibold uppercase">
                    <th className="py-2.5 px-4">Ref Number</th>
                    <th className="py-2.5 px-4">Document Segment</th>
                    <th className="py-2.5 px-4">Requested Entity</th>
                    <th className="py-2.5 px-4 text-center">Outcome</th>
                    <th className="py-2.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-950 text-[11px]">
                          {rec.referenceNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-sans">
                          {rec.documentType}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-sans leading-tight">
                          {rec.requestedBy}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {rec.status === 'Verified' ? (
                            <span className="bg-green-50 text-green-800 border-green-200 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                              Verified
                            </span>
                          ) : rec.status === 'Under Review' ? (
                            <span className="bg-amber-50 text-amber-800 border-amber-200 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                              Review
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-800 border-red-200 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`btn-records-view-${rec.id}`}
                            onClick={() => setActiveRecord(rec)}
                            className="text-slate-900 border border-slate-300 hover:bg-slate-50 px-2 py-1 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        No verification requests found corresponding to the query terms.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIVE EXPANDED INSPECTED AUDIT RECORD DETAILS */}
          {activeRecord && (
            <div id="active-record-inspected-panel" className="bg-white p-5 rounded border-2 border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                  Active Verification Record
                </span>
                <button 
                  id="btn-active-record-close"
                  onClick={() => setActiveRecord(null)}
                  className="text-slate-400 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Close Segment [X]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Reference Number:</span>
                  <p className="text-slate-950 font-semibold">{activeRecord.referenceNumber}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Verification Date:</span>
                  <p className="text-slate-950">{activeRecord.timestamp}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Inspected Document:</span>
                  <p className="text-slate-950 font-semibold font-sans">{activeRecord.documentType}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-slate-400 uppercase text-[10px]">Requester Agency:</span>
                  <p className="text-slate-950 font-semibold font-sans">{activeRecord.requestedBy}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-300 rounded font-mono text-xs">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">AUDIT STAMP OUTCOME</span>
                <p className="text-slate-900 shrink leading-relaxed">{activeRecord.verificationResult}</p>
              </div>

              <div className="p-2.5 bg-slate-900 text-slate-200 rounded text-[10px] font-mono leading-tight">
                <span className="text-slate-500 font-bold block mb-0.5">DIGITAL REGISTRY SIGNATURE HASH</span>
                <span className="text-slate-350 select-all font-semibold block break-all">{activeRecord.blockchainVerificationHash}</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT ONE COLUMN: Manual Verification Sandbox Engine */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
            
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
                <SearchCode className="w-4 h-4 text-slate-700" />
                Live Database Lookup
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal font-sans">
                Interactively query our central database. Insert any registration number to output verification details.
              </p>
            </div>

            <form onSubmit={handleLiveVerificationCheck} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-tight" htmlFor="live-ref-input">
                  Document ID or Ref Number
                </label>
                <input
                  id="live-ref-input"
                  type="text"
                  placeholder="e.g., HSC-2026-99384501, MC-2026-88129034"
                  value={typedRefCode}
                  onChange={(e) => setTypedRefCode(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none font-mono text-slate-950"
                />
              </div>

              <button
                id="btn-live-verification-submit"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Verify Credential Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Sandbox Output Console */}
            {checkResult.status && (
              <div className={`p-4 rounded border font-mono text-xs space-y-3 ${
                checkResult.status === 'success' 
                  ? 'bg-green-50 text-green-950 border-green-300' 
                  : checkResult.status === 'warning'
                  ? 'bg-amber-50 text-amber-950 border-amber-300'
                  : 'bg-red-50 text-red-950 border-red-300'
                }`}
              >
                <div className="flex items-center gap-1.5 border-b pb-1.5 border-current/20">
                  {checkResult.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : checkResult.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="font-bold text-[10px] tracking-wide uppercase">{checkResult.message}</span>
                </div>

                {checkResult.details && (
                  <div className="text-[10px] leading-relaxed space-y-1.5">
                    <div>
                      <span className="opacity-60 block">QUERY TITLE:</span>
                      <span className="font-bold">{checkResult.details.title}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">DOCUMENT CODE:</span>
                      <span className="font-bold">{checkResult.details.id}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">REGULATORY AUTHORITY / OR AGENCY:</span>
                      <span className="font-bold leading-tight block">{checkResult.details.authority}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">REGISTRY STAMP:</span>
                      <span className="font-bold underline uppercase">{checkResult.details.stamp}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">REGISTRY SEAL HASH:</span>
                      <span className="font-bold select-all break-all">{checkResult.details.hash}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[10px] text-slate-500 font-mono space-y-1 leading-normal">
              <span className="font-bold text-slate-700 block text-[9px] uppercase">Supported Sandbox Test Codes:</span>
              <p>• HSC-2026-99384501 (Board Certificate)</p>
              <p>• MC-2026-88129034 (Migration Credential)</p>
              <p>• VR-HS2026-9041 (Admissions check)</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
