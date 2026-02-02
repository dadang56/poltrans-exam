-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('superadmin', 'admin_prodi', 'dosen', 'pengawas', 'mahasiswa');
CREATE TYPE exam_status AS ENUM ('scheduled', 'ongoing', 'completed');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'essay');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded');

-- TABLES

-- Prodi (Departments)
CREATE TABLE prodi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

-- Users (Extends auth.users, but we create a public table for easier management)
-- Note: In a real app, this should be linked to auth.users using a Trigger.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Should match auth.users.id in production
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'mahasiswa',
    nim_nip TEXT, -- NIM for students, NIP for others
    avatar_url TEXT,
    prodi_id UUID REFERENCES prodi(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses (Mata Kuliah)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL, -- Kode MK
    sks INTEGER NOT NULL DEFAULT 2,
    prodi_id UUID REFERENCES prodi(id) ON DELETE CASCADE,
    lecturer_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Dosen Pengampu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams (Ujian)
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status exam_status NOT NULL DEFAULT 'scheduled',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions (Bank Soal)
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'multiple_choice',
    points INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Options (Pilihan Ganda)
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Exam Submissions (Hasil Ujian)
CREATE TABLE exam_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score NUMERIC DEFAULT 0,
    status submission_status DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE prodi ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
-- (Assumes we are using Supabase Auth and metadata contains 'role')
-- For this mock implementation without real auth triggers, we might rely on the public.users table lookup
-- but strictly RLS uses auth.uid()
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
  _role user_role;
BEGIN
  SELECT role INTO _role FROM users WHERE id = auth.uid();
  RETURN _role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user_prodi()
RETURNS UUID AS $$
DECLARE
  _prodi_id UUID;
BEGIN
  SELECT prodi_id INTO _prodi_id FROM users WHERE id = auth.uid();
  RETURN _prodi_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. Users Policies
-- Superadmin: Full Access
CREATE POLICY "Superadmin full access users" ON users
FOR ALL USING (get_current_user_role() = 'superadmin');

-- Admin Prodi: Can manage users in their prodi
CREATE POLICY "Admin Prodi manage users in prodi" ON users
FOR ALL USING (
    get_current_user_role() = 'admin_prodi' AND prodi_id = get_current_user_prodi()
);

-- Everyone: Read their own profile
CREATE POLICY "Read own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- 2. Prodi Policies
-- Read everyone
CREATE POLICY "Read prodi" ON prodi FOR SELECT USING (true);
-- Superadmin write
CREATE POLICY "Superadmin write prodi" ON prodi FOR ALL USING (get_current_user_role() = 'superadmin');

-- 3. Courses Policies
-- Superadmin Full
CREATE POLICY "Superadmin full access courses" ON courses
FOR ALL USING (get_current_user_role() = 'superadmin');

-- Admin Prodi: Manage courses in their prodi
CREATE POLICY "Admin Prodi manage courses by prodi" ON courses
FOR ALL USING (
    get_current_user_role() = 'admin_prodi' AND prodi_id = get_current_user_prodi()
);

-- Dosen: Read assigned courses
CREATE POLICY "Dosen view assigned courses" ON courses
FOR SELECT USING (lecturer_id = auth.uid());

-- Mahasiswa: Read courses (simplified: all courses in their prodi or all for now)
CREATE POLICY "Mahasiswa view courses" ON courses
FOR SELECT USING (true);


-- 4. Exams Policies
-- Superadmin Full
CREATE POLICY "Superadmin full access exams" ON exams
FOR ALL USING (get_current_user_role() = 'superadmin');

-- Admin Prodi: Manage exams in their prodi (via course->prodi connection)
CREATE POLICY "Admin Prodi manage exams via prodi" ON exams
FOR ALL USING (
    get_current_user_role() = 'admin_prodi' AND
    EXISTS (SELECT 1 FROM courses WHERE courses.id = exams.course_id AND courses.prodi_id = get_current_user_prodi())
);

-- Dosen: Manage exams for their courses
CREATE POLICY "Dosen manage own exams" ON exams
FOR ALL USING (
    get_current_user_role() = 'dosen' AND created_by = auth.uid()
);

-- Pengawas: View active/scheduled exams
CREATE POLICY "Pengawas view exams" ON exams
FOR SELECT USING (get_current_user_role() = 'pengawas');

-- Mahasiswa: View exams (usually detailed filtering logic for 'enrolled', simplified here to 'all')
CREATE POLICY "Mahasiswa view exams" ON exams
FOR SELECT USING (get_current_user_role() = 'mahasiswa');


-- 5. Questions/Options Policies
-- Inherit access from Exam (simplified: if you can edit exam, you can edit questions)
CREATE POLICY "Manage questions if exam creator" ON questions
FOR ALL USING (
    EXISTS (SELECT 1 FROM exams WHERE exams.id = questions.exam_id AND exams.created_by = auth.uid()) OR
    get_current_user_role() = 'superadmin'
);
CREATE POLICY "View questions" ON questions FOR SELECT USING (true); -- CAREFUL in production!

CREATE POLICY "Manage options if exam creator" ON options
FOR ALL USING (
    EXISTS (SELECT 1 FROM questions JOIN exams ON questions.exam_id = exams.id WHERE questions.id = options.question_id AND exams.created_by = auth.uid()) OR
    get_current_user_role() = 'superadmin'
);
CREATE POLICY "View options" ON options FOR SELECT USING (true);


-- 6. Submissions Policies
-- Mahasiswa: Insert own submission
CREATE POLICY "Mahasiswa insert submission" ON exam_submissions
FOR INSERT WITH CHECK (auth.uid() = student_id AND get_current_user_role() = 'mahasiswa');

-- Mahasiswa: View own submission
CREATE POLICY "Mahasiswa view own submission" ON exam_submissions
FOR SELECT USING (auth.uid() = student_id);

-- Dosen: View submissions for their exams
CREATE POLICY "Dosen view submissions" ON exam_submissions
FOR SELECT USING (
    EXISTS (SELECT 1 FROM exams WHERE exams.id = exam_submissions.exam_id AND exams.created_by = auth.uid())
);

-- Superadmin/Admin Prodi: View all
CREATE POLICY "Admin view submissions" ON exam_submissions
FOR SELECT USING (get_current_user_role() IN ('superadmin', 'admin_prodi'));
