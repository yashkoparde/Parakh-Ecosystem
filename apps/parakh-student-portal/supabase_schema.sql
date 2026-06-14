-- =====================================================================
-- PARAKH DATABASE MASTER ECOSYSTEM SCHEMA SPECIFICATION
-- Target: Supabase / PostgreSQL
-- =====================================================================

-- 1. CREATE ENUMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('CONTROLLER', 'SUPERVISOR', 'ACADEMIC_AUDITOR', 'VERIFIER');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clearance_level_enum') THEN
        CREATE TYPE clearance_level_enum AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_status_enum') THEN
        CREATE TYPE question_status_enum AS ENUM ('Draft', 'Pending Review', 'Approved', 'Rejected');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
        CREATE TYPE difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'evaluation_status_enum') THEN
        CREATE TYPE evaluation_status_enum AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
    END IF;
END $$;

-- 2. CREATE MASTER TABLES

-- Table 1: admin_users (References Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'VERIFIER',
    clearance_level clearance_level_enum NOT NULL DEFAULT 'LEVEL_1',
    assigned_subject_codes TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: subjects (Uses logical primary key string keys)
CREATE TABLE IF NOT EXISTS public.subjects (
    subject_code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    class_level INTEGER NOT NULL CHECK (class_level IN (10, 12)),
    stream TEXT NOT NULL CHECK (stream IN ('Science', 'Commerce', 'Arts', 'General')),
    max_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 33,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: exam_centers (Uses logical code coordinates)
CREATE TABLE IF NOT EXISTS public.exam_centers (
    exam_center_code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    supervisor_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    session_clearance_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4: questions (Rich question repositories)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE CASCADE,
    difficulty difficulty_enum NOT NULL,
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB, -- For MCQs: ['Option A', 'Option B', 'Option C', 'Option D']
    correct_answer TEXT NOT NULL,
    marks_weight INTEGER NOT NULL DEFAULT 1 CHECK (marks_weight > 0),
    status question_status_enum NOT NULL DEFAULT 'Draft',
    created_by UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    reviewed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: blueprints (Logical code linking topic & cycle)
CREATE TABLE IF NOT EXISTS public.blueprints (
    blueprint_code TEXT PRIMARY KEY,
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE CASCADE,
    academic_year TEXT NOT NULL, -- e.g. '2025-2026'
    syllabus_version TEXT NOT NULL DEFAULT 'v1.0',
    total_marks INTEGER NOT NULL DEFAULT 100,
    time_limit_minutes INTEGER NOT NULL CHECK (time_limit_minutes > 0),
    difficulty_distribution JSONB NOT NULL, -- e.g. {'Easy': 40, 'Medium': 40, 'Hard': 20}
    section_rules JSONB NOT NULL, -- Section rules list
    created_by UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 6: generated_papers (Pre-packaged test vectors)
CREATE TABLE IF NOT EXISTS public.generated_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_code TEXT NOT NULL REFERENCES public.blueprints(blueprint_code) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE RESTRICT,
    paper_hash TEXT NOT NULL, -- SHA-256 for verification check
    questions_subset JSONB NOT NULL, -- Array of question IDs in sequential format
    is_released BOOLEAN NOT NULL DEFAULT FALSE,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 7: evaluation_jobs (Workflow coordinates)
CREATE TABLE IF NOT EXISTS public.evaluation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL REFERENCES public.subjects(subject_code) ON DELETE RESTRICT,
    exam_center_code TEXT NOT NULL REFERENCES public.exam_centers(exam_center_code) ON DELETE RESTRICT,
    status evaluation_status_enum NOT NULL DEFAULT 'PENDING',
    payload_bucket_path TEXT NOT NULL, -- Reference file paths inside Supabase storage
    evaluator_notes TEXT,
    error_logs TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 8: blockchain_records (Simulated authority signature anchors)
CREATE TABLE IF NOT EXISTS public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_type TEXT NOT NULL CHECK (record_type IN ('Result', 'Certificate', 'Transcript')),
    anchor_id TEXT NOT NULL, -- Unique identity key (roll number, certificate code)
    tx_hash TEXT NOT NULL, -- Registry signature hash of the block
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 9: audit_logs (Activity monitoring)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changed_fields JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================================
-- 3. SUPABASE STORAGE BUCKETS CONFIGURATION INSTRUCTIONS
-- =====================================================================
-- In Supabase, files are stored in Buckets. For the PARAKH ecosystem,
-- we provision three distinct security-hardened storage buckets:
--
-- A. 'exam-papers' (Private)
--    - Use: Stores generated question papers distributed to centers.
--    - Mime types: PDFs/ZIPs.
--
-- B. 'student-evaluation-payloads' (Private)
--    - Use: Stores center-uploaded answers (scans, index files) for review.
--    - Mime types: Images, PDFs, ZIP files.
--
-- C. 'academic-credentials' (Public readable, restricted uploads)
--    - Use: Stores digital copies of certificates, marksheets, transcripts.
--    - Mime types: PDF, PNG, JPEG.
--
-- Below are the SQL triggers to register these buckets in the storage schema:

-- Bucket 1: Private Exam Paper Distribution Repository
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'exam-papers', 
    'exam-papers', 
    false, -- Private access only
    10485760, -- Max file size: 10MB
    ARRAY['application/pdf', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 2: Secure Evaluation Scans & Payload Upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'student-evaluation-payloads', 
    'student-evaluation-payloads', 
    false, -- Private access only
    52428800, -- Max file size: 50MB (to support high-res scans or PDF packages)
    ARRAY['image/jpeg', 'image/png', 'application/pdf', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

-- Bucket 3: Official Certified Digital Credentials (Publicly accessible verification attachments)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'academic-credentials', 
    'academic-credentials', 
    true, -- Publicly readable for quick verification displays
    5120000, -- Max file size: 5MB
    ARRAY['application/pdf', 'image/png', 'image/jpeg']
) ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- 4. STORAGE ACCESS CONTROL POLICIES (Row-Level Security - RLS)
-- =====================================================================

-- Enable RLS on storage objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy A: Only Authorized Controllers can insert into exam-papers
CREATE POLICY "Controllers can upload exam papers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'exam-papers' AND 
  (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role = 'CONTROLLER'
  ))
);

-- Policy B: Supervisors can read exam papers assigned to their center
CREATE POLICY "Supervisors can read exam papers" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'exam-papers' AND
  (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')
  ))
);

-- Policy C: Supervisors can upload evaluation scans
CREATE POLICY "Supervisors can upload evaluations" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'student-evaluation-payloads' AND 
  (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('SUPERVISOR', 'CONTROLLER')
  ))
);

-- Policy D: Academic Auditors and Controllers can select evaluation payloads for auditing
CREATE POLICY "Auditors can read evaluations" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'student-evaluation-payloads' AND 
  (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('ACADEMIC_AUDITOR', 'CONTROLLER')
  ))
);

-- Policy E: Anyone can public-view certified academic credentials
CREATE POLICY "Public can view certified credentials" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'academic-credentials');

-- Policy F: Only Controllers / Verifiers can upload certified academic credentials
CREATE POLICY "Authorized verifiers can issue certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'academic-credentials' AND 
  (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('VERIFIER', 'CONTROLLER')
  ))
);
