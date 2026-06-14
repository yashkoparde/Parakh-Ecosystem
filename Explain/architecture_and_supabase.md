# PARAKH System Architecture & Supabase Specification
### Technical Blueprint for NotebookLM ingestion

This document outlines the detailed system architecture, database schema, storage design, and cryptographic security features of the **PARAKH Ecosystem**. It is designed to provide complete technical context for generating reports, presentation slides, and script narratives.

---

## 🏗️ 1. High-Level System Architecture

PARAKH is designed as a **Secure Digital Trust Network** for national-level educational boards. It replaces traditional, paper-heavy, and opaque examination pipelines with a cryptographically audited, multi-portal web application.

```
+-------------------------------------------------------------------------+
|                          NX WORKSPACE MONOREPO                          |
|                                                                         |
|  +------------------+  +------------------+  +------------------+  +--  |
|  |  Student Portal  |  |   Admin Portal   |  |   Exam Center    |  | P  |
|  |   (Port 3000)    |  |   (Port 3003)    |  |   (Port 3002)    |  | (  |
|  +------------------+  +------------------+  +------------------+  +--  |
+-------------------------------------------------------------------------+
       |                        |                        |
       +------------------------+------------------------+
                                |
                                v
                   [ SUPABASE BACKEND-AS-A-SERVICE ]
       +------------------------+------------------------+
       |                        |                        |
       v                        v                        v
+--------------+        +--------------+        +------------------+
|  PostgreSQL  |        |  S3 Storage  |        | Deno TypeScript  |
|   Database   |        |   Buckets    |        |  Edge Functions  |
+--------------+        +--------------+        +------------------+
```

### A. Frontend Monorepo (Nx Workspace)
* **Framework**: React 19 (TypeScript) & Vite 6.
* **Styling**: Tailwind CSS v4 (offering ultra-modern layout elements, neon glow interfaces, glassmorphism panels, and clean visual layouts).
* **Package Workspaces**: Multi-project npm workspaces managed under the `apps/` directory to share styling guidelines, types, and dependencies.
* **Unified Build Engine**: Managed via **Nx** which coordinates lint checking (`tsc --noEmit`), styling formatting, and parallel building, reducing production build pipelines to seconds using workspace caching.

### B. Backend Services (Supabase)
* **Database**: Managed PostgreSQL database instance containing full schemas, checks, and foreign keys.
* **Storage**: Five distinct object storage buckets to hold raw candidate scans, certified PDFs, test-paper packages, photos, and incident evidence.
* **Edge Compute**: Deno-based serverless Edge Functions executing cryptographic hashing, security authorization, and automated PDF document generation.

---

## 🗄️ 2. PostgreSQL Database Schema Specification

The database utilizes custom types, strict foreign key constraints, speed indexes, and custom PL/pgSQL database triggers to enforce compliance and simulate blockchain security.

### A. Custom Enums and Type Constraints
* `user_role_enum`: Enforces four distinct administrative classes: `CONTROLLER` (Central authority), `SUPERVISOR` (Center heads), `ACADEMIC_AUDITOR` (Paper reviewers), and `VERIFIER` (Evaluations registrar).
* `clearance_level_enum`: Determines access to security commands: `LEVEL_1` (Staff), `LEVEL_2` (Supervisors), and `LEVEL_3` (Controllers).
* `question_status_enum`: Manages the lifecycle of the question repository (`Draft`, `Pending Review`, `Approved`, `Rejected`).
* `evaluation_status_enum`: Tracks double-blind paper reviews (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`).
* `session_status_enum`: Exam center session status (`Scheduled`, `Active`, `Completed`, `Suspended`).

### B. Core Tables Structure
1. **`admin_users`**: Extends Supabase auth.users to store administrative metadata, assigned subject codes, and multi-factor authentication (MFA) status.
2. **`students`**: Stores master candidate records (roll number, candidate ID, father's/mother's name, registered school, stream).
3. **`subjects`**: Domain metadata (chapters count, maximum marks, passing scores, stream categories).
4. **`exam_centers`**: Details physical centers, supervisor links, VPN connection status, and observer assignments.
5. **`center_staff`**: Registry of invigilators and observer presence with biometric verification codes.
6. **`questions`**: Stores question text, JSON option sets for multiple-choice questions (MCQs), answers, explanations, and cognitive levels.
7. **`blueprints`**: Syllabus version control, total marks, time limits, and difficulty distribution rules (e.g. 40% Easy, 40% Medium, 20% Hard).
8. **`generated_papers`**: Stores sealed question papers, unique SHA-256 paper hashes, and questions subset lists.
9. **`exam_sessions`**: Exam scheduling per center, tracking the release status of decryption keys.
10. **`session_candidates`**: Exam attendance tracking, room/seat mapping, check-in timestamps, and biometric match scores.
11. **`print_batches`**: Logs printer IP, operator name, total prints required, and actual printed counts to prevent duplicate papers.
12. **`device_events`**: Sniffer logs mapping RF signal frequency (MHz) and signal strength (dBm) to detect illicit transmitters near halls.
13. **`incident_reports`**: Enforces strict reporting of cheating, delays, or misconduct with severity grading (`Low`, `Warning`, `Critical`).
14. **`evaluation_jobs`**: Double-blind paper checking queues, tracking raw scanning uploads.
15. **`results`**: Consolidated candidate scores, grades, pass status, and blockchain hash links.
16. **`certificates`**: Digital certified credentials (Degrees, Transcripts, Migration Certificates) generated in PDF format.
17. **`blockchain_records`**: Simulated immutable ledger recording block numbers, previous block hashes, signatures, and timestamps.
18. **`verification_requests`**: Logs auditing checks requested by external employers or universities.
19. **`notifications` & `audit_logs`**: System audit trail logging all modifications.

---

## 🔒 3. Row-Level Security (RLS) & Storage Policies

Every table and storage bucket enforces strict row-level security to prevent unauthorized access or data leakage.

### A. Table RLS Policies
* **Results & Certificates**: Students can select only their own records (`student_id = auth.uid()`). Verifiers and Controllers have write privileges.
* **Exam Papers**: Supervisors can select papers assigned to their center only if the exam is active. Only Controllers can generate or insert them.
* **Questions & Blueprints**: Restricted to Academic Auditors and Controllers.
* **Audit Logs**: Only accessible to Controllers.

### B. Storage Buckets & Policies
1. **`exam-papers` (Private)**:
   * Upload: Only users with the role `CONTROLLER` can write.
   * Download: Only users with the role `SUPERVISOR` or `CONTROLLER` can read.
2. **`student-evaluation-payloads` (Private)**:
   * Upload: Only `SUPERVISOR` users can write (to upload scanned answer booklets).
   * Download: Only `ACADEMIC_AUDITOR` or `CONTROLLER` users can read (for grading).
3. **`academic-credentials` (Public Read, Protected Write)**:
   * Upload: Only `VERIFIER` or `CONTROLLER` users can write.
   * Download: Publicly readable by anyone to allow open-access verification of PDF marksheets.
4. **`evidence-attachments` (Private)**:
   * Upload: Only `SUPERVISOR` users can write.
   * Download: Restricted to `SUPERVISOR` and `CONTROLLER` for reviewing security incidents.
5. **`candidate-photos` (Public Read)**:
   * Publicly accessible to display candidate reference cards during verification check-in.

---

## ⚙️ 4. PL/pgSQL Triggers & Edge Functions

### A. Advanced PostgreSQL Database Triggers
* **Universal Audit Logger (`proc_audit_logger`)**:
  Intercepts all database write actions (`INSERT`, `UPDATE`, `DELETE`) on questions, blueprints, and results. It extracts the actor's UUID from the JWT, resolves their email, and logs the changes as a JSON diff in `public.audit_logs`.
* **Blockchain Anchor Simulator (`proc_blockchain_anchor_simulator`)**:
  Triggered when certificates, results, or exam papers are generated. It calculates a SHA-256 hash using the record content and the previous block hash (`previous_block_hash`), increments the `block_number`, creates an HMAC signature, and writes it to `public.blockchain_records` before updating the parent record's `tx_hash` and status.

### B. Supabase Edge Functions (Deno TypeScript)
1. **`seal-paper`**:
   Accepts a generated exam paper. Checks if the caller is a Level 3 Controller, calculates the SHA-256 hash, inserts the sealed record, and locks the questions subset.
2. **`issue-certificate`**:
   Triggered on exam compilation. Fetches the candidate's scores, compiles a high-fidelity certificate PDF using the Deno port of `pdf-lib`, uploads the file to the `academic-credentials` bucket, and triggers the blockchain trigger.
3. **`verify-document`**:
   Public API endpoint. Accepts a certificate number or PDF document hash, queries `blockchain_records`, and returns the verification status (Match / Modification Detected) alongside block metadata.
