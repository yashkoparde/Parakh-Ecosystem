/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum QuestionStatus {
  Draft = "Draft",
  PendingReview = "Pending Review",
  Approved = "Approved",
  Rejected = "Rejected"
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

export enum CognitiveLevel {
  Knowledge = "Knowledge",
  Understanding = "Understanding",
  Application = "Application",
  Analysis = "Analysis"
}

export interface Question {
  id: string;
  code: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  cognitiveLevel: CognitiveLevel;
  difficulty: Difficulty;
  marks: number;
  createdBy: string;
  createdAt: string;
  status: QuestionStatus;
}

export interface Blueprint {
  id: string;
  code: string;
  name: string;
  subject: string;
  totalMarks: number;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  durationMinutes: number;
  status: "Draft" | "Approved";
}

export interface GeneratedPaperVersion {
  versionId: number;
  timestamp: string;
  title: string;
  questions: Question[];
  totalMarks: number;
  sha256Hash: string;
  modifiedBy: string;
}

export interface GeneratedPaper {
  id: string;
  code: string;
  title: string;
  blueprintCode: string;
  subject: string;
  generatedAt: string;
  generatedBy: string;
  totalMarks: number;
  questions: Question[];
  sha256Hash: string;
  blockchainTx: string;
  status: "Draft" | "Securely Sealed" | "Released";
  versions?: GeneratedPaperVersion[];
}

export interface EvaluationJob {
  id: string;
  code: string;
  subject: string;
  examCenter: string;
  totalCandidateSheets: number;
  evaluatedCount: number;
  verifiedCount: number;
  verificationStatus: "Awaiting Evaluation" | "In Evaluation" | "Pending Double-Blind Verification" | "Verified & Locked" | "Flagged For Audit";
  lastActionAt: string;
  assignedVerifier: string;
}

export interface BlockchainRecord {
  id: string;
  timestamp: string;
  action: string;
  entityType: "QuestionBank" | "ExamPaper" | "EvaluationResult" | "AccessAudit";
  entityId: string;
  blockNumber: number;
  transactionHash: string;
  previousBlockHash: string;
  digitalSignature: string;
  status: "Anchored" | "Pending Verification";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  actionCode: string;
  actionDetails: string;
  ipAddress: string;
  status: "COMPLIANT" | "ALERT" | "SECURITY_OVERRIDE";
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  domain: string;
  chaptersCount: number;
  totalQuestions: number;
}

export interface ExamCenter {
  id: string;
  centerCode: string;
  name: string;
  state: string;
  city: string;
  capacity: number;
  cctvStatus: "ONLINE" | "OFFLINE";
  secureStreams: number;
  roomCount: number;
  status: "Certified" | "Awaiting Inspections";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CONTROLLER" | "SUPERVISOR" | "ACADEMIC_AUDITOR" | "VERIFIER";
  clearanceLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  isMfaEnabled: boolean;
}
