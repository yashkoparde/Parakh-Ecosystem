/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Info, HelpCircle, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#CBD5E1] mt-auto font-sans" id="portal-footer">
      {/* Policy warning sub-footer */}
      <div className="bg-[#FFFBEB] border-b border-[#FEF3C7] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs text-[#B45309]">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold uppercase tracking-wider">Legal Notice & Anti-Tampering Standard:</span>
            {' '}Any attempt to falsify examination scores, edit generated hashes, or present unauthorized transcripts as verified certificates constitutes a punishable offense under digital document integrity and forgery laws. Secure cryptographic hashes are archived instantly at the time of board verification.
          </div>
        </div>
      </div>

      {/* Main Footer Links & Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
            PARAKH National Assessment Centre
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Formulated under the National Education Policy, PARAKH establishes standard-setting bodies for student assessment and evaluation across all recognized school boards in the republic.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
            System Operations & Verification FAQ
          </h3>
          <ul className="space-y-2 text-xs text-[#64748B]">
            <li className="flex items-center space-x-2">
              <Info className="w-3.5 h-3.5" />
              <span>Public ledgers are updated in real-time by CBSE, CISCE, and State Authorities.</span>
            </li>
            <li className="flex items-center space-x-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Records from 1995 onwards are fully indexed.</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
            Cryptographic Integrity Note
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            The verification process utilizes client-side hashing algorithms to verify local document content matches the secure ledger. Absolute privacy is maintained—file contents are processed locally and never permanently stored on servers.
          </p>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-[#F8FAFC] py-4 border-t border-[#E2E8F0] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#64748B] space-y-2 sm:space-y-0">
          <div>
            © 2026 Ministry of Education • National Student Record Registry. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-[#0F172A] cursor-help">Digital Verification Protocol</span>
            <span>•</span>
            <span className="hover:text-[#0F172A] cursor-help">Terms & Audit Scope</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
