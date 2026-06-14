/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candidate, PaperRelease, PrintBatch, DeviceEvent, IncidentReport, ActivityLog, CenterStaff, ExamSession, CenterConfig } from "../types";

export const initialCenterConfig: CenterConfig = {
  centerId: "PARAKH-9042-DL",
  centerName: "Government Senior Boys Secondary School, Zone-V",
  city: "Dwarka, New Delhi",
  state: "Delhi NCR",
  chiefSuperintendent: "Dr. Rameshwar Prasad, PhD",
  observerName: "Prof. Animesh Sen (Central Observer - NTA)",
  prahariServerIp: "10.12.89.41 (Secure Intranet TLS v1.3)",
  drishtiVpnStatus: "Connected (AES-256)",
  currentIp: "164.100.47.19 (NIC VPN Dedicated Tunnel)",
  totalPrinters: 3,
  secureKey: "PKH-PRH-9042-8821",
  isLockedDown: false
};

export const initialSessions: ExamSession[] = [
  {
    id: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    subject: "Advanced Mathematics & Paper II Analytical Section",
    startTime: "09:00",
    endTime: "12:00",
    status: "Active",
    totalCandidates: 240,
    verifiedCandidates: 198,
    absentCandidates: 12,
    prahariKeyStatus: "Keys Released"
  },
  {
    id: "EX-2026-613",
    examName: "National Merit Entrance Examination 2026",
    subject: "Analytical Science and Research Methodology",
    startTime: "14:00",
    endTime: "17:00",
    status: "Scheduled",
    totalCandidates: 240,
    verifiedCandidates: 0,
    absentCandidates: 0,
    prahariKeyStatus: "Locked"
  },
  {
    id: "EX-2026-611",
    examName: "National Merit Entrance Examination 2026",
    subject: "Mental Ability and Logical Reasoning Test",
    startTime: "08:00",
    endTime: "10:30",
    status: "Completed",
    totalCandidates: 240,
    verifiedCandidates: 236,
    absentCandidates: 4,
    prahariKeyStatus: "Completed"
  }
];

export const initialStaff: CenterStaff[] = [
  {
    id: "STF-01",
    name: "Dr. Rameshwar Prasad",
    role: "Chief Superintendent",
    biometricVerified: true,
    biometricCode: "BIO-CHIEF-01",
    status: "Present - Active",
    assignedRoom: "Operations Command Center",
    phone: "+91 9810237722"
  },
  {
    id: "STF-02",
    name: "Prof. Animesh Sen",
    role: "Observer (NTA/Central)",
    biometricVerified: true,
    biometricCode: "BIO-OBS-02",
    status: "Present - Active",
    assignedRoom: "Observer Bureau Room B",
    phone: "+91 9911846611"
  },
  {
    id: "STF-03",
    name: "Shyam Lal Sharma",
    role: "Security Officer",
    biometricVerified: true,
    biometricCode: "BIO-SEC-03",
    status: "Present - Active",
    assignedRoom: "Main Gate & Outer Ring Corridor",
    phone: "+91 9410384812"
  },
  {
    id: "STF-04",
    name: "Smt. Sunita Deshmukh",
    role: "Invigilator",
    biometricVerified: true,
    biometricCode: "BIO-INV-04",
    status: "Present - Active",
    assignedRoom: "Examination Hall 101 (Floor 1)",
    phone: "+91 9822384755"
  },
  {
    id: "STF-05",
    name: "Rajesh Kumar Soni",
    role: "Technical Support",
    biometricVerified: true,
    biometricCode: "BIO-TECH-05",
    status: "Present - Active",
    assignedRoom: "Server Room / Print Room",
    phone: "+91 8812495819"
  },
  {
    id: "STF-06",
    name: "Mahesh Chandra",
    role: "Invigilator",
    biometricVerified: false,
    biometricCode: "PENDING-BIO",
    status: "Absent",
    assignedRoom: "Examination Room 204 (Floor 2)",
    phone: "+91 9518274633"
  }
];

export const initialCandidates: Candidate[] = [
  {
    id: "C-2026-001",
    name: "Aarav Sharma",
    rollNo: "DL-9042-3321",
    photoUrl: "Placeholder avatar for Aarav Sharma",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Verified",
    verificationMethod: "Biometric (Thumbprint)",
    biometricScore: 98.4,
    timestamp: "2026-06-12T08:23:10Z",
    seatNumber: "Hall 101, Row 1, Seat A",
    remarks: "Biometrics matched successfully on first attempt."
  },
  {
    id: "C-2026-002",
    name: "Ananya Iyer",
    rollNo: "DL-9042-3322",
    photoUrl: "Placeholder avatar for Ananya Iyer",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Verified",
    verificationMethod: "Aadhaar e-KYC",
    biometricScore: 92.1,
    timestamp: "2026-06-12T08:24:45Z",
    seatNumber: "Hall 101, Row 1, Seat B",
    remarks: "Facial validation accepted through secure e-KYC."
  },
  {
    id: "C-2026-003",
    name: "Rohan Verma",
    rollNo: "DL-9042-3323",
    photoUrl: "Placeholder avatar for Rohan Verma",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Pending",
    seatNumber: "Hall 101, Row 2, Seat A"
  },
  {
    id: "C-2026-004",
    name: "Meera Nair",
    rollNo: "DL-9042-3324",
    photoUrl: "Placeholder avatar for Meera Nair",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Rejected",
    verificationMethod: "Biometric (Thumbprint)",
    biometricScore: 28.5,
    timestamp: "2026-06-12T08:31:02Z",
    seatNumber: "Hall 101, Row 2, Seat B",
    remarks: "Biometrics failed multiple attempts. Photo mismatch on manual review.",
  },
  {
    id: "C-2026-005",
    name: "Vikram Rathore",
    rollNo: "DL-9042-3325",
    photoUrl: "Placeholder avatar for Vikram Rathore",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Duplicate",
    verificationMethod: "Retinal Scan",
    biometricScore: 99.1,
    timestamp: "2026-06-12T08:27:14Z",
    seatNumber: "Hall 101, Row 3, Seat A",
    remarks: "ID roll is marked flagged on national server database. Duplicate enrollment identified."
  },
  {
    id: "C-2026-006",
    name: "Aditi G",
    rollNo: "DL-9042-3326",
    photoUrl: "Placeholder avatar for Aditi G",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Absent",
    seatNumber: "Hall 101, Row 3, Seat B"
  },
  {
    id: "C-2026-007",
    name: "Kabir Mehta",
    rollNo: "DL-9042-3327",
    photoUrl: "Placeholder avatar for Kabir Mehta",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Pending",
    seatNumber: "Hall 101, Row 4, Seat A"
  },
  {
    id: "C-2026-008",
    name: "Ishaan Gupta",
    rollNo: "DL-9042-3328",
    photoUrl: "Placeholder avatar for Ishaan Gupta",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    centerId: "PARAKH-9042-DL",
    verificationStatus: "Verified",
    verificationMethod: "Biometric (Thumbprint)",
    biometricScore: 96.7,
    timestamp: "2026-06-12T08:29:10Z",
    seatNumber: "Hall 101, Row 4, Seat B",
    remarks: "Authenticated correctly. No anomalies reported."
  }
];

export const initialPaperReleases: PaperRelease[] = [
  {
    id: "R-9042-01",
    examId: "EX-2026-612",
    examName: "National Merit Entrance Examination 2026",
    subject: "Advanced Mathematics & Paper II Analytical Section",
    centerId: "PARAKH-9042-DL",
    releaseTime: "08:15",
    authorizationStatus: "Dual Authorized",
    status: "Released",
    secureDownloadKey: "SEC-KEY-772x-AA9-FF2",
    printBatchInitiated: true,
    printBatchId: "PB-001",
    approvedBy: ["Chief Superintendent DR-01", "NTA Observer AS-02"]
  },
  {
    id: "R-9042-02",
    examId: "EX-2026-613",
    examName: "National Merit Entrance Examination 2026",
    subject: "Analytical Science and Research Methodology",
    centerId: "PARAKH-9042-DL",
    releaseTime: "13:15",
    authorizationStatus: "Awaiting Dual approval",
    status: "Ready",
    printBatchInitiated: false,
    approvedBy: []
  },
  {
    id: "R-9042-03",
    examId: "EX-2026-614",
    examName: "National Merit Entrance Examination 2026",
    subject: "Technical Literacy & System Mechanics (Demo Session)",
    centerId: "PARAKH-9042-DL",
    releaseTime: "17:15",
    authorizationStatus: "Awaiting Dual approval",
    status: "Scheduled",
    printBatchInitiated: false,
    approvedBy: []
  }
];

export const initialPrintBatches: PrintBatch[] = [
  {
    id: "PB-001",
    paperId: "R-9042-01",
    examName: "National Merit Entrance Examination 2026",
    subject: "Advanced Mathematics & Paper II Analytical Section",
    printerIp: "10.12.89.51",
    printerName: "HPCenterLine High-Output printer-01",
    totalRequired: 240,
    printed: 240,
    status: "Completed",
    timestamp: "2026-06-12T08:21:40Z",
    operatorName: "Rajesh Kumar Soni"
  },
  {
    id: "PB-002",
    paperId: "R-9042-01",
    examName: "National Merit Entrance Examination 2026",
    subject: "Advanced Mathematics & Paper II Analytical Section (Reserved)",
    printerIp: "10.12.89.52",
    printerName: "HPCenterLine High-Output printer-02",
    totalRequired: 24,
    printed: 15,
    status: "Printing",
    timestamp: "2026-06-12T08:35:00Z",
    operatorName: "Rajesh Kumar Soni"
  }
];

export const initialDeviceEvents: DeviceEvent[] = [
  {
    id: "DEV-ALERT-001",
    deviceType: "Mobile Phone",
    detectionTime: "2026-06-12T08:42:15Z",
    location: "Hall 101, Near Row 2, Seat B",
    status: "Under Investigation",
    severity: "Critical",
    freqMHz: 1842.50,
    dbmStrength: -48 // High power
  },
  {
    id: "DEV-ALERT-002",
    deviceType: "Bluetooth Beacon",
    detectionTime: "2026-06-12T08:45:00Z",
    location: "Corridor B - Level 1 Washrooms",
    status: "Confiscated",
    severity: "Critical",
    freqMHz: 2441.00,
    dbmStrength: -55
  },
  {
    id: "DEV-ALERT-003",
    deviceType: "Smart Watch",
    detectionTime: "2026-06-12T08:50:11Z",
    location: "Hall 101, Row 6, Seat F",
    status: "False Positive",
    severity: "Low",
    freqMHz: 2402.00,
    dbmStrength: -80 // weak signal, analog wristwatch
  }
];

export const initialIncidentReports: IncidentReport[] = [
  {
    id: "INC-2026-001",
    incidentType: "Impersonation",
    description: "During biometric validation check, candidate roll DL-9042-3324 (Meera Nair) failed dual-fingerprint match. Photo comparison on portal mismatched physical candidate features.",
    location: "Hall 101 Identification Desk B",
    personnelInvolved: "Smt. Sunita Deshmukh (Invigilator), Shyam Lal Sharma (Security)",
    candidateId: "C-2026-004",
    evidenceAttached: "BIOM_MISMATCH_LOG_3324.log",
    timestamp: "2026-06-12T08:35:10Z",
    status: "Escalated to Central Command",
    severity: "Critical"
  },
  {
    id: "INC-2026-002",
    incidentType: "Device Detection",
    description: "Junction block sensor detected sudden active uplink on 1.8GHz. Signal localization pinpoints vicinity of Hall 101 seat B row 2. Chief Superintendent notified.",
    location: "Hall 101 Area North-East",
    personnelInvolved: "Rajesh Kumar Soni (Technical Support)",
    evidenceAttached: "SIGNAL_SPECTRUM_CAPTURE_0842.cap",
    timestamp: "2026-06-12T08:43:00Z",
    status: "Pending Investigation",
    severity: "Critical"
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "LOG-01",
    action: "Observer Sign-In",
    user: "Prof. Animesh Sen",
    role: "Central Observer (NTA)",
    timestamp: "2026-06-12T07:44:12Z",
    systemReference: "SYS-AUTH-882",
    status: "Success",
    details: "Biometric sign-in authorized. Observer bureau console activated."
  },
  {
    id: "LOG-02",
    action: "Chief Superintendent Sign-In",
    user: "Dr. Rameshwar Prasad",
    role: "Chief Superintendent",
    timestamp: "2026-06-12T07:46:05Z",
    systemReference: "SYS-AUTH-883",
    status: "Success",
    details: "Principal command center biometric match successful."
  },
  {
    id: "LOG-03",
    action: "Secure Channel Est",
    user: "Server System",
    role: "Technical Operations",
    timestamp: "2026-06-12T08:00:00Z",
    systemReference: "SYS-NET-VPN",
    status: "Success",
    details: "Secured NIC VPN Tunnel verified. Heartbeat payload established at 11ms latency."
  },
  {
    id: "LOG-04",
    action: "First Approval Paper Release",
    user: "Dr. Rameshwar Prasad",
    role: "Chief Superintendent",
    timestamp: "2026-06-12T08:12:30Z",
    systemReference: "PRH-REL-2241",
    status: "Audit Info",
    details: "Authorized first stage digital key for Subject: Advanced Mathematics & Paper II."
  },
  {
    id: "LOG-05",
    action: "Dual Auth Completed",
    user: "Prof. Animesh Sen",
    role: "Central Observer (NTA)",
    timestamp: "2026-06-12T08:14:55Z",
    systemReference: "PRH-REL-2242",
    status: "Success",
    details: "Observer security key entered. Secured decryption handshake executed with Prahari central servers."
  },
  {
    id: "LOG-06",
    action: "Key Download Initiated",
    user: "Rajesh Soni",
    role: "Technical Support",
    timestamp: "2026-06-12T08:15:15Z",
    systemReference: "PRH-KEY-DL",
    status: "Success",
    details: "Decryption token SEC-KEY-772x successfully compiled onto main storage vault."
  },
  {
    id: "LOG-07",
    action: "Print Batch Issued",
    user: "Dr. Rameshwar Prasad",
    role: "Chief Superintendent",
    timestamp: "2026-06-12T08:17:10Z",
    systemReference: "PRH-PRN-001",
    status: "Audit Info",
    details: "Command to start printing 240 copies of Advanced Mathematics paper issued."
  },
  {
    id: "LOG-08",
    action: "Printer Status Change",
    user: "HPCenterLine-01",
    role: "Hardware Agent",
    timestamp: "2026-06-12T08:21:40Z",
    systemReference: "PRH-PRN-HW",
    status: "Success",
    details: "Printer completed 240 copies successfully. Mechanical locks re-engaged."
  }
];
