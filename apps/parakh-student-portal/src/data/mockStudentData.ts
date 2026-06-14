/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Result, Certificate, VerificationRecord, Notification, ExaminationSchedule } from '../types';

export const mockStudent: Student = {
  candidateId: "PRK-2025-99812",
  rollNumber: "2212093845",
  name: "Aarav S. Deshmukh",
  dateOfBirth: "2008-04-14",
  fatherName: "Sanjay R. Deshmukh",
  motherName: "Prerna S. Deshmukh",
  registeredInstitution: "Kendriya Vidyalaya No.1, Salt Lake, Kolkata (School Code: 54102)",
  program: "Senior School Certificate Examination (Class XII - Science Stream)",
  contactEmail: "aarav.deshmukh2008@gmail.com",
  contactPhone: "+91 98300 12345",
  academicYear: "2025-2026",
  aadhaarReference: "XXXX-XXXX-8910"
};

export const mockResults: Result[] = [
  {
    id: "RES-2026-X12",
    examinationName: "Senior School Certificate Examination (Class XII)",
    examinationCode: "SSCE-2026",
    rollNumber: "2212093845",
    publishedDate: "2026-05-25",
    academicYear: "2025-2026",
    totalMarksObtained: 468,
    totalMaxMarks: 500,
    overallGrade: "A1",
    overallPercentage: 93.6,
    verificationStatus: "Verified",
    blockchainRecordStatus: "Anchored",
    txHash: "0x8fa9c4d12eb37f10b77c5d3301a2c3b8ef412c9dd701a2fe5781fb39abcf31c4",
    resultStatus: "Pass",
    subjectScores: [
      { subject: "English Core", code: "301", maxMarks: 100, passingMarks: 33, marksObtained: 95, grade: "A1", status: "Pass" },
      { subject: "Physics", code: "042", maxMarks: 100, passingMarks: 33, marksObtained: 92, grade: "A1", status: "Pass" },
      { subject: "Chemistry", code: "043", maxMarks: 100, passingMarks: 33, marksObtained: 89, grade: "A2", status: "Pass" },
      { subject: "Mathematics", code: "041", maxMarks: 100, passingMarks: 33, marksObtained: 98, grade: "A1", status: "Pass" },
      { subject: "Computer Science", code: "083", maxMarks: 100, passingMarks: 33, marksObtained: 94, grade: "A1", status: "Pass" }
    ]
  },
  {
    id: "RES-2025-T1",
    examinationName: "Class XII Mid-Term Evaluation",
    examinationCode: "MTE-2025",
    rollNumber: "2212093845",
    publishedDate: "2025-11-10",
    academicYear: "2025-2026",
    totalMarksObtained: 442,
    totalMaxMarks: 500,
    overallGrade: "A2",
    overallPercentage: 88.4,
    verificationStatus: "Verified",
    blockchainRecordStatus: "Anchored",
    txHash: "0x4ca1e7f90da2b1137e58316dfa991b12b509ef8aa3e1d1f034ef8219ab1c3d82",
    resultStatus: "Pass",
    subjectScores: [
      { subject: "English Core", code: "301", maxMarks: 100, passingMarks: 33, marksObtained: 88, grade: "A2", status: "Pass" },
      { subject: "Physics", code: "042", maxMarks: 100, passingMarks: 33, marksObtained: 84, grade: "B1", status: "Pass" },
      { subject: "Chemistry", code: "043", maxMarks: 100, passingMarks: 33, marksObtained: 86, grade: "A2", status: "Pass" },
      { subject: "Mathematics", code: "041", maxMarks: 100, passingMarks: 33, marksObtained: 94, grade: "A1", status: "Pass" },
      { subject: "Computer Science", code: "083", maxMarks: 100, passingMarks: 33, marksObtained: 90, grade: "A2", status: "Pass" }
    ]
  },
  {
    id: "RES-2024-X10",
    examinationName: "Secondary School Examination (Class X)",
    examinationCode: "SSE-2024",
    rollNumber: "1110829351",
    publishedDate: "2024-05-18",
    academicYear: "2023-2024",
    totalMarksObtained: 476,
    totalMaxMarks: 500,
    overallGrade: "A1",
    overallPercentage: 95.2,
    verificationStatus: "Verified",
    blockchainRecordStatus: "Anchored",
    txHash: "0x2db4e1d3e23ff5047b85e2b00cd8ef1f238ad8ee7001bfa2daeeaa7f2e1c944a",
    resultStatus: "Pass",
    subjectScores: [
      { subject: "English Communicative", code: "101", maxMarks: 100, passingMarks: 33, marksObtained: 96, grade: "A1", status: "Pass" },
      { subject: "Mathematics Standard", code: "041", maxMarks: 100, passingMarks: 33, marksObtained: 99, grade: "A1", status: "Pass" },
      { subject: "Science & Tech", code: "086", maxMarks: 100, passingMarks: 33, marksObtained: 94, grade: "A1", status: "Pass" },
      { subject: "Social Science", code: "087", maxMarks: 100, passingMarks: 33, marksObtained: 92, grade: "A1", status: "Pass" },
      { subject: "Sanskrit", code: "122", maxMarks: 100, passingMarks: 33, marksObtained: 95, grade: "A1", status: "Pass" }
    ]
  },
  {
    id: "RES-2026-NDA",
    examinationName: "National Olympiad in Mathematics (Level-1 Selection)",
    examinationCode: "NOM-2026",
    rollNumber: "NOM-99812",
    publishedDate: "2026-02-15",
    academicYear: "2025-2026",
    totalMarksObtained: 124,
    totalMaxMarks: 150,
    overallGrade: "Distinction",
    overallPercentage: 82.67,
    verificationStatus: "Under Review",
    blockchainRecordStatus: "Pending",
    txHash: "0x1122aabbccddeeff0011223344556677889900aabbccddeeff00112233445566",
    resultStatus: "Pass",
    subjectScores: [
      { subject: "Advanced Number Theory", code: "M01", maxMarks: 50, passingMarks: 20, marksObtained: 42, grade: "A1", status: "Pass" },
      { subject: "Combinatorics & Logic", code: "M02", maxMarks: 50, passingMarks: 20, marksObtained: 38, grade: "A2", status: "Pass" },
      { subject: "Analytical Geometry", code: "M03", maxMarks: 50, passingMarks: 20, marksObtained: 44, grade: "A1", status: "Pass" }
    ]
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: "CERT-SSCE-2026",
    name: "Higher Secondary Certificate (HSC) Record",
    documentNumber: "HSC-2026-99384501",
    issuedDate: "2026-05-28",
    type: "Degree",
    status: "Issued",
    verificationStatus: "Verified",
    blockchainHash: "SHA256: 41b9efb8db1bc7efdd8237ba53ffcd4dc298bc725db8a36ef01d8f1e2f9d1e3c",
    txHash: "0x5ebfa235cd21a88b22a074ba233ff8dc29c4ef6dbca814a09e023ca2dfa88fb0",
    issuingAuthority: "National Examinations Authority & Central Board Council",
    description: "Official School Leaving Certificate confirming completion of Class XII curriculum with Science honors."
  },
  {
    id: "CERT-MIGR-2026",
    name: "National Migration Certificate",
    documentNumber: "MC-2026-88129034",
    issuedDate: "2026-05-28",
    type: "Migration",
    status: "Issued",
    verificationStatus: "Verified",
    blockchainHash: "SHA256: 82ab912e75cbdaee1292fa1d556c3ee7ebd389274baefaa3cd85bf29d8a3be20",
    txHash: "0x17c9b837baeedef0cd1e2f38994fa25bc3efefd99e0cdffdaee56889ebca0291",
    issuingAuthority: "National Examinations Authority",
    description: "Authority record authorizing transition to higher educational institutions within any state university ecosystem."
  },
  {
    id: "CERT-TSCR-2026",
    name: "Official Cumulative Transcript",
    documentNumber: "TR-2026-004812",
    issuedDate: "2026-06-02",
    type: "Transcript",
    status: "Issued",
    verificationStatus: "Verified",
    blockchainHash: "SHA256: ddeeffa11223344556677889900aabbccddeeff11223344556677889900aabbc",
    txHash: "0xecba93ef27c62d0f983a54d24ea25d81b8359cdcaefd394eaee4d241eaedfe12",
    issuingAuthority: "National Examinations Authority Registrar Office",
    description: "Multi-year subject-wise record detailing academic performance benchmarks across High School and Higher Secondary segments."
  },
  {
    id: "CERT-SSE-2024",
    name: "Secondary Education Certificate (Class X)",
    documentNumber: "SEC-2024-118290",
    issuedDate: "2024-05-21",
    type: "Certificate",
    status: "Issued",
    verificationStatus: "Verified",
    blockchainHash: "SHA256: bbccddeeffa1223344778899aa1122ff11ddee22bc33ee44ff551100aabbffee",
    txHash: "0x7da4d2ecfaeb901ea2d38faee0cdfced39eaefbce73d102e3daeefff4dafe218",
    issuingAuthority: "Central Board Council & Secondary Education Commission",
    description: "Official standard verification record confirming complete general education benchmark compliance with Distinction honors."
  },
  {
    id: "CERT-TCH-2026",
    name: "National Character Certifying Record",
    documentNumber: "NCC-2026-883901",
    issuedDate: "2026-06-10",
    type: "Certificate",
    status: "Pending",
    verificationStatus: "Under Review",
    blockchainHash: "SHA256: 3a9e2a8c3d8e90710ba09efbcd38e12d45a987efb23dc9a80ea12ffbe2103409",
    txHash: "Under processing / Manual Review",
    issuingAuthority: "Principal & Student Affairs Registry",
    description: "Institution-verified conduct, civic responsibility, and co-curricular benchmark assessment."
  }
];

export const mockVerificationRecords: VerificationRecord[] = [
  {
    id: "VR-2026-01",
    documentType: "Higher Secondary Certificate (HSC) Record",
    referenceNumber: "VR-HS2026-9041",
    timestamp: "2026-06-01 10:24:18 (UTC+5:30)",
    requestedBy: "Indian Institute of Science (IISc Bangalore) Admissions Division",
    status: "Verified",
    verificationResult: "MATCH - Document authenticity and marks listed exactly correspond to central records. Authenticity verified via digital database signature.",
    blockchainVerificationHash: "SHA256: 41b9efb8db1bc7efdd8237ba53ffcd4dc298bc725db8a36ef01d8f1e2f9d1e3c"
  },
  {
    id: "VR-2026-02",
    documentType: "National Migration Certificate",
    referenceNumber: "VR-MC2026-1102",
    timestamp: "2026-06-03 14:15:02 (UTC+5:30)",
    requestedBy: "Indian Institute of Technology, Bombay (IIT Delhi Admissions Portal)",
    status: "Verified",
    verificationResult: "MATCH - Record matches central registry. Status Verified.",
    blockchainVerificationHash: "SHA256: 82ab912e75cbdaee1292fa1d556c3ee7ebd389274baefaa3cd85bf29d8a3be20"
  },
  {
    id: "VR-2026-03",
    documentType: "Secondary Education Certificate (Class X)",
    referenceNumber: "VR-SEC2024-8110",
    timestamp: "2025-08-14 09:12:44 (UTC+5:30)",
    requestedBy: "National Scholarship Portal System Validator Service",
    status: "Verified",
    verificationResult: "MATCH - Standard authenticity pass. Central database records confirm secondary school completion.",
    blockchainVerificationHash: "SHA256: bbccddeeffa1223344778899aa1122ff11ddee22bc33ee44ff551100aabbffee"
  },
  {
    id: "VR-2026-04",
    documentType: "Official Cumulative Transcript",
    referenceNumber: "VR-TR2026-1922",
    timestamp: "2026-06-11 11:30:00 (UTC+5:30)",
    requestedBy: "Singapore University of Technology (SUTD Registrar Agent)",
    status: "Under Review",
    verificationResult: "PENDING - Academic transcript details are queued for secondary manual audit of extracurricular records.",
    blockchainVerificationHash: "SHA256: ddeeffa11223344556677889900aabbccddeeff11223344556677889900aabbc"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "NOTIF-01",
    title: "Official Examination Results Published",
    content: "The examination result for 'Senior School Certificate Examination (Class XII)' has been officially published and archived. Verification audit has been completed successfully.",
    date: "2026-05-25",
    type: "Result Published",
    isRead: false
  },
  {
    id: "NOTIF-02",
    title: "Official Credential Document Issued",
    content: "The 'Higher Secondary Certificate (HSC) Record' and 'National Migration Certificate' have been generated and digitally signed. They are now accessible inside the Certificates Repository.",
    date: "2026-05-28",
    type: "Certificate Issued",
    isRead: false
  },
  {
    id: "NOTIF-03",
    title: "Document Verification Competency Check Completed",
    content: "Official validation match requested by IISc Bangalore Admissions Division for 'Higher Secondary Certificate (HSC)' has been processed and reported as fully secure.",
    date: "2026-06-01",
    type: "Verification Completed",
    isRead: true
  },
  {
    id: "NOTIF-04",
    title: "Admissions Transcript Digitally Signed",
    content: "Cumulative Transcript (Class XI & Class XII consolidated record) has been securely verified and registered to student profile.",
    date: "2026-06-02",
    type: "Document Updated",
    isRead: true
  }
];

export const mockExaminationSchedules: ExaminationSchedule[] = [
  {
    id: "SCH-01",
    name: "National Physics & Chemical Science Practice Practicums",
    code: "NPCP-2026",
    date: "2026-07-15",
    timeSlot: "09:30 AM - 12:30 PM",
    session: "Morning Session (F-1)",
    hallTicketNumber: "HT-2026-4481023",
    centerName: "Apex Examination Center Center Hub A, Sector V, Salt Lake",
    status: "Completed"
  },
  {
    id: "SCH-02",
    name: "Joint Entrance Auxiliary Assessment test (Optional Mock Session)",
    code: "JEAA-2026",
    date: "2026-08-04",
    timeSlot: "02:00 PM - 05:00 PM",
    session: "Afternoon Session (S-2)",
    hallTicketNumber: "HT-2026-4481023",
    centerName: "Apex Examination Center Center Hub B, Sector V, Salt Lake",
    status: "Upcoming"
  },
  {
    id: "SCH-03",
    name: "State Technical English Competency Standard",
    code: "STECS-2026",
    date: "2026-08-18",
    timeSlot: "10:00 AM - 12:00 PM",
    session: "Morning Session (F-1)",
    hallTicketNumber: "HT-2026-8812904",
    centerName: "Government High School Hall-B, Salt Lake, Kolkata",
    status: "Upcoming"
  }
];
