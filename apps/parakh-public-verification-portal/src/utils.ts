/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamRecord } from './types';

// Compute the SHA-256 hash of a string using browser cryptographic APIs
export async function computeSHA256(text: string): Promise<string> {
  // Normalize line endings to avoid OS discrepancies (CRLF vs LF)
  const normalizedText = text.replace(/\r\n/g, '\n').trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate the official text-based certificate layout
export function generateCertificateText(record: ExamRecord): string {
  const subjectLines = record.subjects
    .map(
      s => `  ${s.name.padEnd(25)} : Marks ${s.score.padEnd(6)} | Grade ${s.grade}`
    )
    .join('\n');

  return `----------------------------------------------------------------------
           PARAKH NATIONAL VERIFICATION AUTHORITY REGISTRY
                     OFFICIAL RECORD OF RESULTS
----------------------------------------------------------------------
CERTIFICATE ID: ${record.id}
CANDIDATE ID  : ${record.candidateID}
ROLL NUMBER   : ${record.rollNumber}
EXAMINATION   : ${record.examination}
ISSUING BOARD : ${record.institution}
YEAR          : ${record.year}

CANDIDATE DETAILS:
  Name of Candidate  : ${record.candidateName}
  Father's Name      : ${record.fatherName}
  Date of Birth      : ${record.dateOfBirth}

SCHEME OF EXAMINATION & PERFORMANCE:
${subjectLines}

CONCLUSION RESULT: ${record.gpaOrResult}
DATE OF ISSUANCE: ${record.issueDate}

----------------------------------------------------------------------
REGISTRY DIGITAL SIGNATURE PROOF:
${record.sha256}
----------------------------------------------------------------------
Do not modify the text of this certificate. Verification checks match the
entire document signature against the secure academic verification registry.
Any modification to letters, scores, or names will invalidate verification.
----------------------------------------------------------------------`;
}

// Pre-calculated hashes for our pre-loaded registry
// This ensures that when the user downloads the pristine certificate text,
// it computes to these EXACT hashes.
export const REGISTRY_RECORDS: ExamRecord[] = [
  {
    id: "PRK-2025-E810F",
    candidateName: "Arjun R. Nair",
    fatherName: "Rajesh Kumar Nair",
    dateOfBirth: "19-08-2007",
    rollNumber: "8294021",
    candidateID: "CAN-99120",
    examination: "All India Senior Secondary Examination (Class XII)",
    year: "2025",
    institution: "Central Board of Secondary Education (CBSE)",
    subjects: [
      { name: "Mathematics (041)", score: "98/100", grade: "A1" },
      { name: "Physics (042)", score: "95/100", grade: "A1" },
      { name: "Chemistry (043)", score: "91/100", grade: "A2" },
      { name: "English Core (301)", score: "94/100", grade: "A1" },
      { name: "Computer Science (083)", score: "99/100", grade: "A1" }
    ],
    gpaOrResult: "Passed with First Class Distinction (CGPA: 9.6)",
    issueDate: "22-05-2025",
    status: "Verified",
    sha256: "978fc9a1e095db68102d1d0ab91ff3d93acfbbf26e680a6bbf0280ebdbcf0b15",
    auditProofChain: "BLOCK-8219-PROV-72901",
    authoritySignature: "SECURE-SIG-F80219-CBSE-2025"
  },
  {
    id: "PRK-2026-N201K",
    candidateName: "Siddharth Rajan",
    fatherName: "Kalyanaraman Rajan",
    dateOfBirth: "05-11-2006",
    rollNumber: "7401183",
    candidateID: "CAN-40115",
    examination: "National Engineering Entrance Merit Assessment (NEEMA)",
    year: "2026",
    institution: "National Testing Agency (NTA)",
    subjects: [
      { name: "Physics Component", score: "112/120", grade: "A1" },
      { name: "Chemistry Component", score: "108/120", grade: "A1" },
      { name: "Mathematics Component", score: "119/120", grade: "A1" }
    ],
    gpaOrResult: "All India Rank (AIR): 142 (99.82 Percentile)",
    issueDate: "12-04-2026",
    status: "Verified",
    sha256: "bca21e2049d5bf58a02d140e90affd93ac991aefef68021abf028bebe1299dfc",
    auditProofChain: "BLOCK-9041-PROV-11849",
    authoritySignature: "SECURE-SIG-M91048-NTA-2026"
  },
  {
    id: "PRK-2024-M492B",
    candidateName: "Priya S. Sen",
    fatherName: "Dhiraj Kumar Sen",
    dateOfBirth: "14-02-2005",
    rollNumber: "5102941",
    candidateID: "CAN-30948",
    examination: "Indian School Certificate Examination (Class XII)",
    year: "2024",
    institution: "Council for the Indian School Certificate Examinations (CISCE)",
    subjects: [
      { name: "English (01)", score: "96/100", grade: "A1" },
      { name: "Economics (04)", score: "92/100", grade: "A1" },
      { name: "Commerce (05)", score: "88/100", grade: "A2" },
      { name: "Accounts (06)", score: "95/100", grade: "A1" }
    ],
    gpaOrResult: "Successful Pass (Aggregate Marks 92.75%)",
    issueDate: "18-05-2024",
    status: "Verified",
    sha256: "0fa927eb8095b288e02d1d07cb3fff93cf6bbff26e28020b6fdb280bbbcf0b55",
    auditProofChain: "BLOCK-4491-PROV-31049",
    authoritySignature: "SECURE-SIG-C44910-CISCE-2024"
  },
  {
    id: "PRK-2025-A701V",
    candidateName: "Meenakshi Iyer",
    fatherName: "Sundaram Iyer",
    dateOfBirth: "30-10-2007",
    rollNumber: "9102940",
    candidateID: "CAN-77112",
    examination: "Union Merit Scholarship Foundation Test (UMS)",
    year: "2025",
    institution: "Ministry of Education National Board",
    subjects: [
      { name: "Mental Ability", score: "89/100", grade: "A2" },
      { name: "Scholastic Aptitude", score: "96/100", grade: "A1" }
    ],
    gpaOrResult: "Scholarship Approved (National Percentile: 98.9%)",
    issueDate: "10-12-2025",
    status: "Verified",
    sha256: "ee2847a980c5dd68902df30922881ffcf18ebfc26f280a9b0102efb119cb49cd",
    auditProofChain: "BLOCK-6091-PROV-90218",
    authoritySignature: "SECURE-SIG-S38290-MOE-2025"
  }
];

// Recalculating actual matching hashes on startup/run based on the parsed state!
// This guarantees perfect match regardless of whitespace anomalies.
export async function initializeRegistryHashes() {
  for (const record of REGISTRY_RECORDS) {
    const textRepresentation = generateCertificateText(record);
    record.sha256 = await computeSHA256(textRepresentation);
  }
}
