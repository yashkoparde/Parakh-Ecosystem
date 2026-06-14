/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  candidateId: string;
  rollNumber: string;
  name: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  registeredInstitution: string;
  program: string;
  contactEmail: string;
  contactPhone: string;
  academicYear: string;
  aadhaarReference: string;
}

export interface SubjectScore {
  subject: string;
  code: string;
  maxMarks: number;
  passingMarks: number;
  marksObtained: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent';
}

export interface Result {
  id: string; // result ID
  examinationName: string;
  examinationCode: string;
  rollNumber: string;
  publishedDate: string;
  academicYear: string;
  subjectScores: SubjectScore[];
  totalMarksObtained: number;
  totalMaxMarks: number;
  overallGrade: string;
  overallPercentage: number;
  verificationStatus: 'Verified' | 'Pending' | 'Under Review' | 'Archived';
  blockchainRecordStatus: 'Anchored' | 'Pending' | 'Failed';
  txHash: string;
  resultStatus: 'Pass' | 'Fail';
}

export interface Certificate {
  id: string;
  name: string;
  documentNumber: string;
  issuedDate: string;
  type: 'Degree' | 'Migration' | 'Transcript' | 'Certificate';
  status: 'Issued' | 'Pending' | 'Archived';
  verificationStatus: 'Verified' | 'Under Review' | 'Rejected';
  blockchainHash: string;
  txHash: string;
  issuingAuthority: string;
  description: string;
}

export interface VerificationRecord {
  id: string;
  documentType: string;
  referenceNumber: string;
  timestamp: string;
  requestedBy: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  verificationResult: string;
  blockchainVerificationHash: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'Result Published' | 'Certificate Issued' | 'Verification Completed' | 'Document Updated';
  isRead: boolean;
}

export interface ExaminationSchedule {
  id: string;
  name: string;
  code: string;
  date: string;
  timeSlot: string;
  session: string;
  hallTicketNumber: string;
  centerName: string;
  status: 'Upcoming' | 'Completed' | 'Under Review';
}
