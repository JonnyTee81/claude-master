-- Verification Script for Supabase Configuration
-- Run this in Supabase SQL Editor to verify setup

-- 1. Check if RLS is enabled on all public tables
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: All tables should show 't' (true)

-- 2. Check profiles table structure
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Expected columns: id, email, full_name, avatar_url, created_at, updated_at

-- 3. Check RLS policies on profiles table
SELECT
  policyname as "Policy Name",
  cmd as "Command"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- Expected: 3 policies (SELECT, UPDATE, INSERT)

-- 4. Check if avatars storage bucket exists
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';

-- Expected: 1 row with public=true, file_size_limit=5242880

-- 5. Check storage RLS policies
SELECT
  policyname as "Policy Name",
  cmd as "Command"
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%avatar%';

-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- 6. Check if triggers exist
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Expected: on_auth_user_created, on_profile_updated
