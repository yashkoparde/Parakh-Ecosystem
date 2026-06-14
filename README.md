# PARAKH - Ecosystem
### Proactive Assessment and Result Audit for Knowledge & Honesty

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
1. **Exam Design**: Dynamic syllabus blueprint mapping and difficulty distribution.
2. **Paper Distribution**: Cryptographic sealing and secure decentralized print release.
3. **Center Administration**: CCTV monitoring, network sniffing, and biometric candidate check-in.
4. **Grading & Verification**: Double-blind answer sheet evaluation, grading, and auditor feedback.
5. **Trust Anchoring**: Automatic result hashes anchored to a simulated blockchain ledger for tamper-proof digital verification.

---

## Deployed Ecosystem Portals

The PARAKH system is divided into **4 distinct portals** that run simultaneously in production. Click the badges below to access each deployed app:

---

### 1. Student Portal
> Access results, check schedules, and download certified academic marksheets & migration certificates.
* **Live Deployment Link**: 
  [![Student Portal Deployed](https://img.shields.io/badge/Launch-Student_Portal-61DAFB?style=for-the-badge&logo=vercel&logoColor=black)](https://parakh-student.vercel.app)
* **Key Features**:
  *  View digital certificates, transcripts, and migration records.
  *  Export high-fidelity PDFs with digital signature verification codes.
  *  Real-time notifications for published results and validation requests.

---

### 2. Admin & Central Command Portal
> Design blueprints, review question banks, securely seal papers, and audit evaluation pipelines.
* **Live Deployment Link**: 
  [![Admin Portal Deployed](https://img.shields.io/badge/Launch-Admin_Portal-143055?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-admin.vercel.app)
* **Key Features**:
  * Question creator and reviewer panels with workflow status tags.
  * Blueprint builder to generate balanced exam question papers.
  * **Sealing Vault**: Controller dashboard to cryptographically freeze papers and trigger blockchain hashes.

---

### 3. Physical Exam Center Portal
> Local dashboard for Chief Superintendents and Observers to manage local operations securely.
* **Live Deployment Link**: 
  [![Exam Center Portal Deployed](https://img.shields.io/badge/Launch-Exam_Center_Portal-38B2AC?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-exam-center.vercel.app)
* **Key Features**:
  *  Biometric & Aadhaar e-KYC candidates check-in logging.
  *  Jammer logs & RF network sniffing sensor monitoring.
  *  Secure print control manager with printer log auditing.

---

### 4. Public Verification Portal
> Open-access verification hub for universities, employers, and credentials validators.
* **Live Deployment Link**: 
  [![Public Verification Deployed](https://img.shields.io/badge/Launch-Public_Verification-3ECF8E?style=for-the-badge&logo=vercel&logoColor=white)](https://parakh-verifier.vercel.app)
* **Key Features**:
  *  Roll number & certificate ID instant lookup.
  *  **Drag-and-Drop Validator**: Upload certificate PDFs to detect any tamper or byte modifications instantly against blockchain hashes.

---

## Demo Credentials (For Evaluation)

Log in as different participants using these pre-seeded testing accounts:

| Role | Portal | Test Email | Password | Clearance / Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Student | `student@parakh.gov.in` | `StudentPass123` | View own scores, download certificates. |
| **Controller** | Admin | `controller@parakh.gov.in` | `ControllerPass123` | **Clearance Level 3**: Seal papers, issue certificates. |
| **Auditor** | Admin | `auditor@parakh.gov.in` | `AuditorPass123` | **Clearance Level 2**: Review questions, audit uploads. |
| **Verifier** | Admin | `verifier@parakh.gov.in` | `VerifierPass123` | **Clearance Level 1**: Issue result locks. |
| **Supervisor** | Exam Center | `supervisor@parakh.gov.in` | `SupervisorPass123` | CCTV monitoring, candidate check-ins, printing. |

---

## Repository File Structure

```
d:\Yash\Hackathons\Far-Away\Parakh\
├── apps/                                  # Monorepo Portals Folder
│   ├── parakh-admin-portal/               # Central administration & command
│   ├── parakh-exam-center-portal/         # Local center secure supervisor app
│   ├── parakh-public-verification-portal/ # Public credentials validator
│   └── parakh-student-portal/             # End-candidate dashboard & marksheet portal
├── package.json                           # Root dependency workspaces setup
├── nx.json                                # Nx Monorepo configuration
├── tsconfig.base.json                     # Base TypeScript config
├── supabase_schema_complete.sql           # Unified database schema script
└── supabase_edge_functions.md             # Edge Functions code templates
```

---

## Technical Architecture & Security Model

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

### 1. Database Layer ([supabase_schema_complete.sql](supabase_schema_complete.sql))
- **20 Structured Tables**: Unified relational design with foreign key constraints, checks, and unique compound indexes.
- **Triggers**:
  - `proc_audit_logger`: Automatic logging of modifications to a central compliance ledger (`audit_logs`).
  - `proc_blockchain_anchor_simulator`: On insert of certificates/results/sealed papers, it automatically calculates SHA-256 block hashes and chains them with the previous transaction record.

### 2. Storage Buckets & Policies
We secure static assets using five dedicated storage buckets configured with strict RLS (Row-Level Security) policies:
* `exam-papers` (Private): Only Controllers can upload; only Supervisors can read.
* `student-evaluation-payloads` (Private): Only Supervisors can upload; only Auditors can read.
* `academic-credentials` (Public Read): Verifiers can upload; anyone can read to verify.
* `candidate-photos` (Public Read): For biometric candidate reference cards.
* `evidence-attachments` (Private): For security incident evidence uploads.

### 3. Edge Functions Layer ([supabase_edge_functions.md](supabase_edge_functions.md))
Deployable Deno TypeScript templates for:
* `seal-paper`: Restricts access to Controller, hashes exam files, and seals the database record.
* `issue-certificate`: Compiles student scores, compiles high-fidelity PDF, uploads it, and writes the blockchain transaction ledger anchor.
* `verify-document`: Public endpoint that verifies SHA-256 integrity and prints block history.

---

## Local Setup & Development

To run all four applications simultaneously in development mode:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Each app directory has a `.env` file pre-loaded with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="https://xa..................sq.supabase.co"
   VITE_SUPABASE_ANON_KEY="sb_publishable_zctZ....EkA_B35fngfX..."
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
