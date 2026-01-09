# Supabase Storage: Avatar Upload Setup

Complete guide for setting up avatar uploads with Supabase Storage, including bucket configuration, RLS policies, and client implementation.

## Overview

This setup enables users to upload profile avatars with the following features:
- **Public bucket** - Anyone can view avatars without authentication
- **Secure uploads** - Users can only upload/update/delete their own avatars
- **File constraints** - 5MB max, JPG/PNG/GIF/WebP only
- **Simple naming** - `{userId}.{ext}` format (one avatar per user)
- **Auto-update** - Profile table can be automatically updated with avatar URL

## Table of Contents

1. [Quick Start](#quick-start)
2. [Manual Setup via Dashboard](#manual-setup-via-dashboard)
3. [SQL Setup](#sql-setup)
4. [RLS Policies Explained](#rls-policies-explained)
5. [Client Implementation](#client-implementation)
6. [Verification](#verification)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Option A: SQL Script (Recommended)

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `supabase/migrations/create_avatar_storage.sql`
3. Run the script
4. Verify setup using `supabase/migrations/verify_avatar_storage.sql`

### Option B: Manual Dashboard Setup

See [Manual Setup via Dashboard](#manual-setup-via-dashboard) section below.

---

## Manual Setup via Dashboard

If you prefer to use the Supabase Dashboard UI instead of SQL:

### Step 1: Create Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/png`
     - `image/gif`
     - `image/webp`
4. Click **Create bucket**

### Step 2: Set Up RLS Policies

1. Go to **Authentication** → **Policies**
2. Find **storage.objects** table
3. Click **New Policy**
4. Create 4 policies (see SQL in `create_avatar_storage.sql` for exact syntax):
   - SELECT: "Anyone can view avatars"
   - INSERT: "Users can upload their own avatar"
   - UPDATE: "Users can update their own avatar"
   - DELETE: "Users can delete their own avatar"

**Note**: The SQL approach is recommended because it's easier to get the policy syntax correct.

---

## SQL Setup

### File Structure

```
supabase/
└── migrations/
    ├── create_avatar_storage.sql    # Main setup script
    └── verify_avatar_storage.sql    # Verification queries
docs/
├── avatar_upload_example.ts         # Client-side code examples
└── AVATAR_STORAGE_SETUP.md         # This file
```

### Running the Migration

```bash
# Option 1: Via Supabase Dashboard
# Copy contents of create_avatar_storage.sql into SQL Editor and run

# Option 2: Via Supabase CLI (if you have it set up)
supabase migration new create_avatar_storage
# Paste SQL into the generated file
supabase db reset  # Apply migrations
```

### What the Migration Does

1. **Creates the `avatars` bucket** with:
   - Public access enabled
   - 5MB file size limit
   - Restricted MIME types (images only)

2. **Enables RLS** on `storage.objects` table

3. **Creates 4 RLS policies**:
   - SELECT: Public read access
   - INSERT: Authenticated users can upload their own avatar
   - UPDATE: Authenticated users can update their own avatar
   - DELETE: Authenticated users can delete their own avatar

4. **Optional helper function**: `get_avatar_url()` to construct public URLs

5. **Optional trigger**: Auto-update `profiles.avatar_url` when file is uploaded

---

## RLS Policies Explained

### Policy 1: SELECT (Public Read)

```sql
create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');
```

**What it does**: Allows anyone (authenticated or not) to view avatar files.

**Why**: Since the bucket is public, we want profile pictures to be viewable by all users.

**Security**: Safe because avatars are meant to be public profile pictures.

---

### Policy 2: INSERT (Upload Own Avatar)

```sql
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

**What it does**: Only authenticated users can upload files, and only if the filename starts with their user ID.

**Example**:
- User ID: `abc-123-def-456`
- ✅ Can upload: `abc-123-def-456.jpg`
- ❌ Cannot upload: `xyz-789.jpg` (different user ID)

**Why**: Prevents users from uploading avatars for other users.

**Security**: Critical for preventing unauthorized file uploads.

---

### Policy 3: UPDATE (Update Own Avatar)

```sql
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
```

**What it does**: Users can only update their own avatar files.

**Why**: Prevents users from modifying other users' avatars.

**Security**: Both `using` and `with check` clauses ensure old and new data belong to the user.

---

### Policy 4: DELETE (Delete Own Avatar)

```sql
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

**What it does**: Users can only delete their own avatar files.

**Why**: Prevents users from deleting other users' avatars.

**Security**: Ensures users can only remove their own files.

---

## Client Implementation

### Basic Upload

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`

  // Upload with upsert to overwrite existing avatar
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update profile
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  return publicUrl
}
```

### Full Example

See `docs/avatar_upload_example.ts` for:
- Complete upload/delete functions
- React component example
- File validation and compression
- Security testing
- Error handling

---

## Verification

### Step 1: Run Verification Queries

Open Supabase Dashboard → SQL Editor and run queries from `supabase/migrations/verify_avatar_storage.sql`:

```sql
-- 1. Check bucket exists
select * from storage.buckets where id = 'avatars';

-- 2. Verify RLS is enabled
select tablename, rowsecurity
from pg_tables
where schemaname = 'storage' and tablename = 'objects';

-- 3. List all policies
select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects';
```

### Step 2: Test Upload

Use the client code from `avatar_upload_example.ts` to test:

```typescript
// In your app
import { testRLSPolicies } from './avatar_upload_example'
await testRLSPolicies()
```

This will:
- ✅ Verify you can upload your own avatar
- ✅ Verify you cannot upload others' avatars
- ✅ Verify avatars are publicly viewable

---

## Security Considerations

### Critical Security Points

1. **RLS is enabled** - Always verify RLS is on:
   ```sql
   select rowsecurity from pg_tables
   where schemaname = 'storage' and tablename = 'objects';
   ```

2. **Filename validation** - The policy checks filename starts with user ID:
   ```sql
   (storage.foldername(name))[1] = auth.uid()::text
   ```

3. **Authentication required** - All write operations require auth:
   ```sql
   auth.role() = 'authenticated'
   ```

4. **Public bucket** - Avatars are publicly viewable (by design)

### What RLS Protects Against

- ✅ Users uploading files for other users
- ✅ Users deleting other users' avatars
- ✅ Users updating other users' avatars
- ✅ Unauthenticated users uploading files

### What RLS Does NOT Protect Against

- ❌ File size limits (enforced by bucket config + client validation)
- ❌ File type validation (enforced by bucket MIME types + client)
- ❌ Rate limiting (consider implementing separately)
- ❌ Malicious file content (consider virus scanning)

### Additional Security Recommendations

1. **Client-side validation** - Always validate file type and size before upload
2. **Compression** - Compress images to reduce storage and bandwidth
3. **Rate limiting** - Implement rate limits on upload endpoint
4. **Content scanning** - For production, consider scanning uploaded files
5. **CDN caching** - Use Supabase CDN or Cloudflare for better performance

---

## Troubleshooting

### Problem: "new row violates row-level security policy"

**Cause**: Filename doesn't start with user ID or user is not authenticated.

**Solution**:
1. Verify user is logged in: `const { data: { user } } = await supabase.auth.getUser()`
2. Ensure filename format: `${userId}.${ext}`
3. Check policy is created correctly

### Problem: "The object already exists"

**Cause**: File already exists and `upsert` is false.

**Solution**: Set `upsert: true` in upload options:
```typescript
await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
```

### Problem: Cannot view avatar (404 error)

**Cause**: Bucket is not public or file doesn't exist.

**Solution**:
1. Verify bucket is public: `select public from storage.buckets where id = 'avatars'`
2. Check file exists: `select * from storage.objects where bucket_id = 'avatars'`
3. Verify URL format: `https://[project].supabase.co/storage/v1/object/public/avatars/[filename]`

### Problem: File too large

**Cause**: File exceeds 5MB limit.

**Solution**:
1. Compress image before upload (see `compressImage()` in example)
2. Inform user to use smaller file
3. Adjust bucket file size limit if needed

### Problem: Wrong MIME type

**Cause**: File type not in allowed list.

**Solution**:
1. Check `allowed_mime_types` in bucket config
2. Validate file type in client before upload
3. Convert file to allowed format if needed

### Problem: Profile avatar_url not updating

**Cause**: Update query failing or not executed.

**Solution**:
1. Check RLS policies on `profiles` table
2. Verify `avatar_url` column exists
3. Manually update: `update profiles set avatar_url = 'url' where id = 'user-id'`

---

## Next Steps

After setup is complete:

1. **Test thoroughly** - Use `testRLSPolicies()` function
2. **Add to UI** - Implement avatar upload component
3. **Monitor usage** - Check storage metrics in dashboard
4. **Set up backups** - Configure automatic backups for storage
5. **Implement compression** - Use `compressImage()` to reduce storage costs

---

## Support

If you encounter issues:

1. Check [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
2. Review [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
3. Run verification queries from `verify_avatar_storage.sql`
4. Check browser console and Supabase logs for errors

---

## Summary

You now have:
- ✅ Secure avatar storage bucket
- ✅ RLS policies preventing unauthorized access
- ✅ Client code for upload/delete/view
- ✅ Verification queries
- ✅ React component example
- ✅ Security best practices

**Files created**:
- `/supabase/migrations/create_avatar_storage.sql` - Main setup
- `/supabase/migrations/verify_avatar_storage.sql` - Verification
- `/docs/avatar_upload_example.ts` - Client examples
- `/docs/AVATAR_STORAGE_SETUP.md` - This guide

**Ready to use!** Run the SQL migration and start implementing the client code.
