# 🎓 PARAKH Ecosystem
### Secure, Transparent & Blockchain-Anchored Board Examination Management System

<p align="center">
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" alt="Nx Monorepo Logo" width="100" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nx-Monorepo-143055?style=for-the-badge&logo=nx&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Deno-Edge_Functions-ffffff?style=for-the-badge&logo=deno&logoColor=black" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📖 Overview

**PARAKH** is an advanced digital trust network designed for national-level education boards (like CBSE, NTA, etc.). It automates and secures the entire lifecycle of high-stakes examinations:
1. 📝 **Exam Design**: Dynamic syllabus blueprint mapping and difficulty distribution.
2. 🔐 **Paper Distribution**: Cryptographic sealing and secure decentralized print release.
3. 🏫 **Center Administration**: CCTV monitoring, network sniffing, and biometric candidate check-in.
4. 📊 **Grading & Verification**: Double-blind answer sheet evaluation, grading, and auditor feedback.
5. 🔗 **Trust Anchoring**: Automatic result hashes anchored to a simulated blockchain ledger for tamper-proof digital verification.

---

## 🚀 Deployed Ecosystem Portals

The PARAKH system is divided into **4 distinct portals** that run simultaneously in production. Click the badges below to access each deployed app:

---

### 1. 🎓 Student Portal
> Access results, check schedules, and download certified academic marksheets & migration certificates.
* **Live Deployment Link**: 
  [![Student Portal Deployed](https://img.shields.io/badge/Launch-Student_Portal-61DAFB?style=for-the-badge&logo=vercel&logoColor=black)](https://parakh-student.vercel.app) *(Update URL with your deployed link)*
* **Key Features**:
  * 📜 View digital certificates, transcripts, and migration records.
  * ⬇️ Export high-fidelity PDFs with digital signature verification codes.
  * 🔔 Real-time notifications for published results and validation requests.

---

### 2. 💼 Admin & Central Command Portal
> Design blueprints, review question banks, securely seal papers, and audit evaluation pipelines.
* **Live Deployment Link**: 
  [![Admin Portal Deployed](https://img.shields.io/badge/Launch-Admin_Portal-143055?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-admin.vercel.app) *(Update URL with your deployed link)*
* **Key Features**:
  * ✍️ Question creator and reviewer panels with workflow status tags.
  * 📐 Blueprint builder to generate balanced exam question papers.
  * 🔏 **Sealing Vault**: Controller dashboard to cryptographically freeze papers and trigger blockchain hashes.

---

### 3. 🏫 Physical Exam Center Portal
> Local dashboard for Chief Superintendents and Observers to manage local operations securely.
* **Live Deployment Link**: 
  [![Exam Center Portal Deployed](https://img.shields.io/badge/Launch-Exam_Center_Portal-38B2AC?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-exam-center.vercel.app) *(Update URL with your deployed link)*
* **Key Features**:
  * 🪪 Biometric & Aadhaar e-KYC candidates check-in logging.
  * 🚨 Jammer logs & RF network sniffing sensor monitoring.
  * 🖨️ Secure print control manager with printer log auditing.

---

### 4. 🔍 Public Verification Portal
> Open-access verification hub for universities, employers, and credentials validators.
* **Live Deployment Link**: 
  [![Public Verification Deployed](https://img.shields.io/badge/Launch-Public_Verification-3ECF8E?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-public-verification.vercel.app) *(Update URL with your deployed link)*
* **Key Features**:
  * 🔍 Roll number & certificate ID instant lookup.
  * 📄 **Drag-and-Drop Validator**: Upload certificate PDFs to detect any tamper or byte modifications instantly against blockchain hashes.

---

## 🔑 Demo Credentials (For Evaluation)

Log in as different participants using these pre-seeded testing accounts:

| Role | Portal | Test Email | Password | Clearance / Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | 🎓 Student | `student@parakh.gov.in` | `StudentPass123` | View own scores, download certificates. |
| **Controller** | 💼 Admin | `controller@parakh.gov.in` | `ControllerPass123` | **Clearance Level 3**: Seal papers, issue certificates. |
| **Auditor** | 💼 Admin | `auditor@parakh.gov.in` | `AuditorPass123` | **Clearance Level 2**: Review questions, audit uploads. |
| **Verifier** | 💼 Admin | `verifier@parakh.gov.in` | `VerifierPass123` | **Clearance Level 1**: Issue result locks. |
| **Supervisor** | 🏫 Exam Center | `supervisor@parakh.gov.in` | `SupervisorPass123` | CCTV monitoring, candidate check-ins, printing. |

---

## 🛡️ Technical Architecture & Security Model

```mermaid
flowchart TB
    subgraph Client Apps
        A1[Student Portal]
        A2[Admin Portal]
        A3[Exam Center]
        A4[Public Verifier]
    end

    subgraph Supabase Cloud
        B1[(PostgreSQL DB)]
        B2[Storage Buckets]
        B3[Deno Edge Functions]
    end

    subgraph Trust Ledger
        C1[Audit Log Trail]
        C2[Blockchain Anchor Records]
    end

    A1 & A2 & A3 & A4 -->|queries| B1
    A1 & A2 & A3 & A4 -->|uploads| B2
    A1 & A2 & A3 & A4 -->|calls| B3

    B1 -->|triggers| C1
    B1 -->|automatic hashes| C2
    B3 -->|crypto checks| C2
```

---

## 💻 Modules Deep Dive

---

### 1. 🎓 Student Portal Module (`apps/parakh-student-portal`)

The Student Portal serves as a secure, authenticated interface for candidates to view active exam schedules, check published grades, and download certified academic marksheets & transcripts signed cryptographically.

```mermaid
sequenceDiagram
    autonumber
    actor Student as 🎓 Student Candidate
    participant Portal as 🖥️ Student Portal Client<br/>(React/Vite)
    participant Supabase as ⚡ Supabase Auth & DB
    participant Deno as ⚙️ Deno Edge Function<br/>(issue-certificate)
    participant Storage as 📦 Storage Bucket<br/>(academic-credentials)
    participant Ledger as 🔗 Blockchain Ledger<br/>(blockchain_records)

    Student->>Portal: Authenticates via login
    Portal->>Supabase: Session authorization check (JWT)
    Supabase-->>Portal: Returns Auth Token (Bearer JWT)
    
    Student->>Portal: Accesses "Certificates Matrix"
    Portal->>Supabase: Query certificates table (enforced by RLS)
    Note over Supabase: RLS Enforced:<br/>student_id = auth.uid()
    Supabase-->>Portal: Returns verified certificate rows
    
    Student->>Portal: Clicks "Download Signed PDF"
    Portal->>Deno: Trigger issue-certificate (includes JWT token)
    Note over Deno: Authenticates caller & role via getUser()<br/>Queries student record metadata<br/>Compiles PDF layout via esm.sh/pdf-lib
    Deno->>Storage: Uploads compiled PDF bytes to certs/ directory
    Deno->>Supabase: Inserts record in certificates table
    Note over Supabase: Trigger fires:<br/>tr_blockchain_anchor_cert
    Supabase->>Ledger: Appends immutable block record<br/>(Generates block_number, signature, tx_hash)
    Ledger-->>Supabase: Returns transaction details
    Supabase-->>Deno: Confirms record & trigger execution
    Deno-->>Portal: Returns PDF URL & verification path
    Portal->>Student: Initiates PDF file download
```

#### A. Code & File Architecture
* **[`src/components/Dashboard.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/Dashboard.tsx)**: Main dashboard console. Compiles candidate metadata, active notifications feed, and exam schedule tickers.
* **[`src/components/ResultsModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/ResultsModule.tsx) & [`ResultDetail.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/ResultDetail.tsx)**: Pulls data from the `results` table. Plots marks in dynamic visual charts, calculates SGPA averages, and maps result transactions to blockchain hashes (`tx_hash`).
* **[`src/components/CertificatesModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/CertificatesModule.tsx) & [`CertificateDetail.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/CertificateDetail.tsx)**: Displays the student's personal credential wallet, enabling users to request PDF generation from the `issue-certificate` Deno Edge Function.
* **[`src/components/ExaminationsModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/ExaminationsModule.tsx)**: Renders digital hall tickets, schedules, subject timelines, and supervisor contact entries.
* **[`src/components/VerificationModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/VerificationModule.tsx)**: Logs third-party credentials lookups requested by external employers or universities from `verification_requests` to provide candidates transparency over who verified their data.
* **[`src/components/ProfileView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/ProfileView.tsx)**: Displays full candidate profile metadata (`students` table), including DOB, school name, and masked Aadhaar reference codes (`aadhaar_reference`).
* **[`src/components/NotificationsView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/NotificationsView.tsx)**: Displays dynamic system alerts, result publication notifications, and credential issuance logs.
* **[`src/components/SupportView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-student-portal/src/components/SupportView.tsx)**: Candidate assistance and ticket logging console.

#### B. Database Schema & API Integrations
* **Database Tables**: Reads from `students`, `results`, `certificates`, `blockchain_records`, `verification_requests`, and `notifications`.
* **Row-Level Security (RLS)**: Enforces isolation so students cannot query other candidates' details:
  ```sql
  CREATE POLICY "Student access restriction" 
  ON public.certificates FOR SELECT 
  USING (student_id = auth.uid());
  ```
* **Edge Function Call**: Dispatches authorized POST requests to `/functions/v1/issue-certificate` with the student ID, document number, name, and certificate type.

---

### 2. 💼 Admin & Central Command Module (`apps/parakh-admin-portal`)

The central command dashboard used by Board Controllers, Question Reviewers, and Verification Registrars to author question pools, build syllabus blueprints, generate secure exam papers, audit double-blind grading pipelines, and inspect blockchain transaction logs.

```mermaid
flowchart TD
    subgraph Drona [1. Question Item Bank & Peer Review]
        A1[Question Creator] -->|Draft| A2[Auditor Review Docket]
        A2 -->|Approve/Reject + Comments| A3[(questions Table)]
    end

    subgraph Veda [2. Assembly & Sealing Vault]
        A3 --> B1[Blueprint Builder]
        B1 -->|Difficulty Distributions & Marks| B2[Procedural Generation Assembly]
        B2 -->|Save Revision v1/v2/v3| B3[Review Generated Paper Preview]
        B3 -->|Controller Clicks Seal| B4[Edge Function: seal-paper]
        B4 -->|SHA-256 Checksum| B5[(generated_papers Table)]
        B4 -->|Attach Trigger: tr_blockchain_anchor_paper| B6[(blockchain_records Table)]
    end

    subgraph Mulya [3. Double-Blind Grading Audit]
        C1[Upload Booklet Scan Package] --> C2[(evaluation_jobs Table)]
        C2 -->|Assign blind verifiers| C3[Verifiers Input Scores]
        C3 -->|Double Check Deviations| C4[Lock Evaluation Results]
        C4 -->|Attach Trigger: tr_blockchain_anchor_result| C5[(results Table)]
    end

    style B4 fill:#3ECF8E,stroke:#000,stroke-width:2px,color:#000
    style B6 fill:#646CFF,stroke:#000,stroke-width:2px,color:#fff
    style C5 fill:#646CFF,stroke:#000,stroke-width:2px,color:#fff
```

#### A. Code & File Architecture
* **[`src/components/DashboardModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/DashboardModule.tsx)**: System-wide command center overview, displaying aggregate metrics of online centers, total check-ins, and active exam batches.
* **[`src/components/DronaModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/DronaModule.tsx)**: Handles the central item bank. Features three tabs: *Question Bank* (lists and filters questions by cognitive compliance level and difficulty), *Review & Approvals* (permits auditors to approve or reject items with mandatory feedback comments), and *Activity Logs* (displays question modifications).
* **[`src/components/VedaModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/VedaModule.tsx)**: The blueprint constructor and paper assembler. Configures blueprints (Easy, Medium, Hard percentages and Marks) and procedurally compiles papers from approved questions. Contains an amendment versioning editor allowing controllers to replace questions, adjust versions, see diffs, and invoke the Deno `seal-paper` function to lock the exam paper.
* **[`src/components/MulyaModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/MulyaModule.tsx)**: Double-blind grading workspace. Displays scan lists and deviation metrics (calculating standard deviation `σ` and variance), flags grading discrepancies, and submits final grade commits to lock results.
* **[`src/components/SakshyaModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/SakshyaModule.tsx)**: Blockchain explorer. Controllers input transaction hashes to query the simulated ledger (`blockchain_records`), revealing block numbers, previous hash links, signatures, and timestamps.
* **[`src/components/AdminDirectory.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-admin-portal/src/components/AdminDirectory.tsx)**: System directories split into tabs:
  * *Users*: Manage board personnel, roles (`CONTROLLER`, `SUPERVISOR`, etc.), and hardware MFA status.
  * *CCTV & Centers*: Capacity details, VPN statuses, and CCTV overrides.
  * *Syllabus Subjects*: Setup class level (10/12) and chapter count.
  * *Sys-Logs*: Visual audit logs querying database changes.
  * *Cryptographic Keys*: Public-key registry for active signing certificates.

#### B. Database Schema & API Integrations
* **Database Tables**: Interfaces with `admin_users`, `questions`, `blueprints`, `generated_papers`, `evaluation_jobs`, `results`, `blockchain_records`, and `audit_logs`.
* **Universal Audit Logger Trigger (`proc_audit_logger`)**:
  Fires automatically on changes to `questions`, `blueprints`, `generated_papers`, and `results`. It logs JSON diffs containing old and new row values directly into `audit_logs`, tracking administrator behavior:
  ```sql
  CREATE OR REPLACE TRIGGER tr_audit_questions
  AFTER INSERT OR UPDATE OR DELETE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.proc_audit_logger();
  ```
* **Blockchain Anchor Trigger (`proc_blockchain_anchor_simulator`)**:
  Triggered when a result is finalized or an exam paper is sealed, creating a ledger record:
  ```sql
  CREATE OR REPLACE TRIGGER tr_blockchain_anchor_paper
  AFTER INSERT ON public.generated_papers
  FOR EACH ROW EXECUTE FUNCTION public.proc_blockchain_anchor_simulator();
  ```
* **Edge Function Call**: Invokes `/functions/v1/seal-paper` with paper structures, credentials, and center boundaries to lock questions and output paper SHA-256 checksums.

---

### 3. 🏫 Physical Exam Center Module (`apps/parakh-exam-center-portal`)

A security-hardened local hub deployed in physical exam halls, managed by Chief Supervisors and Observers to coordinate candidates admission, run wireless signal scans, and decrypt paper packets minutes before testing.

```mermaid
flowchart LR
    subgraph Entrance [1. Biometric Candidate Admission]
        I1[Candidate ID & Thumbprint Scan] --> I2{Aadhaar e-KYC API}
        I2 -->|Biometric Match| I3[Check-in Success: Assign Seat]
        I2 -->|Mismatch / Failure| I4[Flag Incident Report: Impersonation]
        I3 --> I5[(session_candidates Table)]
    end

    subgraph Security [2. Signal Anomaly Sniffing]
        S1[RF sniffer sensors] -->|Frequency & Signal Strength| S2[(device_events Table)]
        S2 -->|Signal > Threshold| S3[Trigger Alert: Bluetooth/Mobile Detection]
    end

    subgraph Release [3. Dual-Key Paper Decryption]
        K1[Supervisor Session Token] & K2[Observer Board Token] --> R1{Decryption Vault}
        R1 -->|Dual Authorize Approved| R2[Decrypt Paper Package ZIP]
        R2 -->|Stream to Physical Printer| R3[(print_batches Table)]
        R3 -->|Print Counts Logged| R4[Prevent Duplicate Printing]
    end
```

#### A. Code & File Architecture
* **[`src/components/DashboardView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/DashboardView.tsx)**: Aggregates real-time stats including candidate check-in counts, jammer signals status, VPN tunnel states, print log warnings, and active security incidents.
* **[`src/components/CandidateVerificationView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/CandidateVerificationView.tsx) & [`AttendanceView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/AttendanceView.tsx)**: Manages candidate grids. Admits candidates by executing biometric check-in matches against Aadhaar databases, assigning seat maps, and editing attendance records.
* **[`src/components/PaperReleaseView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/PaperReleaseView.tsx)**: The decryption workbench. Enforces the dual-authorization protocol, requiring the Supervisor and the NTA Observer to enter their clearance keys concurrently to authorize download.
* **[`src/components/PrintControlView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/PrintControlView.tsx)**: Printer auditor. Coordinates local paper streaming and updates `print_batches` (auditing printer IPs, operator names, and total copies printed) to prevent duplicate paper distribution.
* **[`src/components/DeviceDetectionView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/DeviceDetectionView.tsx)**: RF scanner console. Logs mobile signals, smartwatches, and Bluetooth transmitters, reporting frequency (MHz) and signal strength (dBm) in `device_events`.
* **[`src/components/IncidentReportingView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/IncidentReportingView.tsx)**: Malpractice log dashboard. Supervisors report incidents (cheating, impersonation, delays) with critical/warning tags directly into the `incident_reports` table.
* **[`src/components/IntegrityMonitoringView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/IntegrityMonitoringView.tsx)**: Room-wise CCTV monitor. Simulates video feeds, captures cameras online/offline states, and triggers local lockdowns.
* **[`src/components/SessionsView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/SessionsView.tsx) & [`StaffView.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-exam-center-portal/src/components/StaffView.tsx)**: Lists scheduled exam shifts and displays authorized center staff profiles.

#### B. Database Schema & API Integrations
* **Database Tables**: Interacts with `exam_centers`, `center_staff`, `exam_sessions`, `session_candidates`, `print_batches`, `device_events`, and `incident_reports`.
* **Row-Level Security (RLS)**: Restrains data queries by center boundary policies, ensuring center supervisors only access attendance logs matching their assigned `exam_center_code`.

---

### 4. 🔍 Public Verification Module (`apps/parakh-public-verification-portal`)

An open-access validation tool for third-party entities (employers, universities, registrars) to confirm academic records authenticity.

```mermaid
sequenceDiagram
    autonumber
    actor Verifier as 🔍 Third-Party Verifier
    participant Portal as 🖥️ Public Verification Client<br/>(React/Vite)
    participant Deno as ⚙️ Deno Edge Function<br/>(verify-document)
    participant Supabase as ⚡ Supabase DB & Ledger

    Verifier->>Portal: Drags & Drops Certificate PDF
    Note over Portal: Computes file SHA-256 hash locally<br/>via browser Web Crypto API<br/>(File bytes never leave browser)
    Portal->>Deno: Sends computed SHA-256 hash & reference number
    Deno->>Supabase: Queries certificates & blockchain_records tables
    Note over Supabase: Matches PDF hash against anchored ledger
    Supabase-->>Deno: Returns blockchain anchor matching details
    Deno-->>Portal: Returns verification confirmation payload
    Portal->>Verifier: Displays glowing trust shield:<br/>"Authentic Certificate" + Block Metadata
```

#### A. Code & File Architecture
* **[`src/components/MainVerificationModule.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-public-verification-portal/src/components/MainVerificationModule.tsx)**: The main validator workspace. Integrates drag-and-drop file inputs, handles client-side PDF parsing, generates SHA-256 byte hashes in-browser using browser-native `window.crypto.subtle`, and calls the Deno `verify-document` backend.
* **[`src/components/RegistryLookup.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-public-verification-portal/src/components/RegistryLookup.tsx)**: Registry search console. Resolves credentials instantly from the database by querying the unique Roll Number or Certificate ID.
* **[`src/components/AuditProofViewer.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-public-verification-portal/src/components/AuditProofViewer.tsx)**: The blockchain block visualizer card. Displays transaction hashes (`tx_hash`), block indices, authority signatures, previous block hashes, and timestamps.
* **[`src/components/OfficialVerificationGuide.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-public-verification-portal/src/components/OfficialVerificationGuide.tsx) & [`PrestigeIntro.tsx`](file:///d:/Yash/Hackathons/Far-Away/Parakh/apps/parakh-public-verification-portal/src/components/PrestigeIntro.tsx)**: Displays credentials validation rules, policy statements, and portal guides.

#### B. Database Schema & API Integrations
* **Database Tables**: Accesses `certificates`, `blockchain_records`, and logs lookup transactions in the `verification_requests` table.
* **Row-Level Security (RLS)**: Bypass policies permit selective public SELECT operations on certificates and blockchain anchors matching the uploaded SHA-256 signature to allow verification.
* **Edge Function Call**: Queries `/functions/v1/verify-document` with the certificate's document hash and reference ID, executing database validation and returning verification payloads.

---

## 💻 Local Setup & Development

To run all four applications simultaneously in development mode:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Each app directory has a `.env` file pre-loaded with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="https://xapeorzscuwggqqocvsq.supabase.co"
   VITE_SUPABASE_ANON_KEY="sb_publishable_zctZhq8PRiP3GxhOwr2EkA_B35fngfX..."
   ```

3. **Start All Servers**:
   ```bash
   npx nx run-many -t dev --parallel=4
   ```
   Open your browser to:
   * **Student Portal**: `http://localhost:3000`
   * **Public Verification**: `http://localhost:3001`
   * **Exam Center Portal**: `http://localhost:3002`
   * **Admin Portal**: `http://localhost:3003`

4. **Build All Apps**:
   ```bash
   npx nx run-many -t build
   ```
