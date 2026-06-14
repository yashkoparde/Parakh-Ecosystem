/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export const INITIAL_USERS: AdminUser[] = [
  {
    id: "U-001",
    name: "Dr. K. Raghavan",
    email: "k.raghavan@parakh.gov.in",
    role: "CONTROLLER",
    clearanceLevel: "LEVEL_3",
    isMfaEnabled: true
  },
  {
    id: "U-002",
    name: "Prof. Anjali Sharma",
    email: "anjali.sharma@parakh.gov.in",
    role: "ACADEMIC_AUDITOR",
    clearanceLevel: "LEVEL_2",
    isMfaEnabled: true
  },
  {
    id: "U-003",
    name: "Shri S. K. Mahapatra",
    email: "sk.mahapatra@parakh.gov.in",
    role: "SUPERVISOR",
    clearanceLevel: "LEVEL_2",
    isMfaEnabled: true
  },
  {
    id: "U-004",
    name: "Smt. Ranjana Sen",
    email: "ranjana.sen@verifier.parakh.gov.in",
    role: "VERIFIER",
    clearanceLevel: "LEVEL_1",
    isMfaEnabled: true
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: "S-MATH", code: "MATH-401", name: "Applied Mathematics Advanced", domain: "STEM", chaptersCount: 12, totalQuestions: 142 },
  { id: "S-PHYS", code: "PHYS-402", name: "Quantum Physics & Wave Mechanics", domain: "STEM", chaptersCount: 10, totalQuestions: 118 },
  { id: "S-CHEM", code: "CHEM-403", name: "Inorganic & Physical Chemistry", domain: "STEM", chaptersCount: 14, totalQuestions: 135 },
  { id: "S-GEOG", code: "GEOG-201", name: "Macroeconomics & Demographics", domain: "Humanities", chaptersCount: 8, totalQuestions: 94 },
  { id: "S-CSYS", code: "CSYS-305", name: "Principles of Systems Engineering", domain: "Technology", chaptersCount: 11, totalQuestions: 110 }
];

export const INITIAL_CENTERS: ExamCenter[] = [
  { id: "C-01", centerCode: "NC-DEL-001", name: "National Institute of Electronics - Delhi Center", state: "Delhi", city: "New Delhi", capacity: 850, cctvStatus: "ONLINE", secureStreams: 34, roomCount: 16, status: "Certified" },
  { id: "C-02", centerCode: "NC-MUM-048", name: "Western Zonal Computer Center - Kalina Campus", state: "Maharashtra", city: "Mumbai", capacity: 1200, cctvStatus: "ONLINE", secureStreams: 48, roomCount: 24, status: "Certified" },
  { id: "C-03", centerCode: "NC-BLR-072", name: "South-East Command Informatics Academy", state: "Karnataka", city: "Bengaluru", capacity: 600, cctvStatus: "ONLINE", secureStreams: 24, roomCount: 12, status: "Certified" },
  { id: "C-04", centerCode: "NC-KOL-021", name: "East Bengal Institute and Technical Center", state: "West Bengal", city: "Kolkata", capacity: 750, cctvStatus: "OFFLINE", secureStreams: 0, roomCount: 15, status: "Awaiting Inspections" },
  { id: "C-05", centerCode: "NC-HYD-099", name: "National Cyber-Security Assessment Citadel", state: "Telangana", city: "Hyderabad", capacity: 1500, cctvStatus: "ONLINE", secureStreams: 60, roomCount: 30, status: "Certified" }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "Q-6021",
    code: "Q-MATH-401-01",
    text: "Evaluate the convergence of the infinite series sum( (n!)^2 / (2n)!, n=1 to infinity ) and determine its limit or state of absolute convergence.",
    options: [
      "Converges absolutely to log(2)",
      "Diverges systematically under Raabe's Ratio Test",
      "Converges absolutely to 0 by Sterling's Factorial approximation constraint",
      "Converges absolutely to pi - 3"
    ],
    correctAnswer: "Converges absolutely to 0 by Sterling's Factorial approximation constraint",
    explanation: "Using the ratio test (d'Alembert's ratio test), the limit of a_(n+1)/a_n evaluates to (n+1)^2 / ((2n+2)(2n+1)) which passes to 1/4. Since 1/4 < 1, the series converges absolutely.",
    subject: "Applied Mathematics Advanced",
    cognitiveLevel: CognitiveLevel.Analysis,
    difficulty: Difficulty.Hard,
    marks: 6,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-10T11:42:00Z",
    status: QuestionStatus.Approved
  },
  {
    id: "Q-6022",
    code: "Q-MATH-401-02",
    text: "Let V be a finite-dimensional vector space over a field F, and T: V -> V be a linear transform. Prove that if T is diagonalizable, the minimal polynomial splits into distinct linear factors over F.",
    correctAnswer: "Provide full proof demonstrating that each root is a simple root corresponding to eigenvalue eigenspaces.",
    explanation: "By diagonalizability, V is spanned by eigenvectors, meaning the minimal polynomial must hold only single-degree linear factors representing each distinct eigenvalue.",
    subject: "Applied Mathematics Advanced",
    cognitiveLevel: CognitiveLevel.Knowledge,
    difficulty: Difficulty.Medium,
    marks: 4,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-12T09:15:00Z",
    status: QuestionStatus.Approved
  },
  {
    id: "Q-6023",
    code: "Q-PHYS-402-01",
    text: "Define the wave function boundary conditions for a quantum particle trapped within a spherical potential well with infinite potential barriers V(r) = infinity for r > a.",
    correctAnswer: "Spherical Bessel function J_l(kr) must vanish at r = a.",
    explanation: "Solving the radial Schrödinger equation gives spherical Bessel functions. The boundary condition requiring wave function continuity demands the radial function to go to zero at boundary radius a.",
    subject: "Quantum Physics & Wave Mechanics",
    cognitiveLevel: CognitiveLevel.Understanding,
    difficulty: Difficulty.Medium,
    marks: 4,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-14T14:30:00Z",
    status: QuestionStatus.Approved
  },
  {
    id: "Q-6024",
    code: "Q-PHYS-402-02",
    text: "Explain the phenomenon of anomalous Zeeman splitting in external low-intensity magnetic fields, detailing how the spin-orbit interaction disrupts the standard degenerate Landau levels.",
    correctAnswer: "Detailed structural explanation with formula for Landé g-factor",
    explanation: "The spin-orbit coupling splits levels into J states. The external magnetic field lifts the remaining 2J+1 degeneracy with different splitting factors due to spin-orbit g-factors.",
    subject: "Quantum Physics & Wave Mechanics",
    cognitiveLevel: CognitiveLevel.Analysis,
    difficulty: Difficulty.Hard,
    marks: 8,
    createdBy: "Dr. K. Raghavan",
    createdAt: "2026-05-15T16:00:00Z",
    status: QuestionStatus.Approved
  },
  {
    id: "Q-6025",
    code: "Q-CHEM-403-01",
    text: "Determine the coordination geometry and magnetic moment of [Co(NH3)6]3+ under standard crystal field theory (CFT) configuration parameters.",
    options: [
      "Tetrahedral geometry, high spin state, 4.9 BM magnetic moment",
      "Octahedral geometry, low spin state (d6 t2g6 eg0), 0 BM (diamagnetic)",
      "Square planar geometry, high spin state, 1.7 BM magnetic moment",
      "Octahedral geometry, high spin state, 5.2 BM magnetic moment"
    ],
    correctAnswer: "Octahedral geometry, low spin state (d6 t2g6 eg0), 0 BM (diamagnetic)",
    explanation: "Cobalt(III) is a d6 system. NH3 is a strong field ligand in CFT which causes paring of electrons in the lower t2g orbital, leading to a low-spin diamagnetic complex.",
    subject: "Inorganic & Physical Chemistry",
    cognitiveLevel: CognitiveLevel.Application,
    difficulty: Difficulty.Medium,
    marks: 4,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-18T10:20:00Z",
    status: QuestionStatus.Approved
  },
  {
    id: "Q-6026",
    code: "Q-GEOG-201-01",
    text: "Draft standard audit maps comparing the demographic dividend shift in Peninsular India relative to the Northern states from 2021 to 2031, focusing on dependency ratio metrics.",
    correctAnswer: "Detailed economic projections proving that Southern states hit optimal labor distribution while Northern states peak by 2041.",
    explanation: "Southern states show aging profiles with dependency ratio rising slowly, while Northern states possess younger median ages allowing dynamic manufacturing outputs if skilled.",
    subject: "Macroeconomics & Demographics",
    cognitiveLevel: CognitiveLevel.Analysis,
    difficulty: Difficulty.Medium,
    marks: 6,
    createdBy: "Shri S. K. Mahapatra",
    createdAt: "2026-05-20T11:00:00Z",
    status: QuestionStatus.PendingReview
  },
  {
    id: "Q-6027",
    code: "Q-CSYS-305-01",
    text: "Under SysML compliance, analyze the structural behavior relationship diagram required when mapping block definition diagrams to parametric constraints in complex telemetry systems.",
    correctAnswer: "Using constraints blocks containing mathematical expressions, binding parameters through context lines.",
    explanation: "Parametric diagrams restrict block values via constraint equations. They tie directly to blocks via item flows and bindings to assure real-time telemetry validation.",
    subject: "Principles of Systems Engineering",
    cognitiveLevel: CognitiveLevel.Application,
    difficulty: Difficulty.Hard,
    marks: 5,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-22T13:45:00Z",
    status: QuestionStatus.PendingReview
  },
  {
    id: "Q-6028",
    code: "Q-MATH-401-03",
    text: "Solve the linear PDE: u_t + c u_x = -k u subject to the boundary condition u(x,0) = f(x) for integer values x, and compute the attenuation profile.",
    correctAnswer: "u(x,t) = e^(-kt) * f(x - ct)",
    explanation: "By the method of characteristics, dx/dt = c gives characteristic lines x - ct = constant. Differentiating along these characteristics gives du/dt = -ku which integrates easily to the solution.",
    subject: "Applied Mathematics Advanced",
    cognitiveLevel: CognitiveLevel.Application,
    difficulty: Difficulty.Medium,
    marks: 5,
    createdBy: "Shri S. K. Mahapatra",
    createdAt: "2026-05-24T15:20:00Z",
    status: QuestionStatus.Draft
  },
  {
    id: "Q-6029",
    code: "Q-PHYS-402-03",
    text: "Under deep relativistic mechanics, reconcile the energy-momentum tensor conservation equations with the Bianchi identities within a Schwarzschild metric curvature space.",
    correctAnswer: "Prove covariant derivative of T^mn vanishes systematically using geodesic field equations.",
    explanation: "The contracted Bianchi identities state that G^ab_(;b) = 0. Equating this to the energy-momentum tensor via Einstein's field equations proves local conservation of energy and momentum.",
    subject: "Quantum Physics & Wave Mechanics",
    cognitiveLevel: CognitiveLevel.Analysis,
    difficulty: Difficulty.Hard,
    marks: 10,
    createdBy: "Prof. Anjali Sharma",
    createdAt: "2026-05-26T16:15:00Z",
    status: QuestionStatus.PendingReview
  }
];

export const INITIAL_BLUEPRINTS: Blueprint[] = [
  {
    id: "B-001",
    code: "BP-MATH-401A",
    name: "Advanced Applied Mathematics National Test Blueprint",
    subject: "Applied Mathematics Advanced",
    totalMarks: 100,
    easyPercent: 30,
    mediumPercent: 40,
    hardPercent: 30,
    durationMinutes: 180,
    status: "Approved"
  },
  {
    id: "B-002",
    code: "BP-PHYS-402B",
    name: "Quantum Mechanics & Semiconductor Foundation",
    subject: "Quantum Physics & Wave Mechanics",
    totalMarks: 100,
    easyPercent: 20,
    mediumPercent: 50,
    hardPercent: 30,
    durationMinutes: 180,
    status: "Approved"
  },
  {
    id: "B-003",
    code: "BP-CHEM-403C",
    name: "Standard Inorganic Matrix Assessment Blueprint",
    subject: "Inorganic & Physical Chemistry",
    totalMarks: 50,
    easyPercent: 40,
    mediumPercent: 40,
    hardPercent: 20,
    durationMinutes: 120,
    status: "Approved"
  }
];

export const INITIAL_PAPERS: GeneratedPaper[] = [
  {
    id: "P-4501",
    code: "EXAM-2026-MATH-98A",
    title: "National Assessment Paper for Higher Applied Mathematics (Set A)",
    blueprintCode: "BP-MATH-401A",
    subject: "Applied Mathematics Advanced",
    generatedAt: "2026-06-01T10:00:00Z",
    generatedBy: "Dr. K. Raghavan",
    totalMarks: 100,
    questions: [
      INITIAL_QUESTIONS[0],
      INITIAL_QUESTIONS[1]
    ],
    sha256Hash: "d0706240ca8fe51c22bc72bc5be0f7601f0bf18361b7f04bf49bb1e582b13fa2",
    blockchainTx: "0xbf2d43105fd9b5c3e0706240ca8fe51a2d48ef18361b24bf4a9abb2220199ddf",
    status: "Securely Sealed"
  },
  {
    id: "P-4502",
    code: "EXAM-2026-PHYS-77B",
    title: "Quantum Wave Mechanics Zonal Evaluation (Tier 1 Code Set B)",
    blueprintCode: "BP-PHYS-402B",
    subject: "Quantum Physics & Wave Mechanics",
    generatedAt: "2026-06-03T11:30:00Z",
    generatedBy: "Dr. K. Raghavan",
    totalMarks: 100,
    questions: [
      INITIAL_QUESTIONS[2],
      INITIAL_QUESTIONS[3]
    ],
    sha256Hash: "b620b78d223849cfd22a849abb57a12b23a96811baefdcf2026400ffdd82eb7d",
    blockchainTx: "0xec23fa0176df23b7ff49bb123a962130ffdd48ef480026e40d82eb7d0cf92da1",
    status: "Released"
  }
];

export const INITIAL_EVALUATIONS: EvaluationJob[] = [
  {
    id: "E-001",
    code: "EVAL-MATH-NC01",
    subject: "Applied Mathematics Advanced",
    examCenter: "National Institute of Electronics - Delhi Center",
    totalCandidateSheets: 850,
    evaluatedCount: 850,
    verifiedCount: 850,
    verificationStatus: "Verified & Locked",
    lastActionAt: "2026-06-11T18:30:00Z",
    assignedVerifier: "Smt. Ranjana Sen"
  },
  {
    id: "E-002",
    code: "EVAL-PHYS-NC02",
    subject: "Quantum Physics & Wave Mechanics",
    examCenter: "Western Zonal Computer Center - Kalina Campus",
    totalCandidateSheets: 1200,
    evaluatedCount: 1140,
    verifiedCount: 950,
    verificationStatus: "In Evaluation",
    lastActionAt: "2026-06-12T14:22:00Z",
    assignedVerifier: "Prof. Anjali Sharma"
  },
  {
    id: "E-003",
    code: "EVAL-CHEM-NC03",
    subject: "Inorganic & Physical Chemistry",
    examCenter: "South-East Command Informatics Academy",
    totalCandidateSheets: 600,
    evaluatedCount: 600,
    verifiedCount: 120,
    verificationStatus: "Pending Double-Blind Verification",
    lastActionAt: "2026-06-12T16:45:00Z",
    assignedVerifier: "Smt. Ranjana Sen"
  },
  {
    id: "E-004",
    code: "EVAL-GEOG-NC04",
    subject: "Macroeconomics & Demographics",
    examCenter: "East Bengal Institute and Technical Center",
    totalCandidateSheets: 750,
    evaluatedCount: 420,
    verifiedCount: 0,
    verificationStatus: "Flagged For Audit",
    lastActionAt: "2026-06-12T10:05:00Z",
    assignedVerifier: "Shri S. K. Mahapatra"
  }
];

export const INITIAL_BLOCKCHAINS: BlockchainRecord[] = [
  {
    id: "TX-901",
    timestamp: "2026-06-12T19:50:00Z",
    action: "Anchored Cryptographic Hash for Exam Paper Set MATH-98A",
    entityType: "ExamPaper",
    entityId: "P-4501",
    blockNumber: 482019,
    transactionHash: "0xbf2d43105fd9b5c3e0706240ca8fe51a2d48ef18361b24bf4a9abb2220199ddf",
    previousBlockHash: "0x3bc12301efab8290bdfe2123f0012ba3c0e183719b22efcd20163012ffddae21",
    digitalSignature: "SIG_SHA256_RSA_2048:Dr_K_Raghavan:d070624...",
    status: "Anchored"
  },
  {
    id: "TX-902",
    timestamp: "2026-06-12T18:30:00Z",
    action: "Committed Certified Gradeset Verification for Delhi Center (NC-DEL-001)",
    entityType: "EvaluationResult",
    entityId: "E-001",
    blockNumber: 481995,
    transactionHash: "0x01fa6252cd8feaa5112bc2ba3be0fc48e1aade8ef18362cd488abb099bf7f2ea2",
    previousBlockHash: "0xbf2d43105fd9b5c3e0706240ca8fe51a2d48ef18361b24bf4a9abb2220199ddf",
    digitalSignature: "SIG_SHA256_RSA_2048:Smt_Ranjana_Sen:e10cf5e...",
    status: "Anchored"
  },
  {
    id: "TX-903",
    timestamp: "2026-06-12T16:12:00Z",
    action: "Approved Batch 10 Question Catalog Entries into Immutable Master Pool",
    entityType: "QuestionBank",
    entityId: "Q-6021",
    blockNumber: 481872,
    transactionHash: "0xd83a5210efaa2468bbcf7a2efad0fc4df183eaefed8c26c048abcdfdd72eb00c",
    previousBlockHash: "0x12a9efd0fca8fb920cdfeef21221ba2f0ee183711baefdcf2010901ffdda5678",
    digitalSignature: "SIG_SHA256_RSA_2048:Prof_Anjali_Sharma:c02d18f...",
    status: "Anchored"
  }
];

export const INITIAL_AUDITS: AuditLog[] = [
  {
    id: "AUD-10029",
    timestamp: "2026-06-12T19:52:15-07:00",
    userEmail: "k.raghavan@parakh.gov.in",
    userRole: "CONTROLLER",
    actionCode: "AUTH_SEAL_PAPER",
    actionDetails: "Executed secure cryptographic seal on Exam Paper Set MATH-98A. Hash values stored in ledger logs.",
    ipAddress: "10.230.12.91",
    status: "COMPLIANT"
  },
  {
    id: "AUD-10028",
    timestamp: "2026-06-12T19:40:02-07:00",
    userEmail: "anjali.sharma@parakh.gov.in",
    userRole: "ACADEMIC_AUDITOR",
    actionCode: "MAPPING_COMPLIANCE_PASS",
    actionDetails: "Approved peer-reviewed academic maps for Applied Mathematics Advanced Question catalog codes Q-MATH-401-01.",
    ipAddress: "10.230.12.18",
    status: "COMPLIANT"
  },
  {
    id: "AUD-10027",
    timestamp: "2026-06-12T18:31:05-07:00",
    userEmail: "ranjana.sen@verifier.parakh.gov.in",
    userRole: "VERIFIER",
    actionCode: "CERTIFY_GRADESET_COMMIT",
    actionDetails: "Signed off on final evaluation marks verification code EVAL-MATH-NC01 using certified systemic credential keys.",
    ipAddress: "10.232.41.22",
    status: "COMPLIANT"
  },
  {
    id: "AUD-10026",
    timestamp: "2026-06-12T10:05:32-07:00",
    userEmail: "sk.mahapatra@parakh.gov.in",
    userRole: "SUPERVISOR",
    actionCode: "EXAM_CENTER_DISRUPT_ALERT",
    actionDetails: "Flagged Center NC-KOL-021 (Kolkata) as offline. Secure stream offline status reported to controller.",
    ipAddress: "10.230.15.228",
    status: "ALERT"
  }
];
