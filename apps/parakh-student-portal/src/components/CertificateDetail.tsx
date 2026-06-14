/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Award,
  Building,
  Stamp
} from 'lucide-react';
import { useState } from 'react';
import { Certificate, Student } from '../types';

interface CertificateDetailProps {
  certificate: Certificate;
  student: Student;
  onBack: () => void;
  onDownload: () => void;
}

export default function CertificateDetail({ 
  certificate, 
  student, 
  onBack, 
  onDownload 
}: CertificateDetailProps) {
  
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.blockchainHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="certificate-detail-view" className="space-y-6">
      
      {/* Navigation and Top Controls */}
      <div className="flex items-center justify-between no-print">
        <button
          id="btn-cert-detail-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Repository</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-cert-detail-download"
            onClick={onDownload}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* CENTRAL CRYPTOGRAPHIC STATEMENT BOARD */}
      <div className="bg-white p-6 md:p-10 border-4 border-double border-slate-900 print-card rounded shadow-sm space-y-8 relative max-w-3xl mx-auto">
        
        {/* State Seal and Academic Framework */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-200">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-slate-100 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <Building className="w-7 h-7 text-slate-800" />
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">
            NATIONAL ACADEMIC RECORD DEPOSITORY
          </span>
          <h1 className="text-base md:text-lg font-bold uppercase text-slate-900 tracking-tight leading-snug">
            {certificate.issuingAuthority}
          </h1>
          <p className="text-[11px] text-slate-500 font-mono tracking-tight">
            National Database Repository & Authentication Code: APEX-9042
          </p>
        </div>

        {/* SECURE BLOCK STATEMENT HEADER */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-semibold text-slate-500 font-mono tracking-wider">
            This is to certify that
          </span>
          
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-950 uppercase tracking-wide">
              {student.name}
            </h2>
            <p className="text-xs text-slate-600 font-mono">
              Candidate Roll Number: <span className="font-semibold text-slate-950">{student.rollNumber}</span>
            </p>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
            having complied with all academic requirements, evaluations, and official guidelines of the examination commissions, has been officially issued the certified record of:
          </p>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 max-w-lg mx-auto">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              {certificate.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Registration Identifier: <span className="text-slate-800 font-semibold">{certificate.documentNumber}</span>
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
              "{certificate.description}"
            </p>
          </div>
        </div>

        {/* DESCENTRALIZED SIGNATURES, DATE, AND SECURITIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-6">
          
          {/* Metadata Parameters list */}
          <div className="space-y-2 text-xs font-mono text-slate-600">
            <div>
              <span className="text-slate-400">ISSUED DATE:</span>
              <p className="text-slate-900 font-semibold">{certificate.issuedDate}</p>
            </div>
            <div>
              <span className="text-slate-400">DOCUMENT CATEGORY:</span>
              <p className="text-slate-900 uppercase font-semibold">{certificate.type} Index</p>
            </div>
            <div>
              <span className="text-slate-400">VERIFICATION AUDIT:</span>
              <p className="text-emerald-800 font-bold uppercase flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                RECORD VERIFIED SAFE
              </p>
            </div>
          </div>

          {/* Secure System Stamp box */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 bg-slate-50/50 rounded text-center">
            <div className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider mb-2">Official Seal</div>
            <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-slate-800 text-[10px] tracking-tight bg-white">
              VERIFIED
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-2 leading-none">PARAKH Registry Commission</p>
          </div>

        </div>

        {/* SECURE REGISTRY BACKING FOOTER */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-sm space-y-2 font-mono text-[10px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-bold tracking-wider uppercase">Repository Digital Signature Checksum</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-1 rounded text-[9px]">ACTIVE SIGNATURE</span>
          </div>
          <div className="space-y-1 leading-normal select-all">
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 truncate">SHA256 CHECKSUM:</span>
              <button 
                id="btn-cert-copy-hash"
                onClick={handleCopyHash}
                className="text-slate-300 hover:text-white flex items-center gap-1 text-[9px] bg-slate-800 hover:bg-slate-700 px-1 rounded tracking-wide font-semibold cursor-pointer shrink-0 py-0.5 border border-slate-700"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-300 break-all select-all font-mono leading-tight bg-slate-950 p-1.5 rounded border border-slate-850">
              {certificate.blockchainHash}
            </p>
            <p className="text-slate-500 select-all leading-tight">
              Digital Record Hash: <span className="text-slate-300">{certificate.txHash}</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
