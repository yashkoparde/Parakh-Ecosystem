/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Question, QuestionStatus, Difficulty, CognitiveLevel, AdminUser, Subject } from "../types";
import { Plus, Search, Filter, CheckCircle2, XCircle, FileSpreadsheet, Lock, AlertTriangle, FileCheck, Check, CornerDownRight } from "lucide-react";

interface DronaModuleProps {
  questions: Question[];
  subjects: Subject[];
  currentUser: AdminUser;
  onAddQuestion: (q: Omit<Question, "id" | "code" | "createdAt" | "createdBy">) => void;
  onUpdateQuestionStatus: (id: string, status: QuestionStatus, auditReason: string) => void;
  auditLogs: { timestamp: string; actionDetails: string; userEmail: string }[];
}

export default function DronaModule({
  questions,
  subjects,
  currentUser,
  onAddQuestion,
  onUpdateQuestionStatus,
  auditLogs
}: DronaModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"BANK" | "APPROVALS" | "AUDIT">("BANK");

  // Filters
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [cognitiveFilter, setCognitiveFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New Question Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formText, setFormText] = useState("");
  const [formSubject, setFormSubject] = useState(subjects[0]?.name || "");
  const [formCognitive, setFormCognitive] = useState<CognitiveLevel>(CognitiveLevel.Knowledge);
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [formMarks, setFormMarks] = useState<number>(4);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState("");
  const [formExplanation, setFormExplanation] = useState("");
  const [isFormMcq, setIsFormMcq] = useState(true);
  const [mcqOptionA, setMcqOptionA] = useState("");
  const [mcqOptionB, setMcqOptionB] = useState("");
  const [mcqOptionC, setMcqOptionC] = useState("");
  const [mcqOptionD, setMcqOptionD] = useState("");
  const [mcqSchemeType, setMcqSchemeType] = useState<"SINGLE" | "MULTI">("SINGLE");
  const [selectedMcqCorrects, setSelectedMcqCorrects] = useState<string[]>(["A"]);
  const [formWorkflowStatus, setFormWorkflowStatus] = useState<QuestionStatus>(QuestionStatus.PendingReview);

  // Auto-synthesize correct answer dynamically for MCQ options
  useEffect(() => {
    if (isFormMcq) {
      const optionMap: Record<string, string> = {
        A: mcqOptionA,
        B: mcqOptionB,
        C: mcqOptionC,
        D: mcqOptionD
      };

      const correctTexts = selectedMcqCorrects
        .map(letter => {
          const text = optionMap[letter]?.trim() || "";
          return text ? `${letter}. ${text}` : "";
        })
        .filter(t => t !== "");

      if (correctTexts.length > 0) {
        setFormCorrectAnswer(correctTexts.join(" | "));
      } else {
        setFormCorrectAnswer("");
      }
    }
  }, [isFormMcq, mcqSchemeType, selectedMcqCorrects, mcqOptionA, mcqOptionB, mcqOptionC, mcqOptionD]);

  const handleToggleCorrectOption = (letter: string) => {
    if (mcqSchemeType === "SINGLE") {
      setSelectedMcqCorrects([letter]);
    } else {
      if (selectedMcqCorrects.includes(letter)) {
        if (selectedMcqCorrects.length > 1) {
          setSelectedMcqCorrects(selectedMcqCorrects.filter(l => l !== letter));
        }
      } else {
        setSelectedMcqCorrects([...selectedMcqCorrects, letter].sort());
      }
    }
  };

  // Approval reason state
  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [approvalReason, setApprovalReason] = useState("");

  // Filter Logic
  const filteredQuestions = questions.filter(q => {
    if (subjectFilter !== "ALL" && q.subject !== subjectFilter) return false;
    if (difficultyFilter !== "ALL" && q.difficulty !== difficultyFilter) return false;
    if (cognitiveFilter !== "ALL" && q.cognitiveLevel !== cognitiveFilter) return false;
    if (statusFilter !== "ALL" && q.status !== statusFilter) return false;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchCode = q.code.toLowerCase().includes(query);
      const matchExplain = q.explanation.toLowerCase().includes(query);
      if (!matchText && !matchCode && !matchExplain) return false;
    }
    return true;
  });

  const pendingQuestions = questions.filter(q => q.status === QuestionStatus.PendingReview);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim() || !formCorrectAnswer.trim()) {
      alert("Error: Core question text and correct key are mandatory parameters.");
      return;
    }

    let options: string[] | undefined = undefined;
    if (isFormMcq) {
      if (!mcqOptionA || !mcqOptionB || !mcqOptionC || !mcqOptionD) {
        alert("Error: All 4 multiple choice options must be mapped for MCQ classification.");
        return;
      }
      options = [mcqOptionA, mcqOptionB, mcqOptionC, mcqOptionD];
    }

    onAddQuestion({
      text: formText,
      options,
      correctAnswer: formCorrectAnswer,
      explanation: formExplanation,
      subject: formSubject,
      cognitiveLevel: formCognitive,
      difficulty: formDifficulty,
      marks: Number(formMarks),
      status: formWorkflowStatus
    });

    // Reset Form
    setFormText("");
    setMcqOptionA("");
    setMcqOptionB("");
    setMcqOptionC("");
    setMcqOptionD("");
    setSelectedMcqCorrects(["A"]);
    setMcqSchemeType("SINGLE");
    setFormCorrectAnswer("");
    setFormExplanation("");
    setShowAddForm(false);
  };

  const handleActionClick = (id: string) => {
    setSelectedPendingId(id);
    setApprovalReason("");
  };

  const executeStatusChange = (status: QuestionStatus) => {
    if (!selectedPendingId) return;
    if (!approvalReason.trim()) {
      alert("Official review log note is required for verification audit trails.");
      return;
    }
    onUpdateQuestionStatus(selectedPendingId, status, approvalReason);
    setSelectedPendingId(null);
    setApprovalReason("");
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Question Bank & Review</h2>
          <p className="text-xs text-slate-500">Database for managing and reviewing national exam questions.</p>
        </div>
        
        {/* Toggle Panel Section Tabs */}
        <div className="flex gap-1 border border-slate-200 bg-slate-100 p-0.5 rounded-sm">
          <button
            onClick={() => { setActiveSubTab("BANK"); setShowAddForm(false); setSelectedPendingId(null); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded-sm ${activeSubTab === "BANK" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Question Bank ({questions.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("APPROVALS"); setShowAddForm(false); setSelectedPendingId(null); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer relative rounded-sm ${activeSubTab === "APPROVALS" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Review & Approvals
            {pendingQuestions.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                {pendingQuestions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveSubTab("AUDIT"); setShowAddForm(false); setSelectedPendingId(null); }}
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded-sm ${activeSubTab === "AUDIT" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            Activity Logs
          </button>
        </div>
      </div>

      {/* Main View Switch */}
      {activeSubTab === "BANK" && (
        <div className="space-y-4">
          
          {/* Top Filters & Controls */}
          <div className="admin-card p-4 flex flex-wrap gap-4 items-end justify-between">
            <div className="flex flex-wrap gap-3 items-end flex-1 min-w-[300px]">
              
              {/* Search */}
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1" htmlFor="search-input">SEARCH QUESTIONS</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search codes, statements, texts..."
                    className="admin-input h-9 w-full pl-8 pr-2"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1" htmlFor="subject-filter-select">SUBJECT</label>
                <select
                  id="subject-filter-select"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="admin-input h-9 px-2 min-w-[150px]"
                >
                  <option value="ALL">All Subjects</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1" htmlFor="difficulty-filter-select">DIFFICULTY</label>
                <select
                  id="difficulty-filter-select"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="admin-input h-9 px-2 min-w-[110px]"
                >
                  <option value="ALL">All Levels</option>
                  <option value={Difficulty.Easy}>{Difficulty.Easy}</option>
                  <option value={Difficulty.Medium}>{Difficulty.Medium}</option>
                  <option value={Difficulty.Hard}>{Difficulty.Hard}</option>
                </select>
              </div>

              {/* Cognitive Target */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1" htmlFor="cognitive-filter-select">COGNITIVE LEVEL</label>
                <select
                  id="cognitive-filter-select"
                  value={cognitiveFilter}
                  onChange={(e) => setCognitiveFilter(e.target.value)}
                  className="admin-input h-9 px-2 min-w-[120px]"
                >
                  <option value="ALL">All Targets</option>
                  <option value={CognitiveLevel.Knowledge}>{CognitiveLevel.Knowledge}</option>
                  <option value={CognitiveLevel.Understanding}>{CognitiveLevel.Understanding}</option>
                  <option value={CognitiveLevel.Application}>{CognitiveLevel.Application}</option>
                  <option value={CognitiveLevel.Analysis}>{CognitiveLevel.Analysis}</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1" htmlFor="status-filter-select">STATUS</label>
                <select
                  id="status-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-input h-9 px-2 min-w-[110px]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value={QuestionStatus.Draft}>{QuestionStatus.Draft}</option>
                  <option value={QuestionStatus.PendingReview}>{QuestionStatus.PendingReview}</option>
                  <option value={QuestionStatus.Approved}>{QuestionStatus.Approved}</option>
                  <option value={QuestionStatus.Rejected}>{QuestionStatus.Rejected}</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSubjectFilter("ALL");
                  setDifficultyFilter("ALL");
                  setCognitiveFilter("ALL");
                  setStatusFilter("ALL");
                  setSearchQuery("");
                }}
                className="px-3 h-9 text-xs border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer font-medium rounded-sm"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 h-9 text-xs bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium rounded-sm flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Question
              </button>
            </div>
          </div>

          {/* New Item Form Panel (Slid-down administrative form) */}
          {showAddForm && (
            <form onSubmit={handleSubmitQuestion} className="bg-white border-2 border-slate-900 p-6 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 block">PARAKH COMPLIANCE INTAKE FORM</span>
                <h3 className="text-base font-bold text-slate-900">Deposit New Question into Academic Vault</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Panel 1: Question Details */}
                <div className="space-y-4 md:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      QUESTION STIPULATION / STATEMENT <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      rows={3}
                      placeholder="Enter the precise, complete scientific or mathematical question statement."
                      className="admin-input w-full p-2.5 font-sans"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Official state examinations require rigorous terminology. Avoid generic phrasing.</p>
                  </div>

                  {/* MCQ Selector Tool */}
                  <div className="bg-slate-50 p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isFormMcq}
                          onChange={(e) => setIsFormMcq(e.target.checked)}
                          className="rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500"
                        />
                        Structure as Multiple-Choice Question (MCQ)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">ITEM-TYPE CLASSIFIER</span>
                    </div>

                    {isFormMcq && (
                      <div className="space-y-3 pt-1">
                        {/* Option Scheme Type selection */}
                        <div className="bg-white border border-slate-200 p-3 rounded-sm space-y-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">MCQ ANSWER SCHEME TYPE</span>
                          <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center gap-1.5 text-xs text-slate-900 cursor-pointer">
                              <input
                                type="radio"
                                name="mcqScheme"
                                checked={mcqSchemeType === "SINGLE"}
                                onChange={() => {
                                  setMcqSchemeType("SINGLE");
                                  setSelectedMcqCorrects(["A"]);
                                }}
                                className="text-slate-900 focus:ring-slate-500 h-3.5 w-3.5 border-slate-300 cursor-pointer"
                              />
                              Single Correct Option (Radio Selector)
                            </label>
                            <label className="inline-flex items-center gap-1.5 text-xs text-slate-900 cursor-pointer">
                              <input
                                type="radio"
                                name="mcqScheme"
                                checked={mcqSchemeType === "MULTI"}
                                onChange={() => {
                                  setMcqSchemeType("MULTI");
                                }}
                                className="text-slate-900 focus:ring-slate-500 h-3.5 w-3.5 border-slate-300 cursor-pointer"
                              />
                              Multiple Correct Options (Checkbox Selector)
                            </label>
                          </div>
                        </div>

                        {/* Interactive Option inputs with direct-selection tags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { key: "A", val: mcqOptionA, setter: setMcqOptionA },
                            { key: "B", val: mcqOptionB, setter: setMcqOptionB },
                            { key: "C", val: mcqOptionC, setter: setMcqOptionC },
                            { key: "D", val: mcqOptionD, setter: setMcqOptionD }
                          ].map(({ key, val, setter }) => {
                            const isChecked = selectedMcqCorrects.includes(key);
                            return (
                              <div key={key} className="space-y-1 bg-white p-3 border border-slate-200 shadow-2xs rounded-sm">
                                <div className="flex justify-between items-center mb-1.5 border-b border-slate-100 pb-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-550 block uppercase">Option {key}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCorrectOption(key)}
                                    className={`px-2 py-0.5 text-[9px] font-mono font-bold border rounded flex items-center gap-1 cursor-pointer transition-all ${
                                      isChecked
                                        ? "bg-slate-900 text-white border-slate-950"
                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100"
                                    }`}
                                  >
                                    {isChecked ? "✓ Correct Option Approved" : "Mark as Correct"}
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  required={isFormMcq}
                                  value={val}
                                  onChange={(e) => setter(e.target.value)}
                                  placeholder={`Enter statement option text for Choice ${key}...`}
                                  className="admin-input w-full h-8 px-2 text-xs font-sans bg-white text-slate-900 border border-slate-300"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1">
                        CORRECT MASTER KEY / REFERENCE ANSWER <span className="text-red-600">*</span>
                      </label>
                      {isFormMcq ? (
                        <div className="p-2.5 border border-slate-250 bg-slate-100/70 rounded-xs text-xs text-slate-700 font-mono flex items-center justify-between">
                          <span className="truncate max-w-[200px] font-bold text-slate-800">
                            {formCorrectAnswer || "Please select the correct option key..."}
                          </span>
                          <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 px-1 py-0.5 rounded uppercase tracking-wider">
                            Synced Auto-Key
                          </span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          required
                          value={formCorrectAnswer}
                          onChange={(e) => setFormCorrectAnswer(e.target.value)}
                          placeholder="Provide rigorous answer mapping metric."
                          className="admin-input w-full h-9 px-2 text-xs"
                        />
                      )}
                      <p className="text-[10px] text-slate-500 mt-1">Slight typos in manual keys will result in verification failure.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1">
                        ACADEMIC SOLUTION RATIONALE / EXPLANATION
                      </label>
                      <input
                        type="text"
                        value={formExplanation}
                        onChange={(e) => setFormExplanation(e.target.value)}
                        placeholder="Why is this answer scientifically and mathematically optimal?"
                        className="admin-input w-full h-9 px-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Panel 2: Mappings & Classifications */}
                <div className="space-y-4 bg-slate-50/70 p-4 border border-slate-200">
                  <div className="text-xs font-bold font-mono text-slate-700 tracking-wider uppercase border-b border-slate-200 pb-1 mb-2">
                    Academic Mapping
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="form-subject-select">ACADEMIC SUBJECT MATRIX</label>
                    <select
                      id="form-subject-select"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="admin-input w-full h-9 px-2 bg-white"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="form-cognitive-select">COGNITIVE COMPLIANCE LEVEL</label>
                    <select
                      id="form-cognitive-select"
                      value={formCognitive}
                      onChange={(e) => setFormCognitive(e.target.value as CognitiveLevel)}
                      className="admin-input w-full h-9 px-2 bg-white"
                    >
                      <option value={CognitiveLevel.Knowledge}>Knowledge Retention</option>
                      <option value={CognitiveLevel.Understanding}>Conceptual Understanding</option>
                      <option value={CognitiveLevel.Application}>Practical Application</option>
                      <option value={CognitiveLevel.Analysis}>Synthesis & Data Analysis</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="form-difficulty-select">DIFFICULTY RANK</label>
                      <select
                        id="form-difficulty-select"
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                        className="admin-input w-full h-9 px-2 bg-white"
                      >
                        <option value={Difficulty.Easy}>Easy</option>
                        <option value={Difficulty.Medium}>Medium</option>
                        <option value={Difficulty.Hard}>Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-950 mb-1" htmlFor="form-marks-input">EXAM MARKS WEIGHT</label>
                      <input
                        id="form-marks-input"
                        type="number"
                        min={1}
                        max={15}
                        required
                        value={formMarks}
                        onChange={(e) => setFormMarks(Number(e.target.value))}
                        className="admin-input w-full h-9 px-2 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1" htmlFor="form-workflow-select">SUBMISSION SECURITY WORKFLOW</label>
                    <select
                      id="form-workflow-select"
                      value={formWorkflowStatus}
                      onChange={(e) => setFormWorkflowStatus(e.target.value as QuestionStatus)}
                      className="admin-input w-full h-9 px-2 bg-white border-2 border-slate-300 font-medium"
                    >
                      <option value={QuestionStatus.PendingReview}>🔒 Sign and Submit for Peer Board Review</option>
                      <option value={QuestionStatus.Draft}>📁 Save as Offline Draft local copy</option>
                    </select>
                    <p className="text-[9px] text-slate-500 mt-1">Submitted questions lock state changes until Board Audit sign-off completes.</p>
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 bg-slate-50 -mx-6 -mb-6 p-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer rounded-sm"
                >
                  Cancel Entry
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer rounded-sm border border-slate-950"
                >
                  Commit Entry to Audit Queue
                </button>
              </div>
            </form>
          )}

          {/* Core Structured List Table */}
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                ITEM_GRID_VIEW ({filteredQuestions.length} catalog items fetched)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ENCRYPTED AT HANDLER ROOT</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono border-b border-slate-200">
                    <th className="px-4 py-2.5 font-semibold text-[10px]">ITEM CODE</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px]">SUBJECT MATRIX</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px]">QUESTION STATEMENT MOCK</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px]">COGNITIVE / TARGET</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px]">DIFFICULTY</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px] text-center">MARKS</th>
                    <th className="px-4 py-2.5 font-semibold text-[10px] text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-mono">
                        [ZERO_RECORDS_FOUND] No secure vault records match selection boundaries.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900 select-all whitespace-nowrap">{q.code}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{q.subject}</td>
                        <td className="px-4 py-3 text-slate-900 max-w-sm truncate" title={q.text}>{q.text}</td>
                        <td className="px-4 py-3">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] py-0.5 px-1.5 rounded font-mono font-medium">
                            {q.cognitiveLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold ${
                            q.difficulty === Difficulty.Hard ? "text-red-700" :
                            q.difficulty === Difficulty.Medium ? "text-amber-700" : "text-green-700"
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700 font-mono">{q.marks}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-bold border ${
                            q.status === QuestionStatus.Approved ? "bg-green-50 border-green-200 text-green-800" :
                            q.status === QuestionStatus.PendingReview ? "bg-amber-50 border-amber-200 text-amber-800" :
                            q.status === QuestionStatus.Rejected ? "bg-red-50 border-red-200 text-red-800" :
                            "bg-slate-100 border-slate-200 text-slate-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              q.status === QuestionStatus.Approved ? "bg-green-600" :
                              q.status === QuestionStatus.PendingReview ? "bg-amber-500" :
                              q.status === QuestionStatus.Rejected ? "bg-red-500" : "bg-slate-500"
                            }`} />
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[10px] text-slate-440 font-mono text-right flex justify-between">
              <span>Question Catalog Stream</span>
              <span>Showing {filteredQuestions.length} of {questions.length} entries</span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "APPROVALS" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm">
            <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase font-mono">
              <AlertTriangle className="h-4 w-4" /> Academic Review Guidelines
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Only designated academic auditors can approve questions for inclusion in the active exam paper pool. Every approval action is logged in the system audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Queue */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">Active Verification Docket ({pendingQuestions.length} items awaiting audit)</h3>
              
              {pendingQuestions.length === 0 ? (
                <div className="admin-card p-8 text-center text-slate-400 font-mono">
                  [EMPTY_DOCKET] All deposited questions have cleared boards.
                </div>
              ) : (
                pendingQuestions.map(q => (
                  <div
                    key={q.id}
                    onClick={() => handleActionClick(q.id)}
                    className={`admin-card p-4 hover:border-slate-400 cursor-pointer transition-all ${
                      selectedPendingId === q.id ? "ring-2 ring-slate-900 border-transparent bg-slate-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded">
                        {q.code}
                      </span>
                      <div className="flex gap-1.5">
                        <span className="badge-base bg-slate-100 border-slate-300 text-slate-600 font-mono">MARKS: {q.marks}</span>
                        <span className="badge-base bg-slate-100 border-slate-300 text-slate-600 font-mono">{q.difficulty}</span>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-900 mt-2 line-clamp-2">{q.text}</p>
                    
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Deposited By: {q.createdBy}</span>
                      <span>{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Audit/Action Workspace */}
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase mb-3">Review Panel</h3>

              {selectedPendingId ? (
                (() => {
                  const targetQuestion = questions.find(q => q.id === selectedPendingId);
                  if (!targetQuestion) return null;
                  return (
                    <div className="admin-card p-5 bg-white border-2 border-slate-900 space-y-4">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Selected Question</span>
                        <h4 className="text-xs font-bold text-slate-900 font-mono">{targetQuestion.code}</h4>
                        <div className="text-xs text-slate-600 font-mono mt-1">Subject: {targetQuestion.subject}</div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 block">PROPOSED TEXT:</span>
                        <p className="text-xs text-slate-900 bg-slate-50 p-2.5 border border-slate-200 max-h-32 overflow-y-auto font-sans leading-relaxed">
                          {targetQuestion.text}
                        </p>
                      </div>

                      {targetQuestion.options && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 block">MCQ OPTIONS:</span>
                          <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-100 p-2 font-mono">
                            <div>A: {targetQuestion.options[0]}</div>
                            <div>B: {targetQuestion.options[1]}</div>
                            <div>C: {targetQuestion.options[2]}</div>
                            <div>D: {targetQuestion.options[3]}</div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 block">CORRECT ANSWER KEY:</span>
                        <div className="text-xs font-bold text-green-800 bg-green-50 p-1 px-2 border border-green-200">
                          {targetQuestion.correctAnswer}
                        </div>
                      </div>

                      {/* Official input log reason */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <label className="block text-[10px] font-mono font-bold text-slate-700" htmlFor="approval-log-note">
                          REVIEWER COMMENTS (MIN. 8 CHARS) <span className="text-red-00">*</span>
                        </label>
                        <input
                          id="approval-log-note"
                          type="text"
                          required
                          value={approvalReason}
                          onChange={(e) => setApprovalReason(e.target.value)}
                          placeholder="e.g. Cleared Board evaluation criteria; syllabus mapping is strict."
                          className="admin-input w-full h-8 px-2 text-xs"
                        />
                        <p className="text-[9px] text-slate-500">Comments will be stored in the activity logs.</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => executeStatusChange(QuestionStatus.Approved)}
                          disabled={currentUser.role !== "CONTROLLER" && currentUser.role !== "ACADEMIC_AUDITOR"}
                          className="flex-1 py-2 text-xs font-bold text-white bg-green-800 border border-green-950 hover:bg-green-700 cursor-pointer rounded-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve Question
                        </button>
                        <button
                          onClick={() => executeStatusChange(QuestionStatus.Rejected)}
                          disabled={currentUser.role !== "CONTROLLER" && currentUser.role !== "ACADEMIC_AUDITOR"}
                          className="flex-1 py-2 text-xs font-bold text-white bg-red-800 border border-red-950 hover:bg-red-700 cursor-pointer rounded-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject Question
                        </button>
                      </div>
                      
                      {currentUser.role !== "CONTROLLER" && currentUser.role !== "ACADEMIC_AUDITOR" && (
                        <p className="text-[9px] text-red-700 font-mono text-center">
                          🛑 Your active session role ({currentUser.role}) lacks auditor clearance. Only controllers or academic auditors can verify questions.
                        </p>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="admin-card p-6 text-center text-slate-400 text-xs font-mono">
                  [SELECT_PENDING_ITEM] Click any card on the list queue to open official reviewing workspace controls.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "AUDIT" && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 border border-slate-800 rounded-sm">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" /> Question Bank Activity Trail
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Historical record of question updates, creations, and approvals.
            </p>
          </div>

          <div className="admin-card bg-slate-950 text-slate-300 font-mono p-4 rounded-sm text-xs space-y-2 border-slate-800 overflow-y-auto max-h-96">
            {auditLogs.filter(log => log.actionDetails.includes("question") || log.actionDetails.includes("Question") || log.actionDetails.includes("catalog")).map((log, index) => (
              <div key={index} className="flex items-start gap-2 py-1.5 border-b border-slate-800 last:border-b-0 hover:bg-slate-900/50">
                <span className="text-slate-500 font-light whitespace-nowrap">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-emerald-500 font-semibold">[AUDIT]</span>
                <span className="text-slate-400">By user: {log.userEmail} &gt;</span>
                <span className="text-slate-100 flex-1">{log.actionDetails}</span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="text-center text-slate-500 py-6">No audits recorded.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
