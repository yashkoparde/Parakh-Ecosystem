# PARAKH End-to-End Workflow & Presentation Guide
### Operational Walkthrough, Video Script, and Slides Outline for NotebookLM

This document details the operational workflow of the **PARAKH Ecosystem** from start to finish. It also contains a production-ready **Cinematic Video Script Outline** and a **PowerPoint (PPT) Slide Structure** to assist in pitching the project.

---

## 🔄 1. End-to-End Operational Workflow

The PARAKH system operates in four consecutive phases:

```
[ Phase 1: Setup ] --------> [ Phase 2: Exam Day ] --------> [ Phase 3: Grading ] --------> [ Phase 4: Verify ]
  - Questions Bank             - Biometric Check-in            - Booklet Scanning           - Digital Certs
  - Blueprints Approved        - Jammer Sniffing               - Double-Blind Check         - Public Lookup
  - Paper Cryptography         - Secure Decrypt & Print        - Verifier Lock              - PDF Hash Match
```

### Phase 1: Examination & Paper Setup
1. **Question Banking**: Academic Auditors create and review questions inside the Admin Portal. Questions are tagged with difficulty level (`Easy`, `Medium`, `Hard`) and stream code.
2. **Blueprint Construction**: Controllers build dynamic blueprints defining the format of the exam (e.g. 100 marks, 180 minutes, specific topic weights, and difficulty ratios).
3. **Cryptographic Sealing**: The Controller generates a set of exam papers. An Edge Function (`seal-paper`) is triggered, creating a SHA-256 hash of the paper and anchoring it to the simulated blockchain registry. The paper is saved in the private `exam-papers` bucket.

### Phase 2: Examination Day at the Center
1. **Network Lockdown**: The Center Supervisor activates the *Prahari Lockdown* system in the Exam Center Portal. Local jammers are monitored, and local RF sniffer devices scan for illegal signals.
2. **Biometric Check-in**: Candidates arrive at the center. Invigilators scan their biometric details (thumbprint or retinal scan) which are matched against Aadhaar records. Their attendance is marked, and seat numbers are assigned in real-time in the `session_candidates` table.
3. **Secure Decryption & Print**: Thirty minutes before the exam, the Observer and Supervisor enter their credentials in the Exam Center Portal. The portal fetches the decryption key from the central server, downloads the paper from the private `exam-papers` bucket, and streams it to authorized printers. The printer output is logged inside the `print_batches` table to prevent duplication.

### Phase 3: Digitization & Double-Blind Grading
1. **Answer Booklet Scanning**: After the exam, answer booklets are scanned and compiled into ZIP packages. The Supervisor uploads them to the private `student-evaluation-payloads` storage bucket.
2. **Evaluation Job Routing**: An `evaluation_job` is created. Supabase routes the scans to assigned Verifiers for double-blind checking.
3. **Verification Lock**: Once grading is complete, the Verifier locks the evaluation, and the results are compiled in the `results` table. This write automatically fires the database trigger that generates a block transaction hash and chains it to the blockchain ledger.

### Phase 4: Credentials Issuance & Verification
1. **Result Release**: Results are published to the Student Portal. Students log in securely to view their subject scores, overall percentage, and block transaction hash.
2. **Certified Credential Generation**: The Student requests an official copy. An Edge Function (`issue-certificate`) executes server-side, compiles the student data, generates a certified PDF using `pdf-lib`, saves it to the public `academic-credentials` bucket, and anchors it.
3. **Public Verification**: A university or employer drops the student's PDF certificate into the Public Verification Portal. The portal recalculates the file's SHA-256 hash, matches it against the database blockchain records, and verifies its authenticity.

---

## 🎬 2. Cinematic Video Script Outline (Pitch Video)

**Theme**: "From Chaos to Cryptographic Certainty: The Story of PARAKH"  
**Tone**: High-energy, futuristic, reassuring, and premium.

### Scene 1: The Vulnerability (0:00 - 0:15)
* **Visual**: A dark, chaotic montage of paper exam leaks, news headlines about cheating scandals, and stressed students. High-contrast lighting.
* **Sound**: Tense ticking clock, deep dramatic sub-bass swells, chaotic news report voiceovers.
* **Voiceover (VO)**: "Every year, millions of students sit for board exams. Yet, the systems we trust to grade them remain vulnerable to leaks, impersonation, and credentials fraud. Trust is broken."

### Scene 2: The Solution (0:15 - 0:35)
* **Visual**: Sudden transition to a vibrant, clean, glassmorphic UI. A neon shield logo fades in: **PARAKH**. Quick cuts showing the Nx Monorepo structure, folders organizing into clean boxes, and code building instantly.
* **Sound**: Sudden uplifting synth pad, electronic beat starts.
* **VO**: "Enter PARAKH. A secure, decentralized, blockchain-anchored exam ecosystem. Built as a unified monorepo connecting administrators, supervisors, students, and verifiers."

### Scene 3: The Cryptographic Vault (0:35 - 1:00)
* **Visual**: A Controller in the Admin Portal clicks "Seal Paper". A futuristic blockchain-chaining graphic animates on screen, showing block hashes linking. In the Exam Center, a Supervisor checks a tablet showing CCTV feeds and a live RF signal frequency monitor.
* **Sound**: Cybernetic swoosh, hum of a secure server room, rhythmic pulse.
* **VO**: "From the moment an exam blueprint is locked, it is cryptographically sealed in our database. On exam day, biometric checks guarantee candidate identity, while local RF sensors scan the airwaves for leaks. Papers are decrypted and printed only minutes before the bell rings, under strict log auditing."

### Scene 4: Double-Blind and Anchored (1:00 - 1:20)
* **Visual**: Answer sheets being scanned. A Verifier grading on a dual screen. The screen flashes green: "Grade Verified & Anchored to Ledger."
* **Sound**: Fast digital text typing sound, satisfying mechanical click.
* **VO**: "Grading is secure, double-blind, and audited. The moment results are locked, they are permanently chained to an immutable blockchain record, making fraud impossible."

### Scene 5: Instant Trust (1:20 - 1:30)
* **Visual**: A student downloading a beautiful PDF certificate with a glowing QR code on a phone. An HR recruiter dragging the PDF into the Public Verification portal—a green shield flashes: "Authenticity Verified. Match 100%."
* **Sound**: Uplifting melodic crescendo, resolved warm chord.
* **VO**: "For students, instant access. For universities, instant verification. PARAKH: Restoring trust to educational grading. Secure, verified, and unalterable."

---

## 📊 3. PowerPoint (PPT) Presentation Structure

**Design Theme**: Deep dark slate background, electric green accents (`#3ECF8E` for Supabase/Success), and cyber blue gradients (`#646CFF` for Vite/Trust). Modern typography.

### Slide 1: Title Slide (Ecosystem Entry)
* **Title**: PARAKH: Secure, Transparent & Blockchain-Anchored Board Examination System
* **Subtitle**: A Unified Digital Trust Monorepo for National Examination Lifecycle Management
* **Visuals**: Clean minimalist mockups of the 4 portals on a grid.
* **Key Bullet Points**:
  * Unified codebase: Nx Monorepo.
  * Real-time backend: Supabase, PostgreSQL, and Deno Edge.
  * Cryptographic proof: Automated blockchain anchoring.

### Slide 2: The Problem Statement (The Trust Crisis)
* **Title**: The Vulnerability of Board Examinations
* **Visuals**: Flow diagram showing points of failure (paper leaks in transport, fake students at check-in, manual grading errors, forged PDF certificates).
* **Key Bullet Points**:
  * Logistic leaks: Unsecured physical distribution.
  * Identity fraud: Lack of biometric validation.
  * Credentials counterfeiting: High ease of editing digital PDFs.

### Slide 3: The PARAKH Solution
* **Title**: End-to-End Cryptographic Governance
* **Visuals**: Split-screen showing the 4 portals working concurrently.
* **Key Bullet Points**:
  * **Admin Command**: Seal and encrypt papers instantly.
  * **Exam Center**: Lock down local networks, check biometrics, audit printing.
  * **Student Hub**: Securely access grades and digital transcripts.
  * **Public Verifier**: Instantly validate certificate hashes.

### Slide 4: Database & Storage Design
* **Title**: Relational Security & Row-Level Access (RLS)
* **Visuals**: Schema diagram showing `public` tables linking to `storage.objects`.
* **Key Bullet Points**:
  * Enforced RLS: Strict roles (Controller, Auditor, Supervisor, Verifier).
  * Hardened Storage: Private buckets for scans and papers, public buckets for verified certificates.
  * Instant Auditing: Automatic PL/pgSQL audit triggers on all write events.

### Slide 5: Cryptographic & Blockchain Anchoring
* **Title**: Tamper-Proof Credentials Verification
* **Visuals**: Diagram showing document content → SHA-256 hash → Blockchain Block linking.
* **Key Bullet Points**:
  * **Deno Edge Functions**: Encrypts papers and compiles high-fidelity PDF certificates server-side.
  * **Mock Ledger**: PostgreSQL database trigger automatically chains hash records in a simulated blockchain.
  * **Public Drag-and-Drop**: Verification portal matches uploaded PDF bytes against the blockchain ledger.

### Slide 6: Summary & Pitch
* **Title**: Why PARAKH Wins
* **Visuals**: A golden badge icon: "Hackathon Champion Choice".
* **Key Bullet Points**:
  * Fully operational Nx Monorepo (Dev servers running simultaneously).
  * Highly scaleable PostgreSQL architecture.
  * Restores public faith in examination integrity.
