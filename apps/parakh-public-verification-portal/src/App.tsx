/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainVerificationModule from './components/MainVerificationModule';
import RegistryLookup from './components/RegistryLookup';
import OfficialVerificationGuide from './components/OfficialVerificationGuide';
import AuditProofViewer from './components/AuditProofViewer';
import { ExamRecord, VerificationEvent } from './types';
import { initializeRegistryHashes, REGISTRY_RECORDS } from './utils';
import { ShieldCheck, Info, FileText, ExternalLink, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PrestigeIntro from './components/PrestigeIntro';

export default function App() {
  const [selectedRecord, setSelectedRecord] = useState<ExamRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<VerificationEvent[]>([]);
  const [isIntroLoading, setIsIntroLoading] = useState(true);

  // Initialize registry signatures and load stored session logs
  useEffect(() => {
    // Recalculate dynamic SHA-256 offsets to guarantee perfect browser-match
    initializeRegistryHashes();

    // Pull previous logs from current window session to populate ledger
    const savedLogs = localStorage.getItem('parakh_audit_logs');
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs));
      } catch (err) {
        console.error("Failed to parse audit history", err);
      }
    } else {
      // Pre-populate with one simple official audit log to make the ledger feel active on load
      const initialLogs: VerificationEvent[] = [
        {
          id: "EV-8012",
          timestamp: "02:15:10 PM | 12/06/2026",
          documentName: "National Registry Index Sync",
          documentType: "Result Lookup",
          lookupReference: "INDEX-2026",
          status: "Verified",
          computedHash: "82bc3aa19302dfb94102d1d0ab91ff3d93acfbbf26e680a6bbf0280ebdbcf0b15",
          registryHashMatched: true
        }
      ];
      setAuditLogs(initialLogs);
      localStorage.setItem('parakh_audit_logs', JSON.stringify(initialLogs));
    }
  }, []);

  // Set selected record and scroll cleanly to verify area
  const handleSelectRecord = (record: ExamRecord) => {
    setSelectedRecord(record);
    const element = document.getElementById('main-verification-box');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearSelectedRecord = () => {
    setSelectedRecord(null);
  };

  const handleAddAuditLog = (event: VerificationEvent) => {
    const updated = [event, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('parakh_audit_logs', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setAuditLogs([]);
    localStorage.removeItem('parakh_audit_logs');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0F172A] selection:text-white">
      {/* Cinematic prestige loader */}
      <AnimatePresence mode="wait">
        {isIntroLoading && (
          <PrestigeIntro onComplete={() => setIsIntroLoading(false)} />
        )}
      </AnimatePresence>

      {/* Prime branding header */}
      <Header />

      {/* Main Container Core Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8" id="portal-content-body">
        
        {/* National Banner Notice */}
        <div className="bg-[#0F172A] text-white p-6 rounded-[4px] border border-[#CBD5E1] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 opacity-[0.03] select-none scale-150 transform translate-x-12 translate-y-2 pointer-events-none hidden lg:block">
            <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="space-y-1.5 max-w-3xl z-10">
            <div className="flex items-center space-x-2 text-xs font-mono font-medium text-[#CBD5E1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
              <span>VERIFIED NATIONAL ASSESSMENT PLATFORM</span>
              <span>•</span>
              <span>NEP COMPLIANT</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Official Certificate Authenticity Registry
            </h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              PARAKH establishes a digital assurance network where academic transcripts are verified using browser-executable hashing algorithms. Students and verified employers can validate outcomes without requiring administrative lookup credentials.
            </p>
          </div>

          <div className="flex gap-4 shrink-0 mt-2 md:mt-0 z-10 flex-wrap">
            <a 
              href="#verification-guide-section"
              className="px-4 py-2 border border-[#CBD5E1]/30 hover:border-white text-xs font-semibold text-[#F8FAFC] bg-white/5 hover:bg-white/10 rounded-[4px] py-2.5 transition-all flex items-center space-x-2"
            >
              <span>View Guide</span>
            </a>
            
            <a 
              href="#national-registry-search-lookup"
              className="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold rounded-[4px] py-2.5 transition-all flex items-center space-x-2 shadow-sm"
            >
              <span>Explore Trial Database</span>
            </a>
          </div>
        </div>

        {/* Content Section: 1. Main verification component */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#334155]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#334155]">
              Document Verification Engine
            </h3>
          </div>
          
          {/* Main verification widget */}
          <MainVerificationModule 
            onAddAuditLog={handleAddAuditLog} 
            selectedRecord={selectedRecord}
            onClearSelectedRecord={handleClearSelectedRecord}
          />
        </div>

        {/* Content Section: 2. Core searchable database ledger lookup */}
        <RegistryLookup onSelectRecord={handleSelectRecord} />

        {/* Content Section: 3. FAQ instructions and dynamic testing lab */}
        <OfficialVerificationGuide />

        {/* Content Section: 4. live cryptographic ledger auditing session track */}
        <AuditProofViewer auditLogs={auditLogs} onClearHistory={handleClearHistory} />

      </main>

      {/* Official national agency footer */}
      <Footer />
    </div>
  );
}
