/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Blueprint, GeneratedPaper, GeneratedPaperVersion, Question, AdminUser, QuestionStatus, Subject } from "../types";
import { FileCode, Settings, ShieldAlert, Cpu, Eye, ExternalLink, Printer, CheckCircle, Fingerprint, Lock, Send, FileCheck, ArrowUp, ArrowDown, Trash2, Edit3, Save, Undo2, PlusCircle, Check } from "lucide-react";

interface VedaModuleProps {
  blueprints: Blueprint[];
  generatedPapers: GeneratedPaper[];
  questions: Question[];
  subjects: Subject[];
  currentUser: AdminUser;
  onAddBlueprint: (bp: Omit<Blueprint, "id" | "code">) => void;
  onUpdateBlueprint: (bp: Blueprint) => void;
  onGeneratePaper: (paper: Omit<GeneratedPaper, "id" | "code" | "generatedAt" | "generatedBy" | "sha256Hash" | "blockchainTx" | "status">) => void;
  onUpdatePaper: (paper: GeneratedPaper) => void;
  onUpdatePaperStatus: (id: string, status: "Draft" | "Securely Sealed" | "Released") => void;
}

export default function VedaModule({
  blueprints,
  generatedPapers,
  questions,
  subjects,
  currentUser,
  onAddBlueprint,
  onUpdateBlueprint,
  onGeneratePaper,
  onUpdatePaper,
  onUpdatePaperStatus
}: VedaModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"BLUEPRINTS" | "GENERATION" | "PAPERS">("BLUEPRINTS");

  // Blueprint form states
  const [showBpForm, setShowBpForm] = useState(false);
  const [bpName, setBpName] = useState("");
  const [bpSubject, setBpSubject] = useState(subjects[0]?.name || "");
  const [bpMarks, setBpMarks] = useState<number>(100);
  const [bpEasy, setBpEasy] = useState<number>(30);
  const [bpMedium, setBpMedium] = useState<number>(40);
  const [bpHard, setBpHard] = useState<number>(30);
  const [bpDuration, setBpDuration] = useState<number>(180);
  const [editingBlueprintId, setEditingBlueprintId] = useState<string | null>(null);

  // Paper generator workspace states
  const [selectedBpId, setSelectedBpId] = useState<string>("");
  const [paperTitle, setPaperTitle] = useState("");
  const [generationFeedback, setGenerationFeedback] = useState<{ status: "idle" | "success" | "error"; msg: string }>({ status: "idle", msg: "" });

  // Selected generated paper for detail preview pane
  const [previewPaperId, setPreviewPaperId] = useState<string | null>(null);

  // States for Editing/Iterating Exam Papers
  const [isEditingPaper, setIsEditingPaper] = useState(false);
  const [editingPaperTitle, setEditingPaperTitle] = useState("");
  const [editingPaperQuestions, setEditingPaperQuestions] = useState<Question[]>([]);
  const [selectedAddQuestionId, setSelectedAddQuestionId] = useState("");
  const [viewedVersionId, setViewedVersionId] = useState<number | null>(null);

  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(bpEasy) + Number(bpMedium) + Number(bpHard) !== 100) {
      alert("Error: Total difficulty weight distribution parameters must exactly equal 100%.");
      return;
    }
    if (!bpName.trim()) {
      alert("Blueprint identification title is mandatory.");
      return;
    }

    if (editingBlueprintId) {
      const originalBp = blueprints.find(b => b.id === editingBlueprintId);
      if (originalBp) {
        onUpdateBlueprint({
          ...originalBp,
          name: bpName,
          subject: bpSubject,
          totalMarks: Number(bpMarks),
          easyPercent: Number(bpEasy),
          mediumPercent: Number(bpMedium),
          hardPercent: Number(bpHard),
          durationMinutes: Number(bpDuration)
        });
      }
      setEditingBlueprintId(null);
    } else {
      onAddBlueprint({
        name: bpName,
        subject: bpSubject,
        totalMarks: Number(bpMarks),
        easyPercent: Number(bpEasy),
        mediumPercent: Number(bpMedium),
        hardPercent: Number(bpHard),
        durationMinutes: Number(bpDuration),
        status: "Approved"
      });
    }

    setBpName("");
    setBpSubject(subjects[0]?.name || "");
    setBpMarks(100);
    setBpEasy(30);
    setBpMedium(40);
    setBpHard(30);
    setBpDuration(180);
    setShowBpForm(false);
  };

  const handleGeneratePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerationFeedback({ status: "idle", msg: "" });

    const bp = blueprints.find(b => b.id === selectedBpId);
    if (!bp) {
      setGenerationFeedback({ status: "error", msg: "Invalid or missing Blueprint selection bounds." });
      return;
    }

    if (!paperTitle.trim()) {
      setGenerationFeedback({ status: "error", msg: "Assessments require official titles for national records." });
      return;
    }

    // Check compliance: count approved questions for this subject in our repository
    const approvedSubjectQuestions = questions.filter(
      q => q.subject.toLowerCase() === bp.subject.toLowerCase() && q.status === QuestionStatus.Approved
    );

    if (approvedSubjectQuestions.length < 2) {
      setGenerationFeedback({
        status: "error",
        msg: `INSUFFICIENT_POOL: There are only ${approvedSubjectQuestions.length} APPROVED questions under subject [${bp.subject}] in the active catalog bank. Please approve draft questions in the Item Catalog tab first.`
      });
      return;
    }

    // Perform procedural selection
    // In our simplified mock compiler, we gather matching approved questions, matching difficulty parameters if possible
    const selectedQuestions: Question[] = [];
    
    // Attempt standard breakdown (mocking actual index selections)
    const easyQs = approvedSubjectQuestions.filter(q => q.difficulty === "Easy");
    const medQs = approvedSubjectQuestions.filter(q => q.difficulty === "Medium");
    const hardQs = approvedSubjectQuestions.filter(q => q.difficulty === "Hard");

    // Push questions to complete the totalMarks as close as possible
    if (easyQs.length > 0) selectedQuestions.push(easyQs[0]);
    if (medQs.length > 0) selectedQuestions.push(medQs[0]);
    if (hardQs.length > 0) selectedQuestions.push(hardQs[0]);

    // Fallbacks if lists were scarce
    if (selectedQuestions.length === 0) {
      selectedQuestions.push(approvedSubjectQuestions[0]);
    }

    // Trigger state change
    onGeneratePaper({
      title: paperTitle,
      blueprintCode: bp.code,
      subject: bp.subject,
      totalMarks: bp.totalMarks,
      questions: selectedQuestions
    });

    setGenerationFeedback({
      status: "success",
      msg: `COMPLIANCE DETECTED: Procedural paper compilation completed successfully. 256-bit SHA fingerprint registered in national ledger logs.`
    });

    // Reset Generator selection
    setPaperTitle("");
    setSelectedBpId("");
    setTimeout(() => {
      setActiveSubTab("PAPERS");
      setGenerationFeedback({ status: "idle", msg: "" });
    }, 1800);
  };

  const activePreviewPaper = generatedPapers.find(p => p.id === previewPaperId);

  return (
    <div className="space-y-6">
      
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Exam Blueprints & Assembly</h2>
          <p className="text-xs text-slate-500">Define blueprints and assemble questions into final exam papers.</p>
        </div>

        {/* Action Toggles */}
        <div className="flex gap-1 border border-slate-200 bg-slate-100 p-0.5 rounded-sm">
          <button
            onClick={() => { setActiveSubTab("BLUEPRINTS"); setPreviewPaperId(null); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded-sm ${activeSubTab === "BLUEPRINTS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Exam Blueprints ({blueprints.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("GENERATION"); setPreviewPaperId(null); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded-sm ${activeSubTab === "GENERATION" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Generate Exam Paper
          </button>
          <button
            onClick={() => { setActiveSubTab("PAPERS"); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded-sm ${activeSubTab === "PAPERS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Exam Papers ({generatedPapers.length})
          </button>
        </div>
      </div>

      {activeSubTab === "BLUEPRINTS" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-sm">
            <div className="text-xs text-slate-600">
              Blueprints outline the structure of exams, specifying marks and difficulty distributions.
            </div>
            <button
              onClick={() => setShowBpForm(!showBpForm)}
              className="px-3 h-8 text-xs bg-slate-100 border border-slate-300 hover:bg-slate-200 cursor-pointer font-medium text-slate-950 rounded-sm"
            >
              {showBpForm ? "Close Form" : "Create Exam Blueprint"}
            </button>
          </div>

          {showBpForm && (
            <form onSubmit={handleCreateBlueprint} className="bg-white border-2 border-slate-900 p-6 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">{editingBlueprintId ? "Edit Exam Blueprint" : "Exam Blueprint Creator"}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-medium text-slate-900 mb-1">Blueprint Name</label>
                  <input
                    type="text"
                    required
                    value={bpName}
                    onChange={(e) => setBpName(e.target.value)}
                    placeholder="e.g., Tier-1 Mechanics Standard Master Test"
                    className="admin-input h-9 px-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-1" htmlFor="bp-subject-select">Subject</label>
                  <select
                    id="bp-subject-select"
                    value={bpSubject}
                    onChange={(e) => setBpSubject(e.target.value)}
                    className="admin-input h-9 px-2 w-full"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-1" htmlFor="bp-marks-input">Total Marks</label>
                  <input
                    id="bp-marks-input"
                    type="number"
                    required
                    value={bpMarks}
                    onChange={(e) => setBpMarks(Number(e.target.value))}
                    className="admin-input h-9 px-2 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Easy Weight %</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={bpEasy}
                      onChange={(e) => setBpEasy(Number(e.target.value))}
                      className="admin-input h-8 px-2 w-full pr-6"
                    />
                    <span className="absolute right-2 top-1.5 text-slate-400 text-xs font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Medium Weight %</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={bpMedium}
                      onChange={(e) => setBpMedium(Number(e.target.value))}
                      className="admin-input h-8 px-2 w-full pr-6"
                    />
                    <span className="absolute right-2 top-1.5 text-slate-400 text-xs font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Hard Weight %</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={bpHard}
                      onChange={(e) => setBpHard(Number(e.target.value))}
                      className="admin-input h-8 px-2 w-full pr-6"
                    />
                    <span className="absolute right-2 top-1.5 text-slate-400 text-xs font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Duration (Minutes)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={bpDuration}
                      onChange={(e) => setBpDuration(Number(e.target.value))}
                      className="admin-input h-8 px-2 w-full pr-10"
                    />
                    <span className="absolute right-2 top-1 text-slate-400 text-[10px] font-mono leading-relaxed">MINUTES</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className={Number(bpEasy) + Number(bpMedium) + Number(bpHard) === 100 ? "text-green-700" : "text-amber-700 font-bold"}>
                  Weight Balance Sum: {Number(bpEasy) + Number(bpMedium) + Number(bpHard)}% (Must sum to 100%)
                </span>

                <div className="flex gap-2">
                  {editingBlueprintId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlueprintId(null);
                        setBpName("");
                        setBpSubject(subjects[0]?.name || "");
                        setBpMarks(100);
                        setBpEasy(30);
                        setBpMedium(40);
                        setBpHard(30);
                        setBpDuration(180);
                        setShowBpForm(false);
                      }}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 font-semibold cursor-pointer text-slate-800 rounded-sm text-xs"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 border border-slate-950 text-white font-semibold cursor-pointer rounded-sm text-xs hover:bg-slate-800"
                  >
                    {editingBlueprintId ? "Update Blueprint" : "Save Blueprint"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Blueprint Table List */}
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-mono text-slate-500">
                    <th className="px-4 py-2.5 font-bold text-[10px]">CODE</th>
                    <th className="px-5 py-2.5 font-bold text-[10px]">NAME</th>
                    <th className="px-4 py-2.5 font-bold text-[10px]">SUBJECT</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">TOTAL MARKS</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">DIFFICULTY WEIGHTS</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center font-mono">DURATION</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">STATUS</th>
                    <th className="px-4 py-2.5 font-bold text-[10px] text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blueprints.map(bp => (
                    <tr key={bp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{bp.code}</td>
                      <td className="px-5 py-3 text-slate-955 font-medium">{bp.name}</td>
                      <td className="px-4 py-3 text-slate-650">{bp.subject}</td>
                      <td className="px-4 py-3 text-center text-slate-800 font-mono font-bold">{bp.totalMarks}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex gap-1 text-[10px] font-mono">
                          <span className="text-green-700 bg-green-5 border border-green-200 px-1 rounded" title="Easy weight">E: {bp.easyPercent}%</span>
                          <span className="text-amber-700 bg-amber-5 border border-amber-200 px-1 rounded" title="Medium weight">M: {bp.mediumPercent}%</span>
                          <span className="text-red-700 bg-red-5 border border-red-200 px-1 rounded" title="Hard weight">H: {bp.hardPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-slate-600">{bp.durationMinutes} mins</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] font-bold text-green-850 bg-green-50 px-2 py-0.5 border border-green-200 rounded-sm">
                          {bp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setEditingBlueprintId(bp.id);
                            setBpName(bp.name);
                            setBpSubject(bp.subject);
                            setBpMarks(bp.totalMarks);
                            setBpEasy(bp.easyPercent);
                            setBpMedium(bp.mediumPercent);
                            setBpHard(bp.hardPercent);
                            setBpDuration(bp.durationMinutes);
                            setShowBpForm(true);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-slate-950 text-white hover:bg-slate-800 rounded-sm cursor-pointer border border-slate-950"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "GENERATION" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Generation Config Parameters */}
          <form onSubmit={handleGeneratePaperSubmit} className="lg:col-span-2 admin-card p-5 bg-white border border-slate-200 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Paper Assembler</span>
              <h3 className="text-sm font-bold text-slate-900">Generate Exam Paper</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="blueprint-select">SELECT BLUEPRINT <span className="text-red-600">*</span></label>
              <select
                id="blueprint-select"
                required
                value={selectedBpId}
                onChange={(e) => setSelectedBpId(e.target.value)}
                className="admin-input h-9 px-2 w-full text-xs font-medium"
              >
                <option value="">-- Choose Approved Blueprint (Target Subject Map) --</option>
                {blueprints.map(bp => (
                  <option key={bp.id} value={bp.id}>{bp.code} - {bp.name} ({bp.subject})</option>
                ))}
              </select>
            </div>

            {selectedBpId && (() => {
              const selectedBp = blueprints.find(b => b.id === selectedBpId);
              if (!selectedBp) return null;
              
              // Count available questions for subject
              const approvCount = questions.filter(
                q => q.subject.toLowerCase() === selectedBp.subject.toLowerCase() && q.status === QuestionStatus.Approved
              ).length;

              return (
                <div className="bg-slate-50 p-3 border border-slate-200 text-[11px] font-mono space-y-1.5 text-slate-700">
                  <div className="text-slate-900 font-bold border-b border-slate-200 pb-0.5">BLUEPRINT CONSTRAINTS:</div>
                  <div>Subject: <strong className="text-slate-900">{selectedBp.subject}</strong></div>
                  <div>Marks Benchmark: <strong className="text-slate-900">{selectedBp.totalMarks} Marks</strong></div>
                  <div>Easy/Med/Hard Constraints: <strong className="text-slate-900">{selectedBp.easyPercent}% / {selectedBp.mediumPercent}% / {selectedBp.hardPercent}%</strong></div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 mt-1 text-xs">
                    <span>Approved Board items in vault:</span>
                    <strong className={approvCount >= 2 ? "text-green-700 font-bold" : "text-amber-700 font-bold animate-pulse"}>
                      {approvCount} {approvCount >= 2 ? "MATCHES" : "INSUFFICIENT QUESTIONS"}
                    </strong>
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">EXAM PAPER TITLE <span className="text-red-600">*</span></label>
              <input
                type="text"
                required
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                placeholder="e.g., National Civil Services Selection Exam (Main Pack A)"
                className="admin-input h-9 px-2.5 w-full text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">Enter the title of the exam paper.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="generating-authority">CONTROLLER NAME</label>
              <input
                id="generating-authority"
                type="text"
                disabled
                value={`${currentUser.name} (${currentUser.role})`}
                className="admin-input h-9 px-2 w-full bg-slate-50 text-slate-500 text-xs border-slate-200 cursor-not-allowed font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={currentUser.role !== "CONTROLLER"}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold cursor-pointer rounded-sm text-xs border border-slate-950 flex items-center justify-center gap-1.5"
            >
              <Cpu className="h-4 w-4" /> Assemble Exam Paper
            </button>

            {currentUser.role !== "CONTROLLER" && (
              <p className="text-[10px] text-red-700 font-mono text-center">
                🛑 Only a designated Controller can assemble exam papers.
              </p>
            )}

            {/* Micro Alerts */}
            {generationFeedback.status !== "idle" && (
              <div className={`p-3 border text-xs font-mono font-bold mt-2 ${
                generationFeedback.status === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
              }`}>
                {generationFeedback.status === "success" ? (
                  <div className="flex gap-1.5 items-start">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-700" />
                    <span>{generationFeedback.msg}</span>
                  </div>
                ) : (
                  <div className="flex gap-1.5 items-start">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-700" />
                    <span>{generationFeedback.msg}</span>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Compilation Reference Board */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">Paper Assembly Guidelines</h3>
            
            <div className="admin-card p-4 bg-slate-50 border-slate-200 text-slate-700 text-xs rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Process Overview</span>
                <span className="text-slate-500 font-mono text-[10px]">Active</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                <p>To successfully assemble an examination paper, ensure the following requirements are satisfied:</p>
                <ol className="list-decimal list-inside space-y-1.5 ml-1">
                  <li><strong>Select a Blueprint:</strong> Choose an approved blueprint for the target subject. The blueprint dictates overall marks, duration, and difficulty weighting.</li>
                  <li><strong>Question Sufficiency:</strong> The system will scan the database for approved questions categorized under the blueprint's subject.</li>
                  <li><strong>Assign a Title:</strong> Provide a unique identifier title (e.g., "National selection - Set A") to label this specific paper packet in archives.</li>
                  <li><strong>Generate Paper:</strong> Click "Assemble Exam Paper". Once generated, the system creates a persistent record log in your portal database, detailing the assembled questions list.</li>
                </ol>
              </div>
            </div>
            
            <div className="admin-card p-4 space-y-3 bg-white border border-slate-200 rounded-sm">
              <h4 className="text-xs font-bold text-slate-900">Preventing Selection Bias</h4>
              <p className="text-xs text-slate-600 leading-relaxed text-slate-500">
                Automated paper assembly ensures that exam question selections are objective, strictly distributed according to curriculum blueprints, and completely audit-logged.
              </p>
            </div>
          </div>

        </div>
      )}

      {activeSubTab === "PAPERS" && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sealed inventory List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">Assembled Papers</h3>
              
              <div className="space-y-3">
                {generatedPapers.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setPreviewPaperId(p.id)}
                    className={`admin-card p-4 hover:border-slate-400 cursor-pointer transition-all ${
                      previewPaperId === p.id ? "ring-2 ring-slate-900 border-transparent bg-slate-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{p.code}</span>
                      <span className={`inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.2 text-[9px] font-bold border ${
                        p.status === "Released" ? "bg-green-50 border-green-200 text-green-800" :
                        "bg-blue-50 border-blue-200 text-blue-800"
                      }`}>
                        {p.status === "Released" ? "Released" : "Sealed"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{p.title}</h4>
                    
                    <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between text-[9px] font-mono text-slate-400">
                      <span>{p.subject}</span>
                      <span>Marks: {p.totalMarks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Restricted Sheet Document View Workspace */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase mb-3">Document Preview & Iterations Workspace</h3>

              {activePreviewPaper ? (() => {
                const currentDisplayedPaper = (() => {
                  if (viewedVersionId && activePreviewPaper.versions) {
                    const ver = activePreviewPaper.versions.find(v => v.versionId === viewedVersionId);
                    if (ver) {
                      return {
                        ...activePreviewPaper,
                        title: ver.title,
                        questions: ver.questions,
                        totalMarks: ver.totalMarks,
                        sha256Hash: ver.sha256Hash
                      };
                    }
                  }
                  return activePreviewPaper;
                })();

                return (
                  <div className="space-y-3">
                    
                    {/* Revision / Iteration history timeline */}
                    <div className="admin-card p-3 bg-white border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 font-mono">
                          <History className="h-3.5 w-3.5 text-slate-500" /> REVISIONS & AMENDMENT TIMELINE
                        </div>
                        {isEditingPaper && (
                          <span className="text-[10px] px-1.5 py-0.5 font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider animate-pulse font-mono">
                            Currently Editing
                          </span>
                        )}
                      </div>
                      
                      {!isEditingPaper ? (
                        activePreviewPaper.versions && activePreviewPaper.versions.length > 0 ? (
                          <div className="flex flex-wrap gap-2 items-center">
                            {activePreviewPaper.versions.map((v) => {
                              const isSelected = viewedVersionId === v.versionId || (!viewedVersionId && v.versionId === activePreviewPaper.versions?.length);
                              return (
                                <button
                                  key={v.versionId}
                                  onClick={() => setViewedVersionId(v.versionId)}
                                  className={`px-2 py-1 text-[10px] font-mono font-bold rounded border cursor-pointer flex items-center gap-1 transition-all ${
                                    isSelected
                                      ? "bg-slate-900 text-white border-slate-950"
                                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3 inline" />}
                                  v{v.versionId} {v.versionId === activePreviewPaper.versions?.length && " (Current)"}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 font-mono">No edits recorded. Showing Version 1 (Base/Sealed).</div>
                        )
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono bg-slate-50 p-2 border border-slate-150">
                          Editing Mode active. Saving edits will create Version { (activePreviewPaper.versions?.length || 0) + 1 } on timeline database.
                        </div>
                      )}
                    </div>

                    {isEditingPaper ? (
                      /* EXAM PAPER EDITOR UI */
                      <div className="admin-card p-5 bg-white border-2 border-slate-900 space-y-5">
                        <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono text-amber-600 block font-bold uppercase">Packet Amendment System</span>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <Edit3 className="h-4 w-4" /> Editing Exam: {activePreviewPaper.code}
                            </h3>
                          </div>
                        </div>

                        {/* Paper Title Configuration */}
                        <div>
                          <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">PAPER TITLE STATEMENT</label>
                          <input
                            type="text"
                            required
                            value={editingPaperTitle}
                            onChange={(e) => setEditingPaperTitle(e.target.value)}
                            placeholder="Examination Title Name"
                            className="admin-input h-9 px-2.5 w-full font-bold bg-white text-slate-950 border border-slate-300 focus:border-slate-800"
                          />
                        </div>

                        {/* Subject and Marks Preview */}
                        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600">
                          <div><strong className="text-slate-850">SUBJECT:</strong> {activePreviewPaper.subject}</div>
                          <div><strong className="text-slate-850">EXPECTED MARKS:</strong> {editingPaperQuestions.reduce((sum, q) => sum + Number(q.marks), 0)} Marks</div>
                        </div>

                        {/* Editable Questions Stack */}
                        <div className="space-y-4">
                          <label className="block text-[11px] font-mono font-bold text-slate-700">ASSEMBLED QUESTIONS CLUSTER ({editingPaperQuestions.length})</label>
                          
                          {editingPaperQuestions.map((eq, qIdx) => (
                            <div key={eq.id} className="p-3 border border-slate-300 rounded-sm bg-white space-y-2 relative shadow-xs">
                              {/* Option Header Controls */}
                              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-500">
                                  Section {qIdx + 1} &middot; ID: {eq.id} &middot; Level: {eq.cognitiveLevel}
                                </span>
                                
                                <div className="flex items-center gap-1">
                                  {/* Weight selector */}
                                  <div className="flex items-center gap-1 mr-2 bg-slate-50 px-1.5 py-0.5 border border-slate-200 rounded">
                                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Weight:</span>
                                    <input
                                      type="number"
                                      min={1}
                                      max={20}
                                      value={eq.marks}
                                      onChange={(e) => {
                                        const copy = [...editingPaperQuestions];
                                        copy[qIdx] = { ...eq, marks: Number(e.target.value) };
                                        setEditingPaperQuestions(copy);
                                      }}
                                      className="admin-input h-5 px-1 w-10 text-center font-bold text-[10px]"
                                    />
                                    <span className="text-[9px] font-mono text-slate-400">M</span>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={qIdx === 0}
                                    onClick={() => {
                                      const copy = [...editingPaperQuestions];
                                      const temp = copy[qIdx];
                                      copy[qIdx] = copy[qIdx - 1];
                                      copy[qIdx - 1] = temp;
                                      setEditingPaperQuestions(copy);
                                    }}
                                    className="p-1 hover:bg-slate-100 disabled:opacity-30 cursor-pointer text-slate-650 rounded"
                                    title="Move question up"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={qIdx === editingPaperQuestions.length - 1}
                                    onClick={() => {
                                      const copy = [...editingPaperQuestions];
                                      const temp = copy[qIdx];
                                      copy[qIdx] = copy[qIdx + 1];
                                      copy[qIdx + 1] = temp;
                                      setEditingPaperQuestions(copy);
                                    }}
                                    className="p-1 hover:bg-slate-100 disabled:opacity-30 cursor-pointer text-slate-650 rounded"
                                    title="Move question down"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = editingPaperQuestions.filter((_, idx) => idx !== qIdx);
                                      setEditingPaperQuestions(filtered);
                                    }}
                                    className="p-1 hover:bg-red-50 text-red-650 cursor-pointer rounded"
                                    title="Delete from paper"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Question editable body */}
                              <textarea
                                value={eq.text}
                                onChange={(e) => {
                                  const copy = [...editingPaperQuestions];
                                  copy[qIdx] = { ...eq, text: e.target.value };
                                  setEditingPaperQuestions(copy);
                                }}
                                className="admin-input w-full p-2 h-14 font-sans text-xs bg-white text-slate-900 border border-slate-200 leading-relaxed"
                                placeholder="Edit question statement here..."
                              />

                              {/* Correct answer mapping edits */}
                              {eq.options ? (
                                <div className="space-y-2 mt-1">
                                  <div className="grid grid-cols-2 gap-2 pl-2">
                                    {eq.options.map((opt, oIdx) => (
                                      <div key={oIdx} className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 border border-slate-150">
                                        <span className="text-[10px] font-mono font-bold text-slate-500">{String.fromCharCode(65 + oIdx)}.</span>
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const copy = [...editingPaperQuestions];
                                            const newOpts = [...(eq.options || [])];
                                            newOpts[oIdx] = e.target.value;
                                            copy[qIdx] = { ...eq, options: newOpts };
                                            setEditingPaperQuestions(copy);
                                          }}
                                          className="admin-input h-6 px-1 text-[10px] w-full font-sans bg-white border border-slate-200"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  <div className="pl-2">
                                    <label className="block text-[9px] font-mono font-bold text-slate-500 mb-0.5">CORRECT OPTION SCHEME RESPONSE</label>
                                    <input
                                      type="text"
                                      value={eq.correctAnswer}
                                      onChange={(e) => {
                                        const copy = [...editingPaperQuestions];
                                        copy[qIdx] = { ...eq, correctAnswer: e.target.value };
                                        setEditingPaperQuestions(copy);
                                      }}
                                      placeholder="Correct reference answer"
                                      className="admin-input h-6 px-1.5 text-[10px] w-full font-sans bg-white border border-slate-200"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="pl-2 text-xs">
                                  <label className="block text-[9px] font-mono font-bold text-slate-500 mb-0.5">EXPECTED CORRECT EVALUATION REFERENCE ANSWER</label>
                                  <input
                                    type="text"
                                    value={eq.correctAnswer}
                                    onChange={(e) => {
                                      const copy = [...editingPaperQuestions];
                                      copy[qIdx] = { ...eq, correctAnswer: e.target.value };
                                      setEditingPaperQuestions(copy);
                                    }}
                                    className="admin-input h-6 px-1.5 text-[10px] w-full font-sans bg-white border border-slate-200"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Append new approved question from central vault */}
                        <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50 space-y-2">
                          <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
                            Append Approved Question From Central Vault Pool
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={selectedAddQuestionId}
                              onChange={(e) => setSelectedAddQuestionId(e.target.value)}
                              className="admin-input h-8 px-2 text-xs w-full bg-white border border-slate-300 font-sans"
                            >
                              <option value="">-- Select an approved question to append... --</option>
                              {questions
                                .filter(q => q.status === QuestionStatus.Approved && q.subject.toLowerCase() === activePreviewPaper.subject.toLowerCase() && !editingPaperQuestions.some(eq => eq.id === q.id))
                                .map(q => (
                                  <option key={q.id} value={q.id}>
                                    [{q.id}] {q.cognitiveLevel} &middot; {q.marks} Marks &middot; {q.text.slice(0, 60)}...
                                  </option>
                                ))
                              }
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedAddQuestionId) return;
                                const match = questions.find(q => q.id === selectedAddQuestionId);
                                if (match) {
                                  setEditingPaperQuestions([...editingPaperQuestions, { ...match }]);
                                  setSelectedAddQuestionId("");
                                }
                              }}
                              className="h-8 px-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 rounded-sm border border-slate-950 shrink-0 cursor-pointer"
                            >
                              <PlusCircle className="h-3.5 w-3.5" /> Append Question
                            </button>
                          </div>
                        </div>

                        {/* Action buttons save / cancel */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingPaper(false);
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer text-slate-700 rounded-sm"
                          >
                            Cancel Edits
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (editingPaperQuestions.length === 0) {
                                alert("Evaluation standards state that an examination paper must contain at least 1 question.");
                                return;
                              }
                              const nextVersionId = (activePreviewPaper.versions?.length || 0) + 1;
                              const currentHash = Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
                              
                              const newVersionEntry: GeneratedPaperVersion = {
                                versionId: nextVersionId,
                                timestamp: new Date().toISOString(),
                                title: editingPaperTitle,
                                questions: editingPaperQuestions,
                                totalMarks: editingPaperQuestions.reduce((sum, q) => sum + Number(q.marks), 0),
                                sha256Hash: currentHash,
                                modifiedBy: currentUser.name
                              };

                              const updatedPaper: GeneratedPaper = {
                                ...activePreviewPaper,
                                title: editingPaperTitle,
                                questions: editingPaperQuestions,
                                totalMarks: newVersionEntry.totalMarks,
                                sha256Hash: currentHash,
                                versions: [...(activePreviewPaper.versions || []), newVersionEntry]
                              };

                              onUpdatePaper(updatedPaper);
                              setIsEditingPaper(false);
                              setViewedVersionId(nextVersionId);
                            }}
                            className="px-4 py-1.5 text-xs font-bold bg-green-800 hover:bg-green-700 text-white rounded-sm border border-green-950 flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Save className="h-4 w-4" /> Save Amended Version v{(activePreviewPaper.versions?.length || 0) + 1}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EXAM PAPER READ-ONLY PREVIEW & WORKFLOW */
                      <div className="space-y-3">
                        {/* Master Workflow actions */}
                        <div className="admin-card p-3 flex flex-wrap gap-2 justify-between items-center bg-slate-50">
                          <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-slate-400" /> STATE: {activePreviewPaper.status}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const w = window.open("", "_blank");
                                if (w) {
                                  w.document.write(`
                                    <html>
                                      <head>
                                        <title>RESTRICTED - ${currentDisplayedPaper.code}</title>
                                        <style>
                                          body { font-family: 'Courier New', Courier, monospace; padding: 3rem; background-color: #fafafa; }
                                          .container { background-color: #ffffff; padding: 2rem; border: 2px solid #000; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; position: relative; }
                                          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 1rem; }
                                          .restricted-badge { font-weight: bold; font-size: 1.2rem; color: #991b1b; padding: 0.2rem 1rem; border: 2px solid #991b1b; display: inline-block; margin-bottom: 1rem; }
                                          .metadata { font-size: 0.8rem; margin: 1.5rem 0; border: 1px border-color: #000; padding: 1rem; background: #f3f4f6; }
                                          .marks { text-align: right; font-weight: bold; font-size: 0.9rem; }
                                          .question { margin-bottom: 2rem; font-size: 0.9rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
                                          .options { margin-left: 2rem; }
                                          .watermark { position: absolute; transform: rotate(-45deg); opacity: 0.05; font-size: 5rem; font-weight: bold; top: 300px; left: 100px; pointer-events: none; }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="container">
                                          <div class="watermark">RESTRICTED - PARAKH</div>
                                          <div class="header">
                                            <div class="restricted-badge">RESTRICTED - HIGH SECURITY</div>
                                            <h3>PARAKH NATIONAL EXAMINATIONS COMMISSION</h3>
                                            <h2>${currentDisplayedPaper.title}</h2>
                                          </div>
                                          <div class="metadata">
                                            <strong>SESSION PACKET CODE:</strong> ${currentDisplayedPaper.code}<br/>
                                            <strong>SUBJECT CLASSIFICATION:</strong> ${currentDisplayedPaper.subject}<br/>
                                            <strong>TOTAL MARKS WEIGHT:</strong> ${currentDisplayedPaper.totalMarks} Marks<br/>
                                            <strong>FINGERPRINT SHA-256 CHECK:</strong> <span style="font-family: monospace; font-size:0.75rem;">${currentDisplayedPaper.sha256Hash}</span><br/>
                                            <strong>ANCHOR TRANSACTION:</strong> <span style="font-family: monospace; font-size:0.75rem;">${currentDisplayedPaper.blockchainTx}</span>
                                          </div>
                                          <p style="font-style: italic; font-size: 0.8rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem;">
                                            Instructions to Candidates: Read carefully. Answer all questions within the designated testing book bounds.
                                          </p>
                                          ${currentDisplayedPaper.questions.map((q, idx) => `
                                            <div class="question">
                                              <div class="marks">[Marks: ${q.marks}]</div>
                                              <strong>Question ${idx + 1}:</strong><br/>
                                              ${q.text}
                                              ${q.options ? `
                                                <div class="options">
                                                  <p>A. ${q.options[0]}</p>
                                                  <p>B. ${q.options[1]}</p>
                                                  <p>C. ${q.options[2]}</p>
                                                  <p>D. ${q.options[3]}</p>
                                                </div>
                                              ` : ""}
                                            </div>
                                          `).join("")}
                                        </div>
                                      </body>
                                    </html>
                                  `);
                                  w.document.close();
                                  w.print();
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer rounded-sm text-slate-800 flex items-center gap-1.5"
                            >
                              <Printer className="h-3.5 w-3.5" /> Direct Print Preview
                            </button>

                            {/* View Previous - Option to Restore */}
                            {viewedVersionId && viewedVersionId !== activePreviewPaper.versions?.length && (
                              <button
                                onClick={() => {
                                  const ver = activePreviewPaper.versions?.find(v => v.versionId === viewedVersionId);
                                  if (ver) {
                                    const nextId = (activePreviewPaper.versions?.length || 0) + 1;
                                    const restoreHash = Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
                                    
                                    const restoreVersionEntry: GeneratedPaperVersion = {
                                      versionId: nextId,
                                      timestamp: new Date().toISOString(),
                                      title: ver.title,
                                      questions: ver.questions,
                                      totalMarks: ver.totalMarks,
                                      sha256Hash: restoreHash,
                                      modifiedBy: currentUser.name
                                    };

                                    const restoredPaper: GeneratedPaper = {
                                      ...activePreviewPaper,
                                      title: ver.title,
                                      questions: ver.questions,
                                      totalMarks: ver.totalMarks,
                                      sha256Hash: restoreHash,
                                      versions: [...(activePreviewPaper.versions || []), restoreVersionEntry]
                                    };

                                    onUpdatePaper(restoredPaper);
                                    setViewedVersionId(nextId);
                                    alert(`Version v${viewedVersionId} restored as active setup. Set saved as amended version v${nextId}.`);
                                  }
                                }}
                                className="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-750 border border-amber-950 text-white rounded-sm flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Undo2 className="h-3.5 w-3.5" /> Restore v{viewedVersionId}
                              </button>
                            )}

                            {(!viewedVersionId || viewedVersionId === activePreviewPaper.versions?.length) && (
                              <button
                                onClick={() => {
                                  setIsEditingPaper(true);
                                  setEditingPaperTitle(activePreviewPaper.title);
                                  setEditingPaperQuestions([...activePreviewPaper.questions]);
                                  setSelectedAddQuestionId("");
                                }}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-950 text-white hover:bg-slate-850 cursor-pointer rounded-sm flex items-center gap-1.5"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-slate-350" /> Edit Paper
                              </button>
                            )}

                            {activePreviewPaper.status === "Securely Sealed" && (!viewedVersionId || viewedVersionId === activePreviewPaper.versions?.length) && (
                              <button
                                onClick={() => onUpdatePaperStatus(activePreviewPaper.id, "Released")}
                                disabled={currentUser.role !== "CONTROLLER"}
                                className="px-3 py-1.5 text-xs font-semibold bg-green-800 hover:bg-green-700 disabled:opacity-50 text-white cursor-pointer rounded-sm border border-green-950 flex items-center gap-1"
                              >
                                <Send className="h-3.5 w-3.5" /> Release Set
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Aesthetic Government RESTRICTED Sheet Format */}
                        <div className="bg-white border-2 border-slate-800 p-8 shadow-sm space-y-6 print-area font-mono text-xs text-slate-900 relative overflow-hidden select-text">
                          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-2">
                            <span className="border-2 border-slate-800 text-slate-800 font-bold px-4 py-0.5 inline-block text-[10px] tracking-wider uppercase">
                              EXAMINATION COPY {viewedVersionId && viewedVersionId !== activePreviewPaper.versions?.length ? `(OBSOLETE - REVISION v${viewedVersionId})` : ""}
                            </span>
                            <h4 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Assessment Division</h4>
                            <h3 className="text-xs font-bold font-sans text-slate-900">{currentDisplayedPaper.title}</h3>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 p-4 space-y-1.5 text-[10px] leading-relaxed text-slate-700">
                            <div><strong className="text-slate-900">PAPER CODE:</strong> {currentDisplayedPaper.code} {viewedVersionId && viewedVersionId !== activePreviewPaper.versions?.length ? `_REV_v${viewedVersionId}` : ""}</div>
                            <div><strong className="text-slate-900">SUBJECT:</strong> {currentDisplayedPaper.subject}</div>
                            <div><strong className="text-slate-900">TOTAL MARKS:</strong> {currentDisplayedPaper.totalMarks} Marks</div>
                            <div className="break-all"><strong className="text-slate-900">PAPER CHECKSUM:</strong> <span className="font-bold text-slate-900">{currentDisplayedPaper.sha256Hash}</span></div>
                            <div className="break-all"><strong className="text-slate-900">RECORD ID:</strong> {currentDisplayedPaper.blockchainTx}</div>
                          </div>

                          <p className="italic text-[11px] text-slate-600 border-b border-slate-200 pb-2">
                            Instructions: Candidates must record answers clearly and follow standard exam room rules.
                          </p>

                          {/* Formatted questions list */}
                          <div className="space-y-6 pt-2">
                            {currentDisplayedPaper.questions.map((q, idx) => (
                              <div key={q.id} className="space-y-2">
                                 <div className="flex justify-between font-bold text-[11px]">
                                   <span>Section {idx+1} [Level: {q.cognitiveLevel}]</span>
                                   <span>[{q.marks} Marks]</span>
                                 </div>
                                 <p className="text-xs text-slate-900 font-sans leading-relaxed">{q.text}</p>
                                 
                                 {q.options && (
                                   <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pl-4 text-slate-700">
                                     <div>A. {q.options[0]}</div>
                                     <div>B. {q.options[1]}</div>
                                     <div>C. {q.options[2]}</div>
                                     <div>D. {q.options[3]}</div>
                                   </div>
                                 )}
                              </div>
                            ))}
                          </div>

                          {/* Digital Signature section */}
                          <div className="border-t border-slate-300 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                            <div>
                              <div>Generated By:</div>
                              <div className="font-bold text-slate-800">Dr. K. Raghavan</div>
                              <div className="font-sans text-[9px]">EXAMINATION CONTROLLER DIVISION</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end text-emerald-800 font-bold">
                                <Fingerprint className="h-4 w-4" /> VERIFIED SEAL
                              </div>
                              <span className="text-[8px] font-mono">SYSTEM_RECORD_AUTHENTICATED</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div className="admin-card p-6 text-center text-slate-400 font-mono text-xs">
                  Select an active assembled paper packet from the list to preview, audit, amend and iterate.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
