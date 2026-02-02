# Deployment Guide - Online Examination System

This guide covers how to deploy the application to **Vercel** with a **Supabase** backend.

## Prerequisites
- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- Git installed on your machine

## 1. Supabase Setup (Backend)
1. Login to Supabase and create a new project.
2. Go to **SQL Editor** -> **New Query**.
3. Copy the contents of `supabase/schema.sql` from this project and Run it.
4. (Optional) Run `supabase/seed.sql` to insert dummy data.
5. Go to **Project Settings** -> **API**.
6. Note down fetching the **Project URL** and **anon public key**.

### Create Initial Users (Auth)
Since the seed file only inserts into the `users` table but not the real Authentication system, you must CREATE users manually or run a script.
**Manual Method:**
1. Go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create New User**.
3. Enter email: `superadmin@poltrans.com` and a password.
4. **IMPORTANT**: After creating the user, copy their `User UID`.
5. Go to **Table Editor** -> `users` table.
6. Find the row for 'Super Administrator' (seeded) and UPDATE the `id` column to match the `User UID` form Auth.
7. Repeat for other roles (Dosen, Mahasiswa, etc.).

## 2. GitHub Setup (Source Code)
1. Initialize Git in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Online Exam System"
   ```
2. Create a new repository on GitHub.
3. Link and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
   git push -u origin master
   ```

## 3. Vercel Setup (Hosting)
1. Login to Vercel and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
4. Click **Deploy**.

## 4. Verification
Once deployed, Vercel will give you a domain (e.g., `poltrans-exam.vercel.app`).
Visit the URL and try logging in with the users you created in Step 1.
