/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileBadge, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Printer,
  ChevronRight,
  HelpCircle,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesModuleProps {
  certificates: Certificate[];
  onViewCertificateDetail: (cert: Certificate) => void;
  onDownloadCertificate: (cert: Certificate) => void;
  onVerifyAuthenticity: (cert: Certificate) => void;
}

export default function CertificatesModule({ 
  certificates, 
  onViewCertificateDetail, 
  onDownloadCertificate,
  onVerifyAuthenticity
}: CertificatesModuleProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // filter
  const filteredCerts = certificates.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = 
      filterType === 'All' || 
      c.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div id="certificates-module-view" className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider">
          Digital Document Repository
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Access authoritative digital versions of your official board certificates, graduation status, and migration records. These are certified records under the National Academic Registry System. You can print them as verified PDF files or share secure verification reference codes with third-party institutions.
        </p>
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div className="bg-white p-4 rounded border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3.5 no-print">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="input-certs-search"
            type="text"
            placeholder="Search by certificate title, ID, issuing commission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded focus:border-slate-500 focus:outline-none placeholder-slate-400 font-mono text-slate-950"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <select
            id="select-certs-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-slate-300 rounded p-1.5 focus:outline-none bg-white font-mono text-slate-950"
          >
            <option value="All">All Credentials</option>
            <option value="Degree">Board Certificates</option>
            <option value="Migration">Migration Credentials</option>
            <option value="Transcript">Transcripts</option>
            <option value="Certificate">Other Certificates</option>
          </select>

          {(searchTerm || filterType !== 'All') && (
            <button
              id="btn-certs-reset"
              onClick={() => { setSearchTerm(''); setFilterType('All'); }}
              className="text-xs text-red-700 hover:text-red-900 font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENT TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCerts.length > 0 ? (
          filteredCerts.map((cert) => (
            <div 
              key={cert.id} 
              className="bg-white p-5 rounded border border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between space-y-4"
            >
              
              {/* Card Top: Document Identity details */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between">
                  {/* Badge representing Type */}
                  <span className="bg-slate-100 border border-slate-250 text-slate-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded uppercase">
                    {cert.type}
                  </span>
                  
                  {/* Status Indicator Badges */}
                  <div className="flex items-center gap-1.5">
                    {cert.status === 'Issued' ? (
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase">
                        Issued
                      </span>
                    ) : (
                      <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase">
                        Pending
                      </span>
                    )}

                    {cert.verificationStatus === 'Verified' ? (
                      <span className="bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase" title="Verified central record">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase">
                        Under Audit
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-950 flex items-center gap-1.5 pt-1">
                  <FileBadge className="w-4 h-4 text-slate-700 shrink-0" />
                  {cert.name}
                </h3>
                
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 select-all">
                  Credential ID: <span className="font-semibold text-slate-700">{cert.documentNumber}</span>
                </p>
                
                <p className="text-xs text-slate-600 leading-normal line-clamp-2">
                  {cert.description}
                </p>
              </div>

              {/* Card Bottom: Metadata and Action triggers */}
              <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2.5">
                
                {/* Meta details */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Issued Date: {cert.issuedDate}</span>
                  <span className="hidden sm:inline">Authority: National Repository Database</span>
                </div>

                {/* Secure action anchors */}
                <div className="grid grid-cols-3 gap-2 pt-1 no-print">
                  <button
                    id={`btn-certs-view-${cert.id}`}
                    onClick={() => onViewCertificateDetail(cert)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-center text-[11px] font-medium py-2 rounded transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    id={`btn-certs-download-${cert.id}`}
                    onClick={() => onDownloadCertificate(cert)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-center text-[11px] font-medium py-2 rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>

                  <button
                    id={`btn-certs-verify-${cert.id}`}
                    onClick={() => onVerifyAuthenticity(cert)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 text-center text-[11px] font-medium py-2 rounded transition-colors cursor-pointer"
                  >
                    Verify Authenticity
                  </button>
                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded border border-slate-200">
            <p className="text-slate-500 font-semibold font-mono">No matching board certificates registered under your ID.</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Review your program or reset academic search filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
