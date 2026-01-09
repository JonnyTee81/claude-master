-- =====================================================
-- Verification Queries for Avatar Storage Setup
-- =====================================================
-- Run these queries in Supabase SQL Editor to verify
-- your storage bucket and RLS policies are set up correctly.
-- =====================================================

-- =====================================================
-- 1. Verify Bucket Exists and Configuration
-- =====================================================

select
  id,
  name,
  public as "is_public",
  file_size_limit,
  allowed_mime_types,
  created_at
from storage.buckets
where id = 'avatars';

-- Expected result:
-- id: avatars
-- name: avatars
-- is_public: true
-- file_size_limit: 5242880 (5MB)
-- allowed_mime_types: {image/jpeg, image/png, image/gif, image/webp}

-- =====================================================
-- 2. Verify RLS is Enabled on storage.objects
-- =====================================================

select
  schemaname,
  tablename,
  rowsecurity as "rls_enabled"
from pg_tables
where schemaname = 'storage'
  and tablename = 'objects';

-- Expected result:
-- rls_enabled: true

-- =====================================================
-- 3. List All Policies on storage.objects
-- =====================================================

select
  policyname as "policy_name",
  cmd as "command",
  qual as "using_expression",
  with_check as "with_check_expression"
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%avatar%';

-- Expected result: 4 policies
-- 1. Anyone can view avatars (SELECT)
-- 2. Users can upload their own avatar (INSERT)
-- 3. Users can update their own avatar (UPDATE)
-- 4. Users can delete their own avatar (DELETE)

-- =====================================================
-- 4. Check Existing Files in Avatars Bucket
-- =====================================================

select
  name as "filename",
  bucket_id,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata->>'size' as "size_bytes",
  metadata->>'mimetype' as "mime_type"
from storage.objects
where bucket_id = 'avatars'
order by created_at desc
limit 10;

-- This will show any existing avatar files

-- =====================================================
-- 5. Test Policy Logic (Simulate User Context)
-- =====================================================
-- Note: This won't work in SQL Editor as it requires
-- an authenticated session. Use client SDK for real testing.

-- Example: Check if a user can see their avatar
-- SET request.jwt.claim.sub = 'user-uuid-here';
-- select * from storage.objects where bucket_id = 'avatars' and name like 'user-uuid-here%';

-- =====================================================
-- 6. Count Files Per User (Troubleshooting)
-- =====================================================
-- Useful to see if users have multiple avatars
-- (they should only have one)

select
  substring(name from '^[a-f0-9\-]+') as "user_id",
  count(*) as "file_count"
from storage.objects
where bucket_id = 'avatars'
group by substring(name from '^[a-f0-9\-]+')
having count(*) > 1;

-- Should return no rows if each user has only one avatar

-- =====================================================
-- 7. Check Storage Size Usage
-- =====================================================

select
  bucket_id,
  count(*) as "total_files",
  sum((metadata->>'size')::int) as "total_bytes",
  round(sum((metadata->>'size')::int)::numeric / 1024 / 1024, 2) as "total_mb"
from storage.objects
where bucket_id = 'avatars'
group by bucket_id;

-- Shows total storage used by avatars

-- =====================================================
-- 8. Find Orphaned Avatars
-- =====================================================
-- Avatars that don't have a corresponding user profile

select
  o.name,
  o.created_at,
  substring(o.name from '^[a-f0-9\-]+') as "extracted_user_id"
from storage.objects o
where o.bucket_id = 'avatars'
  and not exists (
    select 1
    from public.profiles p
    where p.id::text = substring(o.name from '^[a-f0-9\-]+')
  );

-- Should return no rows in a healthy system

-- =====================================================
-- 9. Find Profiles Without Avatars
-- =====================================================
-- Users who have a profile but no avatar file uploaded

select
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.created_at
from public.profiles p
where not exists (
  select 1
  from storage.objects o
  where o.bucket_id = 'avatars'
    and o.name like p.id::text || '.%'
)
order by p.created_at desc
limit 20;

-- Shows users without avatars

-- =====================================================
-- 10. Validate Avatar URLs in Profiles Table
-- =====================================================
-- Check if avatar_url in profiles matches actual storage files

select
  p.id,
  p.email,
  p.avatar_url,
  case
    when o.name is null then 'NO_FILE_IN_STORAGE'
    when p.avatar_url is null then 'NO_URL_IN_PROFILE'
    when p.avatar_url like '%' || o.name then 'MATCH'
    else 'MISMATCH'
  end as "status"
from public.profiles p
left join storage.objects o
  on o.bucket_id = 'avatars'
  and o.name like p.id::text || '.%'
where p.avatar_url is not null
  or o.name is not null
order by status, p.created_at desc;

-- Helps identify inconsistencies between profiles and storage
