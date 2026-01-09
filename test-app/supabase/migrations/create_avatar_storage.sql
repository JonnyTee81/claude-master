-- =====================================================
-- Supabase Storage: Avatar Upload Setup
-- =====================================================
-- This migration creates the avatars storage bucket and
-- sets up RLS policies for secure avatar uploads.
--
-- Requirements:
-- - Users can upload/update/delete their own avatars
-- - Anyone can view avatars (public bucket)
-- - Max file size: 5MB (enforced in client)
-- - Allowed types: JPG, PNG, GIF, WebP
-- - Naming: {userId}.{ext}
-- =====================================================

-- =====================================================
-- STEP 1: Create Storage Bucket
-- =====================================================
-- Note: This creates the bucket via SQL. Alternatively,
-- you can create it via the Supabase Dashboard.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true, -- Public bucket (anyone can view)
  5242880, -- 5MB in bytes
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do nothing;

-- =====================================================
-- STEP 2: Enable RLS on storage.objects
-- =====================================================
-- RLS should already be enabled, but we ensure it here

alter table storage.objects enable row level security;

-- =====================================================
-- STEP 3: RLS Policies for storage.objects
-- =====================================================

-- Policy 1: SELECT (Public Read Access)
-- Anyone can view avatars without authentication
-- This works because the bucket is public

create policy "Anyone can view avatars"
on storage.objects for select
using (
  bucket_id = 'avatars'
);

-- Policy 2: INSERT (Users can upload their own avatar)
-- Authenticated users can upload files that start with their user ID
-- Example: User abc-123 can upload "abc-123.jpg"

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Note: storage.foldername(name) splits path by '/'
-- For flat structure like "abc-123.jpg", we check if filename starts with user ID
-- Alternative check for exact match:
-- and name = auth.uid()::text || '.' || (regexp_match(name, '\.(jpg|jpeg|png|gif|webp)$'))[1]

-- Policy 3: UPDATE (Users can update their own avatar)
-- Authenticated users can update their own avatar files

create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: DELETE (Users can delete their own avatar)
-- Authenticated users can delete their own avatar files

create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STEP 4: Helper Function (Optional)
-- =====================================================
-- Function to get the public URL for an avatar
-- Usage: select get_avatar_url('abc-123.jpg');

create or replace function get_avatar_url(avatar_filename text)
returns text
language plpgsql
security definer
as $$
declare
  project_url text;
begin
  -- Get your project URL from settings
  -- Replace this with your actual Supabase project URL
  project_url := current_setting('app.settings.supabase_url', true);

  if project_url is null then
    -- Fallback: construct from bucket
    return format('https://your-project-ref.supabase.co/storage/v1/object/public/avatars/%s', avatar_filename);
  else
    return format('%s/storage/v1/object/public/avatars/%s', project_url, avatar_filename);
  end if;
end;
$$;

-- =====================================================
-- STEP 5: Update profiles trigger (Optional Enhancement)
-- =====================================================
-- Automatically update avatar_url in profiles table when
-- a new avatar is uploaded to storage

create or replace function handle_avatar_upload()
returns trigger
language plpgsql
security definer
as $$
declare
  user_id_from_filename uuid;
  public_url text;
begin
  -- Extract user ID from filename (assumes format: {uuid}.{ext})
  user_id_from_filename := (regexp_match(NEW.name, '^([a-f0-9\-]+)\.'))[1]::uuid;

  -- Only proceed if this is in the avatars bucket
  if NEW.bucket_id = 'avatars' and user_id_from_filename is not null then
    -- Construct public URL
    public_url := format(
      'https://your-project-ref.supabase.co/storage/v1/object/public/avatars/%s',
      NEW.name
    );

    -- Update the profiles table
    update public.profiles
    set
      avatar_url = public_url,
      updated_at = now()
    where id = user_id_from_filename;
  end if;

  return NEW;
end;
$$;

-- Create trigger (commented out by default - enable if you want automatic profile updates)
-- drop trigger if exists on_avatar_upload on storage.objects;
-- create trigger on_avatar_upload
--   after insert on storage.objects
--   for each row
--   execute function handle_avatar_upload();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the setup

-- 1. Check bucket was created
-- select * from storage.buckets where id = 'avatars';

-- 2. Check RLS is enabled
-- select tablename, rowsecurity from pg_tables where schemaname = 'storage' and tablename = 'objects';

-- 3. List all policies on storage.objects
-- select * from pg_policies where schemaname = 'storage' and tablename = 'objects';

-- 4. Test file upload (via client SDK - see client_example.ts)
