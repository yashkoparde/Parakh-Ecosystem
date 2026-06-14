-- =====================================================================
-- PARAKH DATABASE MASTER ECOSYSTEM SCHEMA SPECIFICATION
-- Target: Supabase / PostgreSQL
-- Version: 2.0 (Complete Monorepo Unification)
-- Description: Unifies database structure for Admin Portal, Exam Center,
--              Public Verification, and Student Portal.
-- =====================================================================

-- =====================================================================
-- 1. EXTENSIONS & CUSTOM TYPE DEFINITIONS (ENUMS)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles
CREATE TYPE public.user_role_enum AS ENUM (
    'CONTROLLER',          -- Central command controllers
    'SUPERVISOR',          -- Physical exam center supervisors
    'ACADEMIC_AUDITOR',    -- Reviewers and auditors of papers & results
    'VERIFIER'             -- Verifiers for official documents
);

-- Security Clearance Levels
CREATE TYPE public.clearance_level_enum AS ENUM (
    'LEVEL_1',             -- Standard staff
    'LEVEL_2',             -- Managers/Supervisors
    'LEVEL_3'              -- Ultimate Controllers (Can seal/release papers)
);

-- Question Statuses
CREATE TYPE public.question_status_enum AS ENUM (
    'Draft', 
    'Pending Review', 
    'Approved', 
    'Rejected'
);

-- Question Difficulty Levels
CREATE TYPE public.difficulty_enum AS ENUM (
    'Easy', 
    'Medium', 
    'Hard'
);

-- Evaluation Jobs States
CREATE TYPE public.evaluation_status_enum AS ENUM (
    'PENDING', 
    'IN_PROGRESS', 
    'COMPLETED', 
    'FAILED'
);

-- Candidate Attendance & Check-in Verification
CREATE TYPE public.verification_status_enum AS ENUM (
    'Verified', 
    'Pending', 
    'Rejected', 
    'Duplicate', 
    'Absent'
);

-- CCTV or Security Statuses
CREATE TYPE public.security_status_enum AS ENUM (
    'ONLINE', 
    'OFFLINE', 
    'SUSPENDED'
);

-- Device Event Categories (Jamming / RF Sniffing)
CREATE TYPE public.device_type_enum AS ENUM (
    'Mobile Phone', 
    'Bluetooth Beacon', 
    'Smart Watch', 
    'Micro Transmitter', 
    'RF Burst'
);

-- Incident & Severity Levels
CREATE TYPE public.severity_enum AS ENUM (
    'Low', 
    'Warning', 
    'Critical'
);

-- Incident Status
CREATE TYPE public.incident_status_enum AS ENUM (
    'Pending Investigation', 
    'Resolved - Action Taken', 
    'Escalated to Central Command', 
    'Closed'
);

-- Incident Types
CREATE TYPE public.incident_type_enum AS ENUM (
    'Impersonation', 
    'Device Detection', 
    'Cheating / Sheet Exchange', 
    'Paper Distribution Delay', 
    'Staff Misconduct', 
    'Other Technical Issue'
);

-- Certificate Types
CREATE TYPE public.cert_type_enum AS ENUM (
    'Degree', 
    'Certificate', 
    'Transcript', 
    'Migration'
);

-- Exam Session Statuses
CREATE TYPE public.session_status_enum AS ENUM (
    'Scheduled', 
    'Active', 
    'Completed', 
    'Suspended'
);

-- Printing status for secure papers
CREATE TYPE public.print_status_enum AS ENUM (
    'Scheduled', 
    'Printing', 
    'Completed', 
    'Warning', 
    'Critical'
);


-- =====================================================================
-- 2. MASTER & DOMAIN DATABASE TABLES
-- =====================================================================

-- Table 1: admin_users (Supabase Auth reference)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role_enum NOT NULL DEFAULT 'VERIFIER',
    clearance_level public.clearance_level_enum NOT NULL DEFAULT 'LEVEL_1',
    assigned_subject_codes TEXT[] DEFAULT '{}'::TEXT[],
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: students (End candidates / Users reference)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    candidate_id TEXT UNIQUE NOT NULL, -- Format: PRK-YYYY-XXXXX
    roll_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    registered_institution TEXT NOT NULL,
    program TEXT NOT NULL,
    contact_email TEXT UNIQUE NOT NULL,
    contact_phone TEXT,
    academic_year TEXT NOT NULL, -- e.g., '2025-2026'
    aadhaar_reference TEXT NOT NULL, -- e.g., 'XXXX-XXXX-8910'
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    subject_code TEXT PRIMARY KEY, -- logical key, e.g. '041'
    title TEXT NOT NULL,
    class_level INTEGER NOT NULL CHECK (class_level IN (10, 12)),
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Commerce', 'Arts', 'General')),
    chapters_count INTEGER DEFAULT 0,
    max_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 33,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4: exam_centers
CREATE TABLE IF NOT EXISTS public.exam_centers (
    exam_center_code TEXT PRIMARY KEY, -- logical key
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    supervisor_id UUID REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    observer_name TEXT,
    prahari_server_ip TEXT,
    drishti_vpn_status TEXT DEFAULT 'Disconnected',
    cctv_status public.security_status_enum NOT NULL DEFAULT 'OFFLINE',
    secure_streams INTEGER DEFAULT 0,
    room_count INTEGER DEFAULT 1,
    is_locked_down BOOLEAN NOT NULL DEFAULT FALSE,
    session_clearance_active BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT DEFAULT 'Awaiting Inspections', -- 'Certified', 'Awaiting Inspections'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: center_staff (Exam invigilation and security personnel)
CREATE TABLE IF NOT EXISTS public.center_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Chief Superintendent', 'Observer (NTA/Central)', 'Invigilator', 'Technical Support', 'Security Officer')),
    biometric_verified BOOLEAN NOT NULL DEFAULT FALSE,
    biometric_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present - Active', 'On Break', 'Absent')),
    assigned_room TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 6: questions (Question Bank Repository)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE CASCADE,
    difficulty public.difficulty_enum NOT NULL,
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB, -- For MCQs: ['Option A', 'Option B', 'Option C', 'Option D']
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    marks_weight INTEGER NOT NULL DEFAULT 1 CHECK (marks_weight > 0),
    status public.question_status_enum NOT NULL DEFAULT 'Draft',
    created_by UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    reviewed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 7: blueprints
CREATE TABLE IF NOT EXISTS public.blueprints (
    blueprint_code TEXT PRIMARY KEY, -- logical key
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    syllabus_version TEXT NOT NULL DEFAULT 'v1.0',
    total_marks INTEGER NOT NULL DEFAULT 100,
    time_limit_minutes INTEGER NOT NULL CHECK (time_limit_minutes > 0),
    difficulty_distribution JSONB NOT NULL, -- e.g. {'Easy': 40, 'Medium': 40, 'Hard': 20}
    section_rules JSONB NOT NULL, -- Section rules array
    status TEXT CHECK (status IN ('Draft', 'Approved')) DEFAULT 'Draft',
    created_by UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 8: generated_papers
CREATE TABLE IF NOT EXISTS public.generated_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_code TEXT NOT NULL REFERENCES public.blueprints(blueprint_code) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    paper_hash TEXT NOT NULL, -- SHA-256 for validation check
    questions_subset JSONB NOT NULL, -- Array of question objects/IDs
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Securely Sealed', 'Released')) DEFAULT 'Draft',
    blockchain_tx TEXT, -- Block hash anchor link
    released_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 9: exam_sessions
CREATE TABLE IF NOT EXISTS public.exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_name TEXT NOT NULL,
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status public.session_status_enum NOT NULL DEFAULT 'Scheduled',
    prahari_key_status TEXT NOT NULL CHECK (prahari_key_status IN ('Locked', 'Keys Released', 'Decrypting', 'Completed')) DEFAULT 'Locked',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 10: session_candidates (Candidate exam logs inside center session)
CREATE TABLE IF NOT EXISTS public.session_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    verification_status public.verification_status_enum NOT NULL DEFAULT 'Pending',
    verification_method TEXT CHECK (verification_method IN ('Biometric (Thumbprint)', 'Retinal Scan', 'Aadhaar e-KYC', 'OMR Check', 'Manual Override')),
    biometric_score INTEGER CHECK (biometric_score BETWEEN 0 AND 100),
    checked_in_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, exam_session_id)
);

-- Table 11: print_batches (Audit log for question paper printing inside center)
CREATE TABLE IF NOT EXISTS public.print_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_paper_id UUID NOT NULL REFERENCES public.generated_papers(id) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE CASCADE,
    printer_ip TEXT NOT NULL,
    printer_name TEXT NOT NULL,
    total_required INTEGER NOT NULL,
    printed INTEGER NOT NULL DEFAULT 0,
    status public.print_status_enum NOT NULL DEFAULT 'Scheduled',
    operator_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 12: device_events (Security sniffing sensor records)
CREATE TABLE IF NOT EXISTS public.device_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE CASCADE,
    device_type public.device_type_enum NOT NULL,
    location TEXT NOT NULL,
    severity public.severity_enum NOT NULL DEFAULT 'Low',
    freq_mhz NUMERIC NOT NULL,
    dbm_strength NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Under Investigation', 'Confiscated', 'False Positive', 'Flagged')) DEFAULT 'Under Investigation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 13: incident_reports (Security incident declarations)
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE CASCADE,
    incident_type public.incident_type_enum NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    personnel_involved TEXT NOT NULL,
    candidate_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    evidence_attached TEXT, -- File name references in storage bucket
    severity public.severity_enum NOT NULL DEFAULT 'Low',
    status public.incident_status_enum NOT NULL DEFAULT 'Pending Investigation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 14: evaluation_jobs
CREATE TABLE IF NOT EXISTS public.evaluation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE RESTRICT,
    total_candidate_sheets INTEGER NOT NULL DEFAULT 0,
    evaluated_count INTEGER NOT NULL DEFAULT 0,
    verified_count INTEGER NOT NULL DEFAULT 0,
    status public.evaluation_status_enum NOT NULL DEFAULT 'PENDING',
    verification_status TEXT CHECK (verification_status IN ('Awaiting Evaluation', 'In Evaluation', 'Pending Double-Blind Verification', 'Verified & Locked', 'Flagged For Audit')) DEFAULT 'Awaiting Evaluation',
    payload_bucket_path TEXT NOT NULL, -- Reference file path inside secure storage
    evaluator_notes TEXT,
    error_logs TEXT,
    assigned_verifier UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 15: results
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    examination_name TEXT NOT NULL,
    examination_code TEXT NOT NULL, -- e.g. SSCE-2026
    roll_number TEXT NOT NULL REFERENCES public.students(roll_number) ON DELETE RESTRICT,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_year TEXT NOT NULL,
    total_marks_obtained INTEGER NOT NULL DEFAULT 0,
    total_max_marks INTEGER NOT NULL DEFAULT 500,
    overall_grade TEXT NOT NULL,
    overall_percentage NUMERIC(5, 2) NOT NULL,
    verification_status TEXT CHECK (verification_status IN ('Verified', 'Under Review', 'Pending', 'Invalid')) DEFAULT 'Pending',
    blockchain_status TEXT CHECK (blockchain_status IN ('Anchored', 'Pending', 'Failed')) DEFAULT 'Pending',
    tx_hash TEXT, -- Blockchain transaction anchor
    result_status TEXT NOT NULL CHECK (result_status IN ('Pass', 'Fail', 'Compartment')),
    subject_scores JSONB NOT NULL, -- JSON array of subject mark details
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 16: certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document_number TEXT UNIQUE NOT NULL, -- Unique cert code
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    type public.cert_type_enum NOT NULL DEFAULT 'Certificate',
    status TEXT CHECK (status IN ('Issued', 'Pending', 'Revoked')) DEFAULT 'Pending',
    verification_status TEXT CHECK (verification_status IN ('Verified', 'Under Review', 'Invalid')) DEFAULT 'Under Review',
    blockchain_hash TEXT NOT NULL, -- SHA256 of the doc contents
    tx_hash TEXT, -- Anchor blockchain transaction hash
    issuing_authority TEXT NOT NULL,
    description TEXT,
    file_path TEXT, -- Link to storage bucket path
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 17: blockchain_records (Consolidated tamper proof anchors)
CREATE TABLE IF NOT EXISTS public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_type TEXT NOT NULL CHECK (record_type IN ('Result', 'Certificate', 'Transcript', 'QuestionBank', 'ExamPaper', 'EvaluationResult', 'AccessAudit')),
    anchor_id TEXT NOT NULL, -- references ID of certificate, result or paper
    tx_hash TEXT UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    previous_block_hash TEXT NOT NULL,
    digital_signature TEXT NOT NULL,
    status TEXT CHECK (status IN ('Anchored', 'Pending Verification')) NOT NULL DEFAULT 'Pending Verification',
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 18: verification_requests (Logs for public document lookups)
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL,
    reference_number TEXT NOT NULL, -- Lookup roll_number or certificate number
    requested_by TEXT NOT NULL, -- User or agency email/name
    status TEXT CHECK (status IN ('Verified', 'Modified', 'Record Not Found', 'Invalid', 'Under Review')) DEFAULT 'Under Review',
    verification_result TEXT NOT NULL, -- Detail outputs
    blockchain_verification_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 19: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 20: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changed_fields JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    status TEXT CHECK (status IN ('COMPLIANT', 'ALERT', 'SECURITY_OVERRIDE')) DEFAULT 'COMPLIANT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 3. INDEXES FOR SPEED & SCALE LOOKUPS
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_students_roll ON public.students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_candidate_id ON public.students(candidate_id);
CREATE INDEX IF NOT EXISTS idx_results_roll ON public.results(roll_number);
CREATE INDEX IF NOT EXISTS idx_results_student ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON public.certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON public.certificates(document_number);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_code);
CREATE INDEX IF NOT EXISTS idx_session_candidates_session ON public.session_candidates(exam_session_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_center ON public.incident_reports(exam_center_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_anchor ON public.blockchain_records(anchor_id);


-- =====================================================================
-- 4. SUPABASE STORAGE BUCKETS SPECIFICATION
-- =====================================================================

-- Bucket 1: Private Exam Paper Distribution Repository
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'exam-papers', 
    'exam-papers', 
    false, -- Private access
    10485760, -- Max file size: 10MB
    ARRAY['application/pdf', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 2: Secure Evaluation Scans & Payload Upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'student-evaluation-payloads', 
    'student-evaluation-payloads', 
    false, -- Private access
    52428800, -- Max file size: 50MB (to support high-res scans or PDF packages)
    ARRAY['image/jpeg', 'image/png', 'application/pdf', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 3: Official Certified Digital Credentials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'academic-credentials', 
    'academic-credentials', 
    true, -- Publicly readable for verification lookup displays
    5120000, -- Max file size: 5MB
    ARRAY['application/pdf', 'image/png', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 4: Secure Security Incident Evidence Attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence-attachments', 
    'evidence-attachments', 
    false, -- Private access
    15728640, -- Max file size: 15MB
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 5: Candidate Verification Photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'candidate-photos', 
    'candidate-photos', 
    true, -- Public read for photo display during checking
    2097152, -- Max file size: 2MB
    ARRAY['image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all public tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on storage objects (handled automatically by Supabase, commented out to avoid ownership error)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ----------------- TABLE POLICIES -----------------

-- Admin Users Policies
CREATE POLICY "Admin users can select all admin profiles" 
ON public.admin_users FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Only Controllers can edit admin profiles" 
ON public.admin_users FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));

-- Students Policies
CREATE POLICY "Students can read their own profiles" 
ON public.students FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Admin staff can read student profiles" 
ON public.students FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Controllers can write student profiles" 
ON public.students FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));

-- Subjects Policies
CREATE POLICY "Anyone authenticated can view subjects" 
ON public.subjects FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only Controllers can modify subjects" 
ON public.subjects FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));

-- Exam Centers Policies
CREATE POLICY "Authenticated users can select exam centers" 
ON public.exam_centers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only Controllers can write exam centers" 
ON public.exam_centers FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));

-- Questions Policies
CREATE POLICY "Academic auditors and Controllers can read/write questions" 
ON public.questions FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')));

-- Blueprints Policies
CREATE POLICY "Academic auditors and Controllers can read/write blueprints" 
ON public.blueprints FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')));

-- Generated Papers Policies
CREATE POLICY "Controllers can write papers" 
ON public.generated_papers FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));

CREATE POLICY "Supervisors can read assigned papers" 
ON public.generated_papers FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')
    )
);

-- Results Policies
CREATE POLICY "Students can read their own results" 
ON public.results FOR SELECT 
TO authenticated 
USING (student_id = auth.uid());

CREATE POLICY "Verifiers and Controllers can read/write results" 
ON public.results FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('VERIFIER', 'CONTROLLER')));

-- Certificates Policies
CREATE POLICY "Students can read their own certificates" 
ON public.certificates FOR SELECT 
TO authenticated 
USING (student_id = auth.uid());

CREATE POLICY "Public can read issued certificates for verification" 
ON public.certificates FOR SELECT 
TO public 
USING (status = 'Issued');

CREATE POLICY "Verifiers and Controllers can write certificates" 
ON public.certificates FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('VERIFIER', 'CONTROLLER')));

-- Security Incidents Policies
CREATE POLICY "Supervisors and Controllers can write/read incidents" 
ON public.incident_reports FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')));

-- Audit Logs Policies
CREATE POLICY "Only Controllers can read audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'));


-- ----------------- STORAGE POLICIES -----------------

-- Policy 1: Only Controllers can upload exam papers
CREATE POLICY "Upload exam papers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'exam-papers' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'CONTROLLER'))
);

-- Policy 2: Supervisors and Controllers can download exam papers
CREATE POLICY "Download exam papers" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'exam-papers' AND
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')))
);

-- Policy 3: Supervisors can upload student evaluation scans
CREATE POLICY "Upload evaluation scans" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'student-evaluation-payloads' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')))
);

-- Policy 4: Auditors and Controllers can download evaluation scans
CREATE POLICY "Download evaluation scans" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'student-evaluation-payloads' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')))
);

-- Policy 5: Anyone can public-view certified academic credentials
CREATE POLICY "Read certified credentials" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'academic-credentials');

-- Policy 6: Only Verifiers/Controllers can upload certified academic credentials
CREATE POLICY "Upload certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'academic-credentials' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('VERIFIER', 'CONTROLLER')))
);

-- Policy 7: Supervisors can upload incident evidences
CREATE POLICY "Upload incident evidence" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'evidence-attachments' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')))
);

-- Policy 8: Controllers can download incident evidences
CREATE POLICY "Download incident evidence" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'evidence-attachments' AND 
  (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')))
);


-- =====================================================================
-- 6. TRIGGERS FOR LOG AUDITING & AUTO BLOCKCHAIN ANCHORING
-- =====================================================================

-- Trigger Function A: Universal Audit Logger
CREATE OR REPLACE FUNCTION public.proc_audit_logger()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_email TEXT;
    v_action TEXT;
    v_changed_fields JSONB := '{}'::JSONB;
BEGIN
    v_actor_id := auth.uid();
    
    -- Attempt to find email
    SELECT email INTO v_actor_email FROM public.admin_users WHERE id = v_actor_id;
    IF v_actor_email IS NULL THEN
        SELECT contact_email INTO v_actor_email FROM public.students WHERE id = v_actor_id;
    END IF;

    IF TG_OP = 'INSERT' THEN
        v_action := 'CREATE';
        v_changed_fields := row_to_json(NEW)::JSONB;
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'UPDATE';
        v_changed_fields := jsonb_build_object('old', row_to_json(OLD)::JSONB, 'new', row_to_json(NEW)::JSONB);
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'DELETE';
        v_changed_fields := row_to_json(OLD)::JSONB;
    END IF;

    INSERT INTO public.audit_logs (
        actor_id,
        actor_email,
        action,
        entity_type,
        entity_id,
        changed_fields,
        status
    ) VALUES (
        v_actor_id,
        v_actor_email,
        v_action,
        TG_TABLE_NAME,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT, 'N/A'),
        v_changed_fields,
        'COMPLIANT'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Audit Log Triggers
CREATE OR REPLACE TRIGGER tr_audit_questions
    AFTER INSERT OR UPDATE OR DELETE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.proc_audit_logger();

CREATE OR REPLACE TRIGGER tr_audit_blueprints
    AFTER INSERT OR UPDATE OR DELETE ON public.blueprints
    FOR EACH ROW EXECUTE FUNCTION public.proc_audit_logger();

CREATE OR REPLACE TRIGGER tr_audit_generated_papers
    AFTER INSERT OR UPDATE OR DELETE ON public.generated_papers
    FOR EACH ROW EXECUTE FUNCTION public.proc_audit_logger();

CREATE OR REPLACE TRIGGER tr_audit_results
    AFTER INSERT OR UPDATE OR DELETE ON public.results
    FOR EACH ROW EXECUTE FUNCTION public.proc_audit_logger();


-- Trigger Function B: Automatic Blockchain Record Anchoring Simulator
CREATE OR REPLACE FUNCTION public.proc_blockchain_anchor_simulator()
RETURNS TRIGGER AS $$
DECLARE
    v_prev_hash TEXT;
    v_next_block BIGINT;
    v_signature TEXT;
    v_tx_hash TEXT;
    v_rec_type TEXT;
BEGIN
    -- Determine Record Type
    IF TG_TABLE_NAME = 'certificates' THEN
        v_rec_type := 'Certificate';
    ELSIF TG_TABLE_NAME = 'results' THEN
        v_rec_type := 'Result';
    ELSIF TG_TABLE_NAME = 'generated_papers' THEN
        v_rec_type := 'ExamPaper';
    ELSE
        v_rec_type := 'AccessAudit';
    END IF;

    -- Fetch latest block info to chain them
    SELECT COALESCE(tx_hash, '0x0000000000000000000000000000000000000000000000000000000000000000'), 
           COALESCE(block_number, 0)
    INTO v_prev_hash, v_next_block
    FROM public.blockchain_records
    ORDER BY verified_at DESC
    LIMIT 1;

    v_next_block := v_next_block + 1;
    
    -- Generate mock SHA256 hashes representing digital blockchain seals
    v_tx_hash := '0x' || encode(digest(COALESCE(NEW.id::TEXT, '') || clock_timestamp()::TEXT, 'sha256'), 'hex');
    v_signature := encode(hmac(COALESCE(NEW.id::TEXT, '') || v_prev_hash, 'PARAKH-SECRET-KEY', 'sha256'), 'hex');

    -- Insert into records
    INSERT INTO public.blockchain_records (
        record_type,
        anchor_id,
        tx_hash,
        block_number,
        previous_block_hash,
        digital_signature,
        status
    ) VALUES (
        v_rec_type,
        NEW.id::TEXT,
        v_tx_hash,
        v_next_block,
        v_prev_hash,
        v_signature,
        'Anchored'
    );

    -- Update parent table back (bypass trigger loop by checking if values are null/changed)
    IF TG_TABLE_NAME = 'certificates' AND NEW.tx_hash IS DISTINCT FROM v_tx_hash THEN
        UPDATE public.certificates 
        SET tx_hash = v_tx_hash, 
            verification_status = 'Verified',
            status = 'Issued'
        WHERE id = NEW.id;
    ELSIF TG_TABLE_NAME = 'results' AND NEW.tx_hash IS DISTINCT FROM v_tx_hash THEN
        UPDATE public.results 
        SET tx_hash = v_tx_hash, 
            blockchain_status = 'Anchored',
            verification_status = 'Verified'
        WHERE id = NEW.id;
    ELSIF TG_TABLE_NAME = 'generated_papers' AND NEW.blockchain_tx IS DISTINCT FROM v_tx_hash THEN
        UPDATE public.generated_papers 
        SET blockchain_tx = v_tx_hash, 
            status = 'Securely Sealed'
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Blockchain Triggers to trigger auto-anchors when certificate/result/papers are sealed
CREATE OR REPLACE TRIGGER tr_blockchain_anchor_cert
    AFTER INSERT ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION public.proc_blockchain_anchor_simulator();

CREATE OR REPLACE TRIGGER tr_blockchain_anchor_result
    AFTER INSERT ON public.results
    FOR EACH ROW EXECUTE FUNCTION public.proc_blockchain_anchor_simulator();

CREATE OR REPLACE TRIGGER tr_blockchain_anchor_paper
    AFTER INSERT ON public.generated_papers
    FOR EACH ROW EXECUTE FUNCTION public.proc_blockchain_anchor_simulator();