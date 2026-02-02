-- Seed Data

-- 1. Prodi
INSERT INTO prodi (id, name) VALUES
('11111111-1111-1111-1111-111111111111', 'D3 Nautika'),
('22222222-2222-2222-2222-222222222222', 'D3 Teknika'),
('33333333-3333-3333-3333-333333333333', 'D3 Manajemen Transportasi Perairan Daratan');

-- 2. Users (We match the IDs to the mock store usually, but here we generate new ones or use fixed UUIDs for Auth linking)
-- NOTE: In practice, you must create these users in Supabase Auth first and use their returned UUIDs here.
-- For this seed script, we simulate these users existing. 
-- PLEASE REPLACE THESE UUIDS WITH REAL AUTH UUIDS IF YOU WANT LOGIN TO WORK PROPERLY WITH RLS

-- Superadmin
INSERT INTO users (id, email, full_name, role, avatar_url) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'superadmin@poltrans.com', 'Super Administrator', 'superadmin', 'S');

-- Admin Prodi
INSERT INTO users (id, email, full_name, role, prodi_id, avatar_url) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'adminprodi@poltrans.com', 'DADANG1', 'admin_prodi', '22222222-2222-2222-2222-222222222222', 'D');

-- Dosen (Dadang Abdul Aziz)
INSERT INTO users (id, email, full_name, role, nim_nip, prodi_id, avatar_url) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'dosen@poltrans.com', 'Dadang Abdul Aziz, S.Tr.Pel., M.M', 'dosen', '198501012010011001', '22222222-2222-2222-2222-222222222222', 'D');

-- Pengawas (DILA)
INSERT INTO users (id, email, full_name, role, avatar_url) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'pengawas@poltrans.com', 'DILA', 'pengawas', 'P');

-- Mahasiswa (Zikril Artha Kencana)
INSERT INTO users (id, email, full_name, role, nim_nip, prodi_id, avatar_url) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'mahasiswa@poltrans.com', 'ZIKRIL ARTHA KENCANA', 'mahasiswa', '2402011', '22222222-2222-2222-2222-222222222222', 'Z');

-- Additional Students for "User Terbaru" list
INSERT INTO users (id, email, full_name, role, nim_nip, prodi_id, avatar_url) VALUES
(uuid_generate_v4(), 'judha@student.com', 'YUDHA KURNIAWAN', 'mahasiswa', '2302024', '22222222-2222-2222-2222-222222222222', 'Y'),
(uuid_generate_v4(), 'yoza@student.com', 'YOZA RIZKIA NAULY', 'mahasiswa', '2502022', '22222222-2222-2222-2222-222222222222', 'Y');


-- 3. Courses (for Dosen Dashboard)
INSERT INTO courses (id, name, code, sks, prodi_id, lecturer_id) VALUES
('10101010-1010-1010-1010-101010101010', 'Dinas Jaga Mesin, Keselamatan Kerja dan Bertenaga', 'DPKC2051', 1, '22222222-2222-2222-2222-222222222222', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('20202020-2020-2020-2020-202020202020', 'Mesin Penggerak Utama I', 'DPKC2062', 2, '22222222-2222-2222-2222-222222222222', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('30303030-3030-3030-3030-303030303030', 'Mesin Penggerak Utama III', 'DPKC4052', 2, '22222222-2222-2222-2222-222222222222', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');


-- 4. Exams
INSERT INTO exams (id, course_id, title, start_time, end_time, duration_minutes, status, created_by) VALUES
('40404040-4040-4040-4040-404040404040', '30303030-3030-3030-3030-303030303030', 'Ujian Akhir Semester - Mesin Penggerak Utama III', '2026-01-26 08:00:00+07', '2026-01-26 10:00:00+07', 120, 'completed', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');

-- 5. Questions (Sample)
INSERT INTO questions (exam_id, question_text, question_type, points) VALUES
('40404040-4040-4040-4040-404040404040', 'Apa fungsi utama dari Main Engine?', 'multiple_choice', 10),
('40404040-4040-4040-4040-404040404040', 'Jelaskan siklus kerja mesin diesel 4 tak!', 'essay', 20);

-- 6. Exam Submissions (Sample)
-- No submissions yet to match "0 Selesai Hari Ini" stats, or insert old ones.
