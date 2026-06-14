/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, FileDown, Download, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { ExamRecord } from '../types';
import { REGISTRY_RECORDS, generateCertificateText } from '../utils';

interface OfficialVerificationGuideProps {
  onSelectTestRecord?: (record: ExamRecord) => void;
}

export default function OfficialVerificationGuide({ onSelectTestRecord }: OfficialVerificationGuideProps) {
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>(REGISTRY_RECORDS[0].id);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleDownload = (recordId: string) => {
    const record = REGISTRY_RECORDS.find(r => r.id === recordId);
    if (!record) return;

    const text = generateCertificateText(record);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.candidateName.replace(/\s+/g, '_')}_Transcript_${record.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: "faq-1",
      question: "How do I perform a document legitimacy verification?",
      answer: "We support three public methods: (a) Uploading the official certified digital transcript file (TXT or PDF with structured metadata) to calculate its unique SHA-256 signature, (b) Quick-searching using the unique Certificate ID printed on the physical receipt, or (c) Entering detailed candidate qualifications in the Record Lookup layout to pull credentials from centralized board databases."
    },
    {
      id: "faq-2",
      question: "What does the 'Verified' status signify?",
      answer: "A status of 'Verified' (rendered in green) indicates that the calculated cryptographic signature match was discovered in our secure archives. It guarantees both authenticity (the document was indeed issued by the specified board) and absolute integrity (not a single digit, subject, rank, or letter was changed since the result publication date)."
    },
    {
      id: "faq-3",
      question: "What if 'Document Modified' is returned?",
      answer: "This warning is flagged if the computed document hash does not exist in the authorities' ledger, although a basic identifier matches. This happens if an entity manually edits grades, names, or roll numbers. Even a minor edit (e.g., changing 'C1' to 'A1') alters the SHA-256 output entirely, preventing verification."
    },
    {
      id: "faq-4",
      question: "Is personal information saved during the upload check?",
      answer: "No. The system values citizen data privacy. The cryptographic signature calculation is executed entirely within your web browser. Only the alphanumeric hash is briefly queried against public records index tables. File contents are never streamed or persisted on national storage systems."
    },
    {
      id: "faq-5",
      question: "How do I acquire an authentic sample file to test the portal?",
      answer: "Use the 'Interactive Verification Lab' on the right. Select any of the registered candidates from the dropdown, then click 'Download Authentic Transcript'. You can upload this pristine file to observe a verified match. To witness forging detection, open the downloaded file in a text editor, alter a single subject score (e.g., changes '95/100' to '99/100'), save the file, and upload it again."
    }
  ];

  const currentSelectedRecord = REGISTRY_RECORDS.find(r => r.id === selectedDemoUser) || REGISTRY_RECORDS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8" id="verification-guide-section">
      
      {/* FAQ Column */}
      <div className="lg:col-span-7 bg-white border border-[#CBD5E1] p-6 rounded-[4px] shadow-sm">
        <div className="flex items-center space-x-2.5 border-b border-[#E2E8F0] pb-4 mb-5">
          <HelpCircle className="w-5 h-5 text-[#334155]" />
          <h2 className="text-lg font-sans font-semibold text-[#0F172A]">
            Verification System FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map(faq => {
            const isOpen = openFaq === faq.id;
            return (
              <div key={faq.id} className="border border-[#CBD5E1] rounded-[4px]">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center px-4 py-3.5 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors focus:outline-none"
                >
                  <span className="text-sm font-sans font-medium text-[#0F172A]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 py-3.5 text-xs text-[#334155] border-t border-[#CBD5E1] bg-white leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Certificate Testing Lab (Crucial interactive help helper) */}
      <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#CBD5E1] p-6 rounded-[4px] flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-[#CBD5E1] pb-4 mb-4">
            <FileDown className="w-5 h-5 text-[#B45309]" />
            <h2 className="text-base font-sans font-semibold text-[#0F172A]">
              Interactive Verification Sandbox
            </h2>
          </div>

          <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
            Test the portal instantly. Select an official registry profile below to download an authentic text transcript. You can upload it as-is, or artificially edit numbers in notepad to simulate forgery detection.
          </p>

          {/* Selector */}
          <div className="space-y-3 mb-5">
            <label className="block text-xs font-medium text-[#0F172A] uppercase tracking-wider">
              Select Candidate Record
            </label>
            <select
              value={selectedDemoUser}
              onChange={(e) => setSelectedDemoUser(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
            >
              {REGISTRY_RECORDS.map(record => (
                <option key={record.id} value={record.id}>
                  {record.candidateName} — {record.id.slice(-5)} ({record.examination.slice(0, 15)}...)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Stats Sheet of candidate */}
          <div className="bg-white border border-[#CBD5E1] p-4 rounded-[4px] mb-6">
            <div className="grid grid-cols-2 gap-3 text-xs leading-tight">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">Roll No.</span>
                <p className="font-sans font-medium text-[#0F172A] mt-0.5">{currentSelectedRecord.rollNumber}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">ID Code</span>
                <p className="font-sans font-medium text-[#0F172A] mt-0.5">{currentSelectedRecord.id}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">Board Authority</span>
                <p className="font-sans font-medium text-[#0F172A] mt-0.5 truncate">{currentSelectedRecord.institution}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDownload(selectedDemoUser)}
            className="w-full bg-[#0F172A] hover:bg-[#334155] text-white text-xs font-semibold py-2.5 px-4 rounded-[4px] transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Transcript (.txt)</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-white px-3 py-2 border border-[#CBD5E1] rounded-[4px] text-[10px] text-[#64748B]">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
            <span>Upload this file directly under <strong>Verify Document</strong> to run tests.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
