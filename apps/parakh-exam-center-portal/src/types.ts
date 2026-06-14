/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Candidate {
  id: string;
  name: string;
  rollNo: string;
  photoUrl: string;
  examId: string;
  examName: string;
  centerId: string;
  verificationStatus: "Verified" | "Pending" | "Rejected" | "Duplicate" | "Absent";
  verificationMethod?: "Biometric (Thumbprint)" | "Retinal Scan" | "Aadhaar e-KYC" | "OMR Check" | "Manual Override";
  biometricScore?: number; // percentage
  timestamp?: string;
  seatNumber: string;
  remarks?: string;
}

export interface PaperRelease {
  id: string;
  examId: string;
  examName: string;
  subject: string;
  centerId: string;
  releaseTime: string; // ISO string or static formatted time
  authorizationStatus: "Awaiting Dual approval" | "First Officer Approved" | "Dual Authorized" | "Revoked";
  status: "Scheduled" | "Ready" | "Released" | "Cancelled";
  secureDownloadKey?: string;
  printBatchInitiated: boolean;
  printBatchId?: string;
  approvedBy?: string[];
}

export interface PrintBatch {
  id: string;
  paperId: string;
  examName: string;
  subject: string;
  printerIp: string;
  printerName: string;
  totalRequired: number;
  printed: number;
  status: "Scheduled" | "Printing" | "Completed" | "Warning" | "Critical";
  timestamp: string;
  operatorName: string;
}

export interface DeviceEvent {
  id: string;
  deviceType: "Mobile Phone" | "Bluetooth Beacon" | "Smart Watch" | "Micro Transmitter" | "RF Burst";
  detectionTime: string;
  location: string; // e.g. "Wing B, Row 4"
  status: "Under Investigation" | "Confiscated" | "False Positive" | "Flagged";
  severity: "Low" | "Warning" | "Critical";
  freqMHz: number;
  dbmStrength: number;
}

export interface IncidentReport {
  id: string;
  incidentType: "Impersonation" | "Device Detection" | "Cheating / Sheet Exchange" | "Paper Distribution Delay" | "Staff Misconduct" | "Other Technical Issue";
  description: string;
  location: string;
  personnelInvolved: string;
  candidateId?: string;
  evidenceAttached: string; // filename or mock ref
  timestamp: string;
  status: "Pending Investigation" | "Resolved - Action Taken" | "Escalated to Central Command" | "Closed";
  severity: "Low" | "Warning" | "Critical";
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  systemReference: string;
  status: "Success" | "Warning" | "Critical" | "Audit Info";
  details: string;
}

export interface CenterStaff {
  id: string;
  name: string;
  role: "Chief Superintendent" | "Observer (NTA/Central)" | "Invigilator" | "Technical Support" | "Security Officer";
  biometricVerified: boolean;
  biometricCode: string; // thumb ID or token
  status: "Present - Active" | "On Break" | "Absent";
  assignedRoom: string;
  phone: string;
}

export interface ExamSession {
  id: string;
  examName: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Active" | "Completed" | "Suspended";
  totalCandidates: number;
  verifiedCandidates: number;
  absentCandidates: number;
  prahariKeyStatus: "Locked" | "Keys Released" | "Decrypting" | "Completed";
}

export interface CenterConfig {
  centerId: string;
  centerName: string;
  city: string;
  state: string;
  chiefSuperintendent: string;
  observerName: string;
  prahariServerIp: string;
  drishtiVpnStatus: "Connected (AES-256)" | "Disconnected" | "Reconnecting";
  currentIp: string;
  totalPrinters: number;
  secureKey: string;
  isLockedDown: boolean;
}
