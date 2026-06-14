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

### 1. 🎓 Student Portal Module

The Student Portal serves as the secure interface for candidates to view details, verify documents, and download official credentials.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Portal as Student Client App
    participant DB as Supabase DB
    participant Storage as Supabase Storage
    participant Edge as Edge Function (issue-certificate)

    Student->>Portal: Request Transcript/Certificate PDF
    Portal->>DB: Check student_id record
    DB-->>Portal: Return metadata & status
    Portal->>Edge: Trigger PDF generation (auth header)
    Note over Edge: Renders PDF via pdf-lib<br/>Calculates file SHA-256 hash
    Edge->>Storage: Upload PDF to 'academic-credentials' bucket
    Edge->>DB: Insert record (fires blockchain anchor trigger)
    DB-->>Edge: Returns transaction hashes
    Edge-->>Portal: Returns signed PDF metadata & path
    Portal->>Student: Render Viewer & Download PDF
```

#### A. Architecture
* **Isolated Queries via Row-Level Security (RLS)**: Enforces `student_id = auth.uid()` on tables `public.results` and `public.certificates` so that students can access only their own records.
* **PDF Engine**: Client-side marksheet styling paired with serverless `issue-certificate` Deno function to ensure official PDF files are generated securely on the server-side.

#### B. Working Flow
1. **Dashboard Check**: The student reviews their active schedules and check-in statuses.
2. **Result Compilation**: Subject scores are returned from `public.results` as a JSON array and plotted dynamically into grade bar graphs.
3. **Download Certificate**: The student clicks download, executing the `issue-certificate` API, saving the final PDF in the S3 bucket, and returning the file with a QR verification code.

#### C. Core Features
* **Interactive marksheets** (grade bar charts, dynamic pass/fail gauges).
* **Document wallet** (Degrees, transcripts, migration certificates).
* **Audit trail logs** (history of who verified their document).

---

### 2. 💼 Admin & Central Command Module

This is the control hub used by board directors, auditors, and registrars to set up exams and securely seal question paper keys.

```mermaid
flowchart TD
    subgraph Question Lifecycle
        Q1[Create Draft] --> Q2[Pending Review]
        Q2 -->|Auditor Review| Q3[Approved / Rejected]
    end

    subgraph Paper Sealing Vault
        Q3 --> B1[Blueprint Builder]
        B1 -->|Define mark ratios & rules| B2[Generate Exam Paper]
        B2 -->|Controller clicks Seal| E1[Edge Function: seal-paper]
        E1 -->|Compute SHA-256| P1[(Generated Papers Table)]
        E1 -->|Write private S3| S1[exam-papers bucket]
        E1 -->|Anchor Block| L1[(Blockchain Records Table)]
    end
```

#### A. Architecture
* **Role-Based Clearance Controls**:
  * `ACADEMIC_AUDITOR`: Permissions restricted to checking the `questions` and `blueprints` tables.
  * `CONTROLLER`: Clearance Level 3, allowing writes to `generated_papers` and key release commands.
  * `VERIFIER`: Permission restricted to locking double-blind evaluation queues.

#### B. Working Flow
1. **Question Audit**: The Auditor accepts or rejects newly drafted questions.
2. **Dynamic Generation**: The Controller inputs standard metrics (time limit, section allocations, easy/medium/hard distribution). The generator queries the question bank and extracts a randomized set matching the rules.
3. **Vault Sealing**: The Controller enters their digital signature, executing the `seal-paper` function, locking the file in S3, and saving the SHA-256 blockchain proof.

#### C. Core Features
* **Automatic paper generators** (difficulty balancing, anti-pattern checks).
* **Double-blind grading dashboard** (allocating scanned booklets to registrars).
* **Blockchain anchor registry log** (view block history).

---

### 3. 🏫 Physical Exam Center Module

This portal operates inside physical examination centers to manage operations securely, verify candidate identities, and prevent leaks.

```mermaid
flowchart LR
    subgraph Check-in
        C1[Candidate Aadhaar / Thumbprint] --> C2{Biometric Match?}
        C2 -->|Yes| C3[Assign seat number & status Checked-in]
        C2 -->|No| C4[Flag manual override override_incident]
    end

    subgraph Decrypt & Print
        P1[Observer Key] & P2[Supervisor Key] --> D1[Secure Decrypt Key]
        D1 -->|Fetch from S3| D2[Stream PDF to secure printer]
        D2 -->|Log count| P3[(print_batches Table)]
    end
```

#### A. Architecture
* **Decentralized Printing Protocol**: Restricts printing access by requiring dual observer authentication tokens. Papers are streamed as raw print buffers rather than downloadable PDFs to prevent local saving.
* **Sniffing Sensors Integration**: Submits local RF logs and Bluetooth device entries from hardware sensors directly into the database.

#### B. Working Flow
1. **Lockdown Mode**: The Supervisor triggers lockdown, activating signal sensors.
2. **Student Check-in**: Students present their credentials, checking in with biometric validation.
3. **Dual Print Release**: The Observer and Supervisor enter their keys. The system decrypts the paper, logs the printer IP, and tracks print counts in the `print_batches` table.

#### C. Core Features
* **Local jammer & sniffer panels** (RF signal tracking, Bluetooth logs).
* **Biometric check-in logging** (attendance percentage, seating logs).
* **Incident reporter** (log impersonation, sheet exchange).

---

### 4. 🔍 Public Verification Portal

An open-access verification portal allowing universities and employers to verify document authenticity.

```mermaid
flowchart TD
    U1[User drops Markshest PDF] --> H1[Compute file SHA-256 hash]
    H1 --> Q1{Query blockchain_records}
    Q1 -->|Hash Match Found| V1[Return Status: Verified]
    Q1 -->|Hash Mismatch| V2[Return Status: Tampered/Modified]
    V1 --> D1[Display Student Name, Roll Number, Grades from database]
    V2 --> D2[Display Danger Alert: Byte changes detected!]
```

#### A. Architecture
* **No Authentication (Public Access)**: Accessible by anyone. RLS policies allow SELECT queries on the `certificates` and `blockchain_records` tables only for records marked as `Issued`.
* **Zero-Knowledge Check**: No student data is exposed during the drag-and-drop check until the uploaded file's hash matches the secure database hash.

#### B. Working Flow
1. **Upload PDF**: A recruiter drops the student's PDF transcript.
2. **Client-Side Hashing**: The browser computes the file's SHA-256 hash using the Web Crypto API.
3. **Database Match**: The hash is sent to the `verify-document` Edge Function. The function checks for matches in the blockchain records and returns the student metadata only if a secure match is verified.

#### C. Core Features
* **Drag-and-drop document hash validator**.
* **Direct lookup** (search by roll number or certificate ID).
* **Cryptographic consensus log viewer** (view signature, block number, previous hash).

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
