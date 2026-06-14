/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, CreditCard, Activity, CheckCircle2, XCircle, AlertTriangle, Printer, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { ExamRecord, VerificationEvent } from '../types';
import { REGISTRY_RECORDS, computeSHA256 } from '../utils';

interface MainVerificationModuleProps {
  onAddAuditLog: (event: VerificationEvent) => void;
  selectedRecord: ExamRecord | null;
  onClearSelectedRecord: () => void;
}

export default function MainVerificationModule({ onAddAuditLog, selectedRecord, onClearSelectedRecord }: MainVerificationModuleProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'id' | 'detailed'>('upload');
  
  // File upload states
  const [isDragging, setIsDragging] = useState(false);
  const [fileToProcess, setFileToProcess] = useState<{ name: string; content: string } | null>(null);
  
  // Manual inputs
  const [certIdInput, setCertIdInput] = useState('');
  const [candidateIdInput, setCandidateIdInput] = useState('');
  
  // Detailed inputs
  const [detName, setDetName] = useState('');
  const [detRoll, setDetRoll] = useState('');
  const [detDob, setDetDob] = useState('');
  const [detBoard, setDetBoard] = useState(REGISTRY_RECORDS[0].institution);
  const [detYear, setDetYear] = useState('2025');

  // Processing steps states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingData, setProcessingData] = useState<{
    docName: string;
    method: string;
    computedHash: string;
  } | null>(null);

  // Verification outcome state
  const [outcome, setOutcome] = useState<{
    status: 'Verified' | 'Modified' | 'NotFound' | 'Invalid';
    record: ExamRecord | null;
    computedHash: string;
    targetHash?: string; // If modified, what the registry hash is
    errorDetails?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle selected record updates from other components
  React.useEffect(() => {
    if (selectedRecord) {
      // Instantly show the verified result for this record!
      setOutcome({
        status: 'Verified',
        record: selectedRecord,
        computedHash: selectedRecord.sha256
      });
    }
  }, [selectedRecord]);

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Process selected file text content to lookup matches
  const processFileVerification = async (fileName: string, textContent: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    setOutcome(null);

    // Simulated step transitions (600ms total, fast and professional, no gimmicks)
    setProcessingData({
      docName: fileName,
      method: 'SHA-256 File Signature Verification',
      computedHash: 'Calculating...'
    });

    const computed = await computeSHA256(textContent);

    setTimeout(() => {
      setProcessingStep(1); // Hash Generated
      setProcessingData(prev => prev ? { ...prev, computedHash: computed } : null);
    }, 200);

    setTimeout(() => {
      setProcessingStep(2); // Record Located / Queried
    }, 450);

    setTimeout(() => {
      // Find matching record by direct hash match!
      const directMatch = REGISTRY_RECORDS.find(r => r.sha256 === computed);

      let logStatus: 'Verified' | 'Modified' | 'Record Not Found' | 'Invalid' = 'Verified';
      
      if (directMatch) {
        setOutcome({
          status: 'Verified',
          record: directMatch,
          computedHash: computed
        });
        logStatus = 'Verified';
        onAddAuditLog({
          id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
          documentName: fileName,
          documentType: 'PDF',
          lookupReference: directMatch.id,
          status: 'Verified',
          computedHash: computed,
          registryHashMatched: true
        });
      } else {
        // Advanced: Check if they manipulated an authentic certificate,
        // let's scan if the file contains a Certificate ID that we know.
        const certIdRegex = /CERTIFICATE ID:\s*(PRK-\d{4}-[A-Z0-9]+)/;
        const match = textContent.match(certIdRegex);
        const refIdInText = match ? match[1] : null;

        const knownRecordWithId = refIdInText 
          ? REGISTRY_RECORDS.find(r => r.id === refIdInText) 
          : null;

        if (knownRecordWithId) {
          // Found matching ID! This is an edited/manipulated file.
          setOutcome({
            status: 'Modified',
            record: knownRecordWithId,
            computedHash: computed,
            targetHash: knownRecordWithId.sha256,
            errorDetails: "Integrity Verification Mismatch: The certificate identifier corresponds to an existing record, but its calculated file checksum does not. This is a clear indicator that grades, names, or evaluation criteria were edited after original publication."
          });
          logStatus = 'Modified';
          onAddAuditLog({
            id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
            documentName: fileName,
            documentType: 'PDF',
            lookupReference: knownRecordWithId.id,
            status: 'Modified',
            computedHash: computed,
            registryHashMatched: false
          });
        } else {
          // Completely unknown hash and structure
          setOutcome({
            status: 'NotFound',
            record: null,
            computedHash: computed,
            errorDetails: "No verified record match was found for this code signature. The file is unregistered or has been altered."
          });
          logStatus = 'Record Not Found';
          onAddAuditLog({
            id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
            documentName: fileName,
            documentType: 'PDF',
            lookupReference: 'UNKNOWN',
            status: 'Record Not Found',
            computedHash: computed,
            registryHashMatched: false
          });
        }
      }

      setIsProcessing(false);
    }, 700);
  };

  // Drop Handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileToProcess({ name: file.name, content: text });
        processFileVerification(file.name, text);
      };
      
      reader.readAsText(file);
    }
  };

  // Manual File Input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileToProcess({ name: file.name, content: text });
        processFileVerification(file.name, text);
      };
      
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Verification by Certificate ID
  const handleIdVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const queryId = certIdInput.toUpperCase().trim();
    if (!queryId) return;

    setIsProcessing(true);
    setProcessingStep(0);
    setOutcome(null);

    setProcessingData({
      docName: `Certificate Lookup ID: ${queryId}`,
      method: "Official Registry Index Query",
      computedHash: "Querying Database..."
    });

    setTimeout(() => setProcessingStep(1), 150);
    setTimeout(() => setProcessingStep(2), 350);

    setTimeout(() => {
      const match = REGISTRY_RECORDS.find(
        r => r.id === queryId || r.candidateID.toUpperCase() === queryId || r.rollNumber === queryId
      );

      if (match) {
        setOutcome({
          status: 'Verified',
          record: match,
          computedHash: match.sha256
        });
        onAddAuditLog({
          id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
          documentName: `ID Lookup: ${queryId}`,
          documentType: 'Certificate ID',
          lookupReference: match.id,
          status: 'Verified',
          computedHash: match.sha256,
          registryHashMatched: true
        });
      } else {
        setOutcome({
          status: 'NotFound',
          record: null,
          computedHash: "INDEX-MISSING-HASH",
          errorDetails: `The reference '${queryId}' was not detected in any registered board indexes. Double check the character spelling and issuance year.`
        });
        onAddAuditLog({
          id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
          documentName: `ID Lookup: ${queryId}`,
          documentType: 'Certificate ID',
          lookupReference: queryId,
          status: 'Record Not Found',
          computedHash: 'N/A',
          registryHashMatched: false
        });
      }
      setIsProcessing(false);
    }, 600);
  };

  // Detailed Record Lookup Form submission
  const handleDetailedLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detName || !detRoll) return;

    setIsProcessing(true);
    setProcessingStep(0);
    setOutcome(null);

    setProcessingData({
      docName: `Candidate: ${detName} (Roll: ${detRoll})`,
      method: "Multi-Field Record Query",
      computedHash: "Querying parameters..."
    });

    setTimeout(() => setProcessingStep(1), 200);
    setTimeout(() => setProcessingStep(2), 400);

    setTimeout(() => {
      // Find matches where name starts/includes, and roll number matches exactly!
      const match = REGISTRY_RECORDS.find(r => 
        r.candidateName.toLowerCase().includes(detName.toLowerCase().trim()) &&
        r.rollNumber === detRoll.trim() &&
        r.institution === detBoard &&
        r.year === detYear
      );

      if (match) {
        setOutcome({
          status: 'Verified',
          record: match,
          computedHash: match.sha256
        });
        onAddAuditLog({
          id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
          documentName: `Detailed: ${detName}`,
          documentType: 'Result Lookup',
          lookupReference: match.id,
          status: 'Verified',
          computedHash: match.sha256,
          registryHashMatched: true
        });
      } else {
        setOutcome({
          status: 'NotFound',
          record: null,
          computedHash: 'DETAILED-MISSING',
          errorDetails: `No student records discovered for Name: "${detName}" and Roll: "${detRoll}" under the selected assessment board authority.`
        });
        onAddAuditLog({
          id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString() + ' | ' + new Date().toLocaleDateString(),
          documentName: `Detailed: ${detName}`,
          documentType: 'Result Lookup',
          lookupReference: `ROLL-${detRoll}`,
          status: 'Record Not Found',
          computedHash: 'N/A',
          registryHashMatched: false
        });
      }
      setIsProcessing(false);
    }, 650);
  };

  const handleReset = () => {
    setFileToProcess(null);
    setOutcome(null);
    setCertIdInput('');
    setCandidateIdInput('');
    setDetName('');
    setDetRoll('');
    setDetDob('');
    onClearSelectedRecord();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-[4px] shadow-sm overflow-hidden" id="main-verification-box">
      
      {/* Tab Navigation header */}
      <div className="bg-[#F8FAFC] border-b border-[#CBD5E1] flex flex-wrap">
        <button
          onClick={() => { setActiveTab('upload'); handleReset(); }}
          className={`flex items-center space-x-2 px-5 py-4 text-xs font-sans font-semibold border-r border-[#CBD5E1] transition-all cursor-pointer ${
            activeTab === 'upload' 
              ? 'bg-white text-[#0F172A] border-t-2 border-t-[#0F172A]' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <Upload className="w-4 h-4 shrink-0" />
          <span>VERIFY FILE TRANSCRIPT</span>
        </button>

        <button
          onClick={() => { setActiveTab('id'); handleReset(); }}
          className={`flex items-center space-x-2 px-5 py-4 text-xs font-sans font-semibold border-r border-[#CBD5E1] transition-all cursor-pointer ${
            activeTab === 'id' 
              ? 'bg-white text-[#0F172A] border-t-2 border-t-[#0F172A]' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>VERIFY CERTIFICATE ID</span>
        </button>

        <button
          onClick={() => { setActiveTab('detailed'); handleReset(); }}
          className={`flex items-center space-x-2 px-5 py-4 text-xs font-sans font-semibold border-r border-[#CBD5E1] transition-all cursor-pointer ${
            activeTab === 'detailed' 
              ? 'bg-white text-[#0F172A] border-t-2 border-t-[#0F172A]' 
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          <span>DETAILED RECORD LOOKUP</span>
        </button>
      </div>

      <div className="p-6">
        
        {/* State 1: Verification processing simulated screen */}
        {isProcessing && processingData && (
          <div className="py-10 flex flex-col items-center justify-center font-sans">
            <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin mb-4" />
            <span className="text-[#0F172A] font-semibold text-sm">Processing verification query...</span>
            <span className="text-xs text-[#64748B] mt-1">{processingData.docName}</span>
            
            {/* Structured progress steps */}
            <div className="w-full max-w-md mt-8 space-y-3 bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[4px]">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0] mb-2 font-mono">
                <span className="text-[#64748B]">METHOD</span>
                <span className="text-[#0F172A] font-bold">{processingData.method}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>1. File Document Received</span>
                <span className="font-mono text-[#166534] font-semibold">COMPLETE</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>2. Cryptographic Hash Generated</span>
                <span className={`font-mono font-semibold ${processingStep >= 1 ? 'text-[#166534]' : 'text-[#64748B]'}`}>
                  {processingStep >= 1 ? 'ACTIVE' : 'QUEUED'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>3. National Registry DB Queried</span>
                <span className={`font-mono font-semibold ${processingStep >= 2 ? 'text-[#166534]' : 'text-[#64748B]'}`}>
                  {processingStep >= 2 ? 'ACTIVE' : 'QUEUED'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Active Forms if NOT currently processing and NO results are shown */}
        {!isProcessing && !outcome && (
          <div>
            {/* TAB A: UPLOAD ZONE */}
            {activeTab === 'upload' && (
              <div>
                <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
                  Provide an official digital transcript file. The portal parses its payload structure and computes the diagnostic hash signature instantly.
                </p>

                {/* Drag zone container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-[4px] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-[#0F172A] bg-[#F1F5F9]'
                      : 'border-[#CBD5E1] hover:border-[#334155] bg-white'
                  }`}
                  id="drop-zone"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt"
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 text-[#64748B] mb-3" />
                  <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                    Drag and Drop Academic Transcript (.txt) Here
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    or click to pick files in local computer directory
                  </p>
                  
                  <div className="mt-4 text-[10px] bg-[#F1F5F9] px-3 py-1 text-[#64748B] rounded-[2px] font-mono border border-dashed border-[#CBD5E1]">
                    Compatible with files generated in the Sandbox down below
                  </div>
                </div>

                <div className="mt-6 flex items-start space-x-2.5 text-xs text-[#64748B] leading-relaxed">
                  <Activity className="w-4 h-4 mt-0.5 text-[#64748B] shrink-0" />
                  <span>
                    No personal data ever leaves your computer. The cryptographic validation executes purely locally in your web browser utilizing standard SHA-256 protocols.
                  </span>
                </div>
              </div>
            )}

            {/* TAB B: ID INPUT */}
            {activeTab === 'id' && (
              <form onSubmit={handleIdVerification}>
                <p className="text-xs text-[#64748B] mb-5 leading-relaxed bg-[#F8FAFC] p-3 border-l-2 border-[#0F172A] rounded-[2px]">
                  Provide the unique serial key located at the top-header of the certificate receipt or the student's Registration Roll ID. Examples to try out: <strong className="font-mono bg-white px-1 py-0.5 rounded border border-[#CBD5E1]">PRK-2025-E810F</strong> (Arjun) or <strong className="font-mono bg-white px-1 py-0.5 rounded border border-[#CBD5E1]">CAN-40115</strong> (Siddharth).
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cert-id" className="block text-xs font-semibold uppercase text-[#0F172A] tracking-wider mb-2">
                      Certificate ID / Candidate ID Code
                    </label>
                    <input
                      id="cert-id"
                      type="text"
                      required
                      placeholder="e.g. PRK-2025-E810F, CAN-40115..."
                      value={certIdInput}
                      onChange={(e) => setCertIdInput(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-[4px] px-3.5 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F172A] hover:bg-[#334155] text-white text-xs font-semibold py-2.5 px-4 rounded-[4px] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Execute ID Registry Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* TAB C: DETAILED FORM */}
            {activeTab === 'detailed' && (
              <form onSubmit={handleDetailedLookup} className="space-y-4">
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Query secondary backup index lists. Enter candidate profile specifications exactly as spelled in standard registry applications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Candidate Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun R. Nair"
                      value={detName}
                      onChange={(e) => setDetName(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Seat/Roll Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5102941, 8294021..."
                      value={detRoll}
                      onChange={(e) => setDetRoll(e.target.value)}
                      className="w-full border border-[#CBD5E1] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Issuing Board Assessment Authority
                    </label>
                    <select
                      value={detBoard}
                      onChange={(e) => setDetBoard(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                    >
                      {REGISTRY_RECORDS.map(r => (
                        <option key={r.id} value={r.institution}>{r.institution}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Examination Evaluation Year
                    </label>
                    <select
                      value={detYear}
                      onChange={(e) => setDetYear(e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F172A] hover:bg-[#334155] text-white text-xs font-semibold py-2.5 px-4 rounded-[4px] transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <span>Query Custom Indexes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        )}

        {/* State 3: Outcome results layout screen */}
        {outcome && (
          <div className="space-y-6">
            
            {/* HEADER CORNER OF THE REPORT OUTCOME */}
            <div className={`p-4 rounded-[4px] border flex items-start space-x-3.5 ${
              outcome.status === 'Verified'
                ? 'bg-[#EBF7EE] border-[#A3E635] text-[#166534]'
                : outcome.status === 'Modified'
                ? 'bg-[#FFF1F2] border-[#FDA4AF] text-[#991B1B]'
                : 'bg-[#FFFBEB] border-[#FDE047] text-[#991B1B]'
            }`} id="verification-outcome-banner">
              
              {outcome.status === 'Verified' ? (
                <CheckCircle2 className="w-5.5 h-5.5 mt-0.5 shrink-0 text-[#166534]" />
              ) : outcome.status === 'Modified' ? (
                <AlertTriangle className="w-5.5 h-5.5 mt-0.5 shrink-0 text-[#991B1B]" />
              ) : (
                <XCircle className="w-5.5 h-5.5 mt-0.5 shrink-0 text-[#B45309]" />
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    {outcome.status === 'Verified' && "RECORD MATCH: AUTHENTIC CERTIFICATE VERIFIED"}
                    {outcome.status === 'Modified' && "RECORD CHECKSUM MISMATCH: ALTERED DOCUMENT"}
                    {outcome.status === 'NotFound' && "RECORD NOT FOUND IN OFFICIAL INDEX"}
                  </h3>
                  
                  <span className="text-[10px] font-mono uppercase bg-white/60 px-2 py-0.5 rounded border border-black/10 font-medium">
                    STATUS: {outcome.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[#334155] mt-1 leading-relaxed">
                  {outcome.status === 'Verified' && "The diagnostic digital signature matches perfectly against the registered central ledger database files. No tampering has occurred."}
                  {outcome.status === 'Modified' && (outcome.errorDetails || "The cryptographic hash calculated from this file does not match the authority record issued in the central ledger.")}
                  {outcome.status === 'NotFound' && (outcome.errorDetails || "We found no reference record matched to this input in our state digital archives.")}
                </p>

                {/* Compare hash details for Modified or failures */}
                {outcome.status === 'Modified' && outcome.record && (
                  <div className="mt-3 p-3 bg-white/80 border border-[#991B1B]/10 rounded-[4px] space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between flex-wrap gap-2 text-[#991B1B]" style={{ wordBreak: 'break-all' }}>
                      <span>[Computed Hash from Upload]:</span> 
                      <span className="font-bold">{outcome.computedHash}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2 text-[#166534]" style={{ wordBreak: 'break-all' }}>
                      <span>[Registry Expected Match]:</span> 
                      <span className="font-bold">{outcome.targetHash}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* IF VERIFIED OR MODIFIED: Display Official Transcript Report layout */}
            {outcome.record && (
              <div 
                className="bg-white border-2 border-[#CBD5E1] p-6 sm:p-8 rounded-[4px] relative print:border-none print:p-0 font-sans shadow-md"
                id="printable-report-sheet"
              >
                
                {/* Official seal decoration (subtle, non-neon, professional) */}
                <div className="absolute top-6 right-6 select-none opacity-10 pointer-events-none hidden sm:block">
                  <ShieldCheck className="w-36 h-36 text-slate-800" />
                </div>

                {/* Government style report header */}
                <div className="text-center border-b border-[#0F172A] pb-5 mb-6">
                  <div className="text-xs uppercase font-mono tracking-widest text-[#64748B] font-bold">
                    Official Assessment verification record
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight mt-1">
                    NATIONAL STUDENT ACADEMIC REGISTRY REPORT
                  </h3>
                  <div className="flex justify-center items-center space-x-2 mt-2 text-xs text-[#64748B]">
                    <span>REGISTRY INDEX: {outcome.record.auditProofChain}</span>
                    <span>•</span>
                    <span>ISSUER: MoE CENTRAL SYSTEM</span>
                  </div>
                </div>

                {/* Student profile grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs mb-6 border-b border-[#CBD5E1] pb-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">Candidate Name</span>
                    <p className="text-sm font-bold text-[#0F172A] mt-0.5">{outcome.record.candidateName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">Father / Guardian Name</span>
                    <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{outcome.record.fatherName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">Birth Date (DD-MM-YYYY)</span>
                    <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{outcome.record.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">State Registration Candidate ID</span>
                    <p className="text-sm font-mono font-medium text-[#0F172A] mt-0.5">{outcome.record.candidateID}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">Assessment Board / Institution</span>
                    <p className="text-sm font-bold text-[#0F172A] mt-0.5">{outcome.record.institution}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">Registered roll number</span>
                    <p className="text-sm font-mono font-bold text-[#0F172A] mt-0.5">{outcome.record.rollNumber}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">EXAMINATION CREDENTIALS</span>
                    <p className="text-sm font-sans font-semibold text-[#0F172A] mt-0.5">{outcome.record.examination}</p>
                  </div>
                </div>

                {/* Score listing table */}
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase text-[#0F172A] tracking-wider mb-2 font-mono">
                    Official Subjects & Evaluation sheet
                  </div>
                  <div className="border border-[#CBD5E1] rounded-[4px] overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] font-semibold text-[#334155] text-[11px]">
                          <th className="py-2.5 px-3">Subject Name</th>
                          <th className="py-2.5 px-3 text-center">Marks Score</th>
                          <th className="py-2.5 px-3 text-right">Alphabetic Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#CBD5E1]">
                        {outcome.record.subjects.map(subject => (
                          <tr key={subject.name} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{subject.name}</td>
                            <td className="py-2.5 px-3 text-center text-[#334155] font-mono">{subject.score}</td>
                            <td className="py-2.5 px-3 text-right text-[#0F172A] font-bold font-mono">{subject.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final status banner inside sheet */}
                <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B]">Consensus Resolution</span>
                    <p className="text-sm font-bold text-[#0F172A] mt-0.5">{outcome.record.gpaOrResult}</p>
                  </div>
                  <div className="self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] hidden sm:block">Record Status</span>
                    <span className="inline-block bg-[#166534] text-white font-mono text-[11px] font-bold px-3 py-1 rounded-[2px]">
                      {outcome.status === 'Verified' ? "VERIFIED OFFICIAL" : "VERIFICATION MISMATCH"}
                    </span>
                  </div>
                </div>

                {/* Digital security footprints */}
                <div className="border-t border-dashed border-[#CBD5E1] pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] text-[#64748B] font-mono leading-relaxed" style={{ wordBreak: 'break-all' }}>
                  <div className="sm:col-span-2">
                    <p className="uppercase font-semibold text-[#0F172A]">CRYPTOGRAPHIC HASH (SHA-256)</p>
                    <p className="bg-[#F8FAFC] border border-[#CBD5E1] p-2 rounded-[2px] mt-1.5 text-xs text-[#0F172A]">
                      {outcome.computedHash}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase font-semibold text-[#0F172A]">REGISTRY SPEC SIGNATURE</p>
                    <p className="bg-[#F8FAFC] border border-[#CBD5E1] p-2 rounded-[2px] mt-1.5 text-xs text-[#0F172A]">
                      {outcome.record.authoritySignature}
                    </p>
                  </div>
                  <div className="sm:col-span-3 text-[10px] font-sans border-t border-[#E2E8F0] pt-3 text-[#64748B]">
                    Report parsed on 12-June-2026 UTC. Authenticated query executed via client-side SubtleCrypto ledger check API. 
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons to reset/print */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold py-2.5 px-4 rounded-[4px] border border-[#CBD5E1] transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>← Verify another record</span>
              </button>

              {outcome.record && (
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-[#0F172A] hover:bg-[#334155] text-white text-xs font-semibold py-2.5 px-5 rounded-[4px] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Authentic Report</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
