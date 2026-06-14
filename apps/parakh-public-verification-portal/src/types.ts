/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExamRecord {
  id: string; // Certificate ID
  candidateName: string;
  fatherName: string;
  dateOfBirth: string;
  rollNumber: string;
  candidateID: string;
  examination: string;
  year: string;
  institution: string;
  subjects: Array<{ name: string; score: string; grade: string }>;
  gpaOrResult: string;
  issueDate: string;
  status: 'Verified' | 'Not Verified' | 'Pending' | 'Invalid' | 'Record Found' | 'Record Not Found' | 'Archived' | 'Under Review';
  sha256: string; // SHA-256 code signature representing authenticity 
  auditProofChain: string; // Cryptographic consensus block ID or secure registry block
  authoritySignature: string; // National digital registry transaction ref
}

export interface VerificationEvent {
  id: string;
  timestamp: string;
  documentName: string;
  documentType: 'PDF' | 'Certificate ID' | 'Result Lookup' | 'Marksheet';
  lookupReference: string;
  status: 'Verified' | 'Modified' | 'Record Not Found' | 'Invalid' | 'Under Review';
  computedHash: string;
  registryHashMatched: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
