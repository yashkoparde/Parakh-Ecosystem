/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  LayoutDashboard,
  BrainCircuit,
  FileCode2,
  CheckSquare,
  Binary,
  Database,
  Building,
  Users as UsersIcon,
  BookOpen,
  History,
  Settings as SettingsIcon,
  VideoOff,
  User,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from "lucide-react";

import {
  Question,
  QuestionStatus,
  Difficulty,
  CognitiveLevel,
  Blueprint,
  GeneratedPaper,
  EvaluationJob,
  BlockchainRecord,
  AuditLog,
  Subject,
  ExamCenter,
  AdminUser
} from "./types";

import {
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_CENTERS,
  INITIAL_QUESTIONS,
  INITIAL_BLUEPRINTS,
  INITIAL_PAPERS,
  INITIAL_EVALUATIONS,
  INITIAL_BLOCKCHAINS,
  INITIAL_AUDITS
} from "./data";

import SystemHeader from "./components/SystemHeader";
import DashboardModule from "./components/DashboardModule";
import DronaModule from "./components/DronaModule";
import VedaModule from "./components/VedaModule";
import MulyaModule from "./components/MulyaModule";
import SakshyaModule from "./components/SakshyaModule";
import AdminDirectory from "./components/AdminDirectory";
import HBOLoader from "./components/HBOLoader";

export default function App() {
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "DRONA" | "VEDA" | "MULYA" | "SAKSHYA" | "DIRECTORY">("DASHBOARD");
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Local Storage Synchronized States
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [generatedPapers, setGeneratedPapers] = useState<GeneratedPaper[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationJob[]>([]);
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Initialize from LocalStorage or mock data
  useEffect(() => {
    const getOrSet = <T,>(key: string, initial: T): T => {
      const stored = localStorage.getItem(`parakh_${key}`);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { console.error(e); }
      }
      localStorage.setItem(`parakh_${key}`, JSON.stringify(initial));
      return initial;
    };

    setUsers(getOrSet("users", INITIAL_USERS));
    setSubjects(getOrSet("subjects", INITIAL_SUBJECTS));
    setCenters(getOrSet("centers", INITIAL_CENTERS));
    setQuestions(getOrSet("questions", INITIAL_QUESTIONS));
    setBlueprints(getOrSet("blueprints", INITIAL_BLUEPRINTS));
    setGeneratedPapers(getOrSet("generatedPapers", INITIAL_PAPERS));
    setEvaluations(getOrSet("evaluations", INITIAL_EVALUATIONS));
    setBlockchainRecords(getOrSet("blockchainRecords", INITIAL_BLOCKCHAINS));
    setAuditLogs(getOrSet("auditLogs", INITIAL_AUDITS));
    
    const loadedUsers = getOrSet("users", INITIAL_USERS);
    setCurrentUser(loadedUsers[0] || INITIAL_USERS[0]);
  }, []);

  // Update localStorage helper
  const updateStateAndStorage = <T,>(key: string, value: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    setter(value);
    localStorage.setItem(`parakh_${key}`, JSON.stringify(value));
  };

  // Helper to add audit logs
  const addAuditLog = (actionCode: string, actionDetails: string, status: "COMPLIANT" | "ALERT" = "COMPLIANT") => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      userEmail: currentUser?.email || "system@parakh.gov.in",
      userRole: currentUser?.role || "SYSTEM",
      actionCode,
      actionDetails,
      ipAddress: "10.230.12.91",
      status
    };
    const updated = [newLog, ...auditLogs];
    updateStateAndStorage("auditLogs", updated, setAuditLogs);
  };

  // 1. DRONA: Add Item to catalog
  const handleAddQuestion = (q: Omit<Question, "id" | "code" | "createdAt" | "createdBy">) => {
    const codeCount = questions.filter(item => item.subject === q.subject).length + 1;
    const subAbbr = q.subject.slice(0, 4).toUpperCase();
    
    const newQuestion: Question = {
      ...q,
      id: `Q-${Math.floor(6000 + Math.random() * 4000)}`,
      code: `Q-${subAbbr}-401-0${codeCount}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || "Dr. K. Raghavan"
    };

    const updated = [newQuestion, ...questions];
    updateStateAndStorage("questions", updated, setQuestions);

    // Increment count on matching Subject
    const updatedSubjects = subjects.map(s => {
      if (s.name.toLowerCase() === q.subject.toLowerCase()) {
        return { ...s, totalQuestions: s.totalQuestions + 1 };
      }
      return s;
    });
    updateStateAndStorage("subjects", updatedSubjects, setSubjects);

    addAuditLog(
      "ITEM_DEPOSIT",
      `Deposited new catalog question under subject [${q.subject}]. Code assigned: ${newQuestion.code}. State: ${q.status}.`,
      "COMPLIANT"
    );
  };

  // 2. DRONA: Approvals / Rejections transition
  const handleUpdateQuestionStatus = (id: string, status: QuestionStatus, auditReason: string) => {
    const updated = questions.map(q => {
      if (q.id === id) {
        return { ...q, status };
      }
      return q;
    });
    updateStateAndStorage("questions", updated, setQuestions);

    const target = questions.find(q => q.id === id);
    const code = target?.code || "UNKN";

    addAuditLog(
      status === QuestionStatus.Approved ? "ITEM_BOARD_APPROVE" : "ITEM_BOARD_REJECT",
      `Board audit processed for question ${code}. Transitioned state to ${status}. Details: "${auditReason}"`,
      status === QuestionStatus.Approved ? "COMPLIANT" : "ALERT"
    );

    // Anchor to blockchain records if approved
    if (status === QuestionStatus.Approved) {
      const prevBlock = blockchainRecords[0] || INITIAL_BLOCKCHAINS[0];
      const newTx: BlockchainRecord = {
        id: `TX-${Math.floor(920 + Math.random() * 80)}`,
        timestamp: new Date().toISOString(),
        action: `Approved Board Question Item Catalog Entry [${code}] into Immutable Master Vault`,
        entityType: "QuestionBank",
        entityId: id,
        blockNumber: prevBlock.blockNumber + 1,
        transactionHash: "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        previousBlockHash: prevBlock.transactionHash,
        digitalSignature: `SIG_SHA256_RSA_2048:${(currentUser?.name || "Dr_K_Raghavan").replace(/\s/g, "_")}:cert_99ff`,
        status: "Anchored"
      };
      const updatedLedger = [newTx, ...blockchainRecords];
      updateStateAndStorage("blockchainRecords", updatedLedger, setBlockchainRecords);
    }
  };

  // 3. VEDA: Add blueprint mapping
  const handleAddBlueprint = (bp: Omit<Blueprint, "id" | "code">) => {
    const subAbbr = bp.subject.slice(0, 4).toUpperCase();
    const newBp: Blueprint = {
      ...bp,
      id: `B-${Math.floor(200 + Math.random() * 800)}`,
      code: `BP-${subAbbr}-401${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    };

    const updated = [...blueprints, newBp];
    updateStateAndStorage("blueprints", updated, setBlueprints);

    addAuditLog(
      "BLUEPRINT_CREATE",
      `Composed and approved systemic blueprint matrix for subject [${bp.subject}]. Code mapped: ${newBp.code}`,
      "COMPLIANT"
    );
  };

  const handleUpdateBlueprint = (updatedBp: Blueprint) => {
    const updated = blueprints.map(b => b.id === updatedBp.id ? updatedBp : b);
    updateStateAndStorage("blueprints", updated, setBlueprints);

    addAuditLog(
      "BLUEPRINT_EDIT",
      `Updated systemic blueprint matrix for subject [${updatedBp.subject}]. Blueprint: ${updatedBp.code} - ${updatedBp.name}`,
      "COMPLIANT"
    );
  };

  // 4. VEDA: Compilation execution of secure exam set
  const handleGeneratePaper = (paper: Omit<GeneratedPaper, "id" | "code" | "generatedAt" | "generatedBy" | "sha256Hash" | "blockchainTx" | "status">) => {
    const prevBlock = blockchainRecords[0] || INITIAL_BLOCKCHAINS[0];
    const generatedHash = Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    const generatedTx = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    
    const codeCount = generatedPapers.filter(item => item.subject === paper.subject).length + 1;
    const subAbbr = paper.subject.slice(0, 4).toUpperCase();

    const initialVersion = {
      versionId: 1,
      timestamp: new Date().toISOString(),
      title: paper.title,
      questions: paper.questions,
      totalMarks: paper.totalMarks,
      sha256Hash: generatedHash,
      modifiedBy: currentUser?.name || "Dr. K. Raghavan"
    };

    const newPaper: GeneratedPaper = {
      ...paper,
      id: `P-${Math.floor(4500 + Math.random() * 500)}`,
      code: `EXAM-2026-${subAbbr}-0${codeCount}A`,
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser?.name || "Dr. K. Raghavan",
      sha256Hash: generatedHash,
      blockchainTx: generatedTx,
      status: "Securely Sealed",
      versions: [initialVersion]
    };

    const updated = [newPaper, ...generatedPapers];
    updateStateAndStorage("generatedPapers", updated, setGeneratedPapers);

    addAuditLog(
      "PAPER_SECURE_COMPILATION",
      `Compiled and cryp-sealed set packet [${newPaper.code}] under blueprint constraint ${paper.blueprintCode}. Hash registered in ledger.`,
      "COMPLIANT"
    );

    // Pushed to immutable ledger
    const newTx: BlockchainRecord = {
      id: `TX-${Math.floor(920 + Math.random() * 80)}`,
      timestamp: new Date().toISOString(),
      action: `Anchored Certified Secure Master Exam Set Packet [${newPaper.code}] Hash Checklist`,
      entityType: "ExamPaper",
      entityId: newPaper.id,
      blockNumber: prevBlock.blockNumber + 1,
      transactionHash: generatedTx,
      previousBlockHash: prevBlock.transactionHash,
      digitalSignature: `SIG_SHA256_RSA_2048:${(currentUser?.name || "Dr_K_Raghavan").replace(/\s/g, "_")}:exam_sig_fbc31`,
      status: "Anchored"
    };
    const updatedLedger = [newTx, ...blockchainRecords];
    updateStateAndStorage("blockchainRecords", updatedLedger, setBlockchainRecords);
  };

  const handleUpdatePaper = (updatedPaper: GeneratedPaper) => {
    const updated = generatedPapers.map(p => {
      if (p.id === updatedPaper.id) {
        return updatedPaper;
      }
      return p;
    });
    updateStateAndStorage("generatedPapers", updated, setGeneratedPapers);

    addAuditLog(
      "PAPER_ITERATION_SAVE",
      `Updated exam paper [${updatedPaper.code}] to a new version. Title: "${updatedPaper.title}". Total Marks: ${updatedPaper.totalMarks}.`,
      "COMPLIANT"
    );
  };

  const handleUpdatePaperStatus = (id: string, status: "Draft" | "Securely Sealed" | "Released") => {
    const updated = generatedPapers.map(p => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    updateStateAndStorage("generatedPapers", updated, setGeneratedPapers);

    const target = generatedPapers.find(p => p.id === id);
    addAuditLog(
      status === "Released" ? "EXAM_RELEASE" : "EXAM_SEAL_MODIFY",
      `Transitioned exam packet code ${target?.code} status parameter to ${status}. Secure regional distribution protocols initiated.`,
      "COMPLIANT"
    );
  };

  // 5. MULYA: Double blind audit verify grade sets
  const handleVerifyEvaluation = (id: string, status: EvaluationJob["verificationStatus"]) => {
    const updated = evaluations.map(e => {
      if (e.id === id) {
        return { ...e, verificationStatus: status, lastActionAt: new Date().toISOString() };
      }
      return e;
    });
    updateStateAndStorage("evaluations", updated, setEvaluations);

    const target = evaluations.find(e => e.id === id);
    
    // Anchor scoregrades if Verified & Locked
    if (status === "Verified & Locked") {
      const prevBlock = blockchainRecords[0] || INITIAL_BLOCKCHAINS[0];
      const newTx: BlockchainRecord = {
        id: `TX-${Math.floor(920 + Math.random() * 80)}`,
        timestamp: new Date().toISOString(),
        action: `Anchored Double-Blind Grades Verification Grade-Set for center NC-DEL-001`,
        entityType: "EvaluationResult",
        entityId: id,
        blockNumber: prevBlock.blockNumber + 1,
        transactionHash: "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        previousBlockHash: prevBlock.transactionHash,
        digitalSignature: `SIG_SHA256_RSA_2048:${(currentUser?.name || "Smt_Ranjana_Sen").replace(/\s/g, "_")}:verify_sig_91ee2`,
        status: "Anchored"
      };
      const updatedLedger = [newTx, ...blockchainRecords];
      updateStateAndStorage("blockchainRecords", updatedLedger, setBlockchainRecords);
    }
  };

  // 6. DIRECTORY: CCTV on/off simulation switches
  const handleToggleCctv = (id: string) => {
    const target = centers.find(c => c.id === id);
    if (!target) return;

    const newStatus = target.cctvStatus === "ONLINE" ? "OFFLINE" : "ONLINE";
    const newStreams = newStatus === "ONLINE" ? Math.floor(20 + Math.random()*40) : 0;

    const updated = centers.map(c => {
      if (c.id === id) {
        return { ...c, cctvStatus: newStatus, secureStreams: newStreams };
      }
      return c;
    });
    updateStateAndStorage("centers", updated, setCenters);

    addAuditLog(
      newStatus === "OFFLINE" ? "EXAM_CENTER_CCTV_OUTAGE" : "EXAM_CENTER_CCTV_ONLINE",
      `Physical camera signal diagnostics triggered for center ${target.centerCode} (${target.name}). CCTV Status changed to ${newStatus}.`,
      newStatus === "OFFLINE" ? "ALERT" : "COMPLIANT"
    );
  };

  // Safe checks before render
  if (isAppLoading) {
    return <HBOLoader onComplete={() => setIsAppLoading(false)} />;
  }

  if (!currentUser) {
    return <div className="p-8 text-center text-xs font-mono text-slate-400">Booting secure PARAKH executive layers...</div>;
  }

  // State checks for header dashboard summary
  const systemIntegrityScore = centers.some(c => c.cctvStatus === "OFFLINE") ? 92 : 100;
  const blockchainHeight = blockchainRecords.length > 0 ? blockchainRecords[0].blockNumber : 482019;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-t-4 border-slate-950">
      
      {/* Persistant Top Header with global switchers */}
      <SystemHeader
        currentUser={currentUser}
        availableUsers={users}
        onUserChange={setCurrentUser}
        systemIntegrityScore={systemIntegrityScore}
        blockchainHeight={blockchainHeight}
      />

      {/* Main Structural Grid Sidebar/Body */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Sidebar Fixed Navigation */}
        <nav className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col no-print select-none shrink-0">
          
          {/* Institutional Badge */}
          <div className="p-4 border-b border-slate-800/85 bg-slate-950/60 font-mono text-xs flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4" />
            <span className="font-semibold tracking-wider text-[11px]">ADMIN CONTROL PORTAL</span>
          </div>

          <div className="flex-1 py-4 space-y-7">
            
            {/* Core sections */}
            <div className="space-y-1.5 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Operations Monitor</span>
              <button
                onClick={() => setActiveTab("DASHBOARD")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "DASHBOARD" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
            </div>

            {/* Questions Bank */}
            <div className="space-y-1 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Item Catalog</span>
              <button
                onClick={() => setActiveTab("DRONA")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "DRONA" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <BrainCircuit className="h-4 w-4" /> Question Bank
              </button>
            </div>

            {/* Paper generation suite */}
            <div className="space-y-1 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Assessment Packs</span>
              <button
                onClick={() => setActiveTab("VEDA")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "VEDA" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <FileCode2 className="h-4 w-4" /> Exam Paper Builder
              </button>
            </div>

            {/* Evaluation */}
            <div className="space-y-1 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Double-Blind Verification</span>
              <button
                onClick={() => setActiveTab("MULYA")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "MULYA" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <CheckSquare className="h-4 w-4" /> Grading Verification
              </button>
            </div>

            {/* Change History explorer */}
            <div className="space-y-1 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Auditing Vault</span>
              <button
                onClick={() => setActiveTab("SAKSHYA")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "SAKSHYA" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <History className="h-4 w-4" /> Change Audit Trail
              </button>
            </div>

            {/* Directories, Logs, Centers */}
            <div className="space-y-1 px-3">
              <span className="block text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">Infrastructure Controls</span>
              <button
                onClick={() => setActiveTab("DIRECTORY")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-sm transition-all text-left cursor-pointer ${
                  activeTab === "DIRECTORY" ? "bg-slate-800 text-white border border-slate-700 shadow-sm" : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                }`}
              >
                <Database className="h-4 w-4" /> Registry & Exam Sites
              </button>
            </div>

          </div>

          {/* Active Logged-in Operator Badge */}
          <div className="p-4 bg-slate-955 border-t border-slate-800 text-xs flex items-center gap-3 space-y-0.5 mt-auto">
            <div className="h-8 w-8 rounded-sm bg-slate-800/80 flex items-center justify-center text-slate-300 font-bold border border-slate-750">
              {currentUser.name.split(" ").pop()?.slice(0, 2).toUpperCase() || "OP"}
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-[11px] truncate max-w-[130px]">{currentUser.name}</div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wide">{currentUser.role}</span>
            </div>
          </div>
        </nav>

        {/* Core Screen Body View Workspace */}
        <main className="flex-1 p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "DASHBOARD" && (
                <DashboardModule
                  questions={questions}
                  generatedPapers={generatedPapers}
                  evaluations={evaluations}
                  auditLogs={auditLogs}
                  blockchainRecords={blockchainRecords}
                  centers={centers}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === "DRONA" && (
                <DronaModule
                  questions={questions}
                  subjects={subjects}
                  currentUser={currentUser}
                  onAddQuestion={handleAddQuestion}
                  onUpdateQuestionStatus={handleUpdateQuestionStatus}
                  auditLogs={auditLogs}
                />
              )}

              {activeTab === "VEDA" && (
                <VedaModule
                  blueprints={blueprints}
                  generatedPapers={generatedPapers}
                  questions={questions}
                  subjects={subjects}
                  currentUser={currentUser}
                  onAddBlueprint={handleAddBlueprint}
                  onUpdateBlueprint={handleUpdateBlueprint}
                  onGeneratePaper={handleGeneratePaper}
                  onUpdatePaper={handleUpdatePaper}
                  onUpdatePaperStatus={handleUpdatePaperStatus}
                />
              )}

              {activeTab === "MULYA" && (
                <MulyaModule
                  evaluations={evaluations}
                  currentUser={currentUser}
                  onVerifyEvaluation={handleVerifyEvaluation}
                  onAddAuditLog={addAuditLog}
                />
              )}

              {activeTab === "SAKSHYA" && (
                <SakshyaModule
                  blockchainRecords={blockchainRecords}
                />
              )}

              {activeTab === "DIRECTORY" && (
                <AdminDirectory
                  users={users}
                  centers={centers}
                  subjects={subjects}
                  auditLogs={auditLogs}
                  onToggleCctv={handleToggleCctv}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
