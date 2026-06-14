/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Award, FileCheck, Landmark } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-[#CBD5E1]" id="portal-header">
      {/* Top micro-banner typical of strict government portals */}
      <div className="bg-[#0F172A] text-[#F8FAFC] text-[11px] py-1 px-4 sm:px-6 flex justify-between items-center font-sans tracking-wide">
        <div className="flex items-center space-x-2">
          <Landmark className="w-3.5 h-3.5 text-[#CBD5E1]" />
          <span>GOVERNMENT ASSESSMENT RECORD VERIFICATION SYSTEM</span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <span>PUBLIC RECORD NETWORK</span>
          <span className="text-[#94A3B8]">|</span>
          <span>LANG: ENGLISH</span>
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#0F172A] p-2.5 rounded-[4px] text-white flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-[2px]">
                PARAKH
              </span>
              <span className="text-xs text-[#64748B] font-medium">• SECURE REGISTRY</span>
            </div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-[#0F172A] mt-0.5">
              National Examination Verification Portal
            </h1>
          </div>
        </div>

        {/* System state badges (factual and authoritative) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono px-3 py-1.5 rounded-[4px] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
            <span>REGISTRY STATUS: SECURE</span>
          </div>
          <div className="bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono px-3 py-1.5 rounded-[4px] flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
            <span>ENCRYPTION ALGORITHM: SHA-256</span>
          </div>
        </div>
      </div>
    </header>
  );
}
