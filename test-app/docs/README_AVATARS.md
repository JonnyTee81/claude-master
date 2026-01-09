# Avatar Upload System - Complete Package

A secure, production-ready avatar upload system for Supabase Storage with comprehensive RLS policies, client code, and testing suite.

## What You Get

This package provides everything needed to implement secure avatar uploads:

- **SQL Migration** - Creates storage bucket and RLS policies
- **Client Code** - Ready-to-use TypeScript functions
- **React Component** - Drop-in avatar upload component
- **Security Tests** - Automated testing suite
- **Documentation** - Complete setup and usage guide
- **Verification** - SQL queries to verify setup

## Quick Start (5 Minutes)

### Step 1: Run SQL Migration

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `/supabase/migrations/create_avatar_storage.sql`
3. Paste and click **Run**

### Step 2: Verify Setup

1. In SQL Editor, copy contents of `/supabase/migrations/verify_avatar_storage.sql`
2. Run each query to confirm bucket and policies exist

### Step 3: Use Client Code

```typescript
import { uploadAvatar } from './docs/avatar_upload_example'

// In your component
async function handleUpload(file: File, userId: string) {
  const avatarUrl = await uploadAvatar(file, userId)
  console.log('Avatar uploaded:', avatarUrl)
}
```

### Step 4: Test Security

```typescript
import { runSecurityTests } from './docs/test_avatar_security'

await runSecurityTests() // Verifies RLS policies are working
```

Done! Your avatar system is ready.

---

## File Structure

```
project/
├── supabase/
│   └── migrations/
│       ├── create_avatar_storage.sql       # Main setup SQL
│       └── verify_avatar_storage.sql       # Verification queries
│
└── docs/
    ├── README_AVATARS.md                   # This file
    ├── AVATAR_STORAGE_SETUP.md            # Complete documentation
    ├── avatar_quick_reference.md          # Quick reference
    ├── avatar_upload_example.ts           # Client implementation
    └── test_avatar_security.ts            # Security test suite
```

---

## What Each File Does

### SQL Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `create_avatar_storage.sql` | Creates bucket, enables RLS, sets up policies | Run once during initial setup |
| `verify_avatar_storage.sql` | Checks setup is correct | Run after setup and when troubleshooting |

### Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `README_AVATARS.md` | Overview and quick start | Everyone - start here |
| `AVATAR_STORAGE_SETUP.md` | Complete setup guide with explanations | Developers implementing the system |
| `avatar_quick_reference.md` | Fast lookup for common operations | Developers using the system |

### Code Files

| File | Purpose | Usage |
|------|---------|-------|
| `avatar_upload_example.ts` | Upload/delete functions, React component | Import and use in your app |
| `test_avatar_security.ts` | Automated security testing | Run to verify RLS is working |

---

## Features

### Security

- ✅ **RLS Policies** - Users can only upload/update/delete their own avatars
- ✅ **Authentication Required** - All write operations require logged-in user
- ✅ **File Validation** - Type and size limits enforced at bucket level
- ✅ **Filename Enforcement** - Must match user ID pattern
- ✅ **Public Read** - Avatars viewable by all (by design)

### Storage

- **Bucket**: `avatars`
- **Max File Size**: 5MB
- **Allowed Types**: JPG, PNG, GIF, WebP
- **Naming**: `{userId}.{ext}` (e.g., `abc-123.jpg`)
- **Public**: Yes (avatars are meant to be viewed by all)
- **Upsert**: Yes (new upload overwrites old)

### Client Features

- Upload with validation
- Delete avatar
- Get public URL
- File compression
- Error handling
- React component
- TypeScript types

---

## Usage Examples

### Basic Upload

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

async function uploadAvatar(file: File, userId: string) {
  // Validate
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large')
  }

  // Upload
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  // Get URL
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

### React Component

```tsx
import { AvatarUpload } from './docs/avatar_upload_example'

function ProfilePage() {
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h1>Profile</h1>
      <AvatarUpload userId={user.id} />
    </div>
  )
}
```

### Delete Avatar

```typescript
async function deleteAvatar(userId: string) {
  const fileName = `${userId}.jpg` // or get from profile

  await supabase.storage
    .from('avatars')
    .remove([fileName])

  await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', userId)
}
```

---

## RLS Policies (4 Total)

| Policy | Who | What |
|--------|-----|------|
| **SELECT** | Anyone | Can view all avatars |
| **INSERT** | Authenticated users | Can upload file starting with their user ID |
| **UPDATE** | Authenticated users | Can update file starting with their user ID |
| **DELETE** | Authenticated users | Can delete file starting with their user ID |

See `AVATAR_STORAGE_SETUP.md` for detailed policy explanations.

---

## Testing

### Automated Tests

```typescript
import { runSecurityTests } from './docs/test_avatar_security'

// Run full test suite
const results = await runSecurityTests()

// Expected output:
// ✅ Upload Own Avatar
// ✅ Upload Other User Avatar (blocked)
// ✅ View Own Avatar
// ✅ Delete Own Avatar
// ✅ Delete Other User Avatar (blocked)
// ... etc
```

### Manual Verification

```sql
-- Run in Supabase SQL Editor

-- 1. Check bucket exists
select * from storage.buckets where id = 'avatars';

-- 2. Verify RLS enabled
select rowsecurity from pg_tables
where schemaname = 'storage' and tablename = 'objects';

-- 3. List policies
select policyname, cmd from pg_policies
where schemaname = 'storage' and tablename = 'objects';
```

---

## Common Tasks

### Check if User Has Avatar

```typescript
const { data } = await supabase.storage
  .from('avatars')
  .list('', { limit: 100 })

const userAvatar = data?.find(file =>
  file.name.startsWith(userId)
)

console.log(userAvatar ? 'Has avatar' : 'No avatar')
```

### Get Avatar or Default

```typescript
function getAvatarUrl(userId: string, avatarFileName?: string) {
  if (!avatarFileName) {
    return '/default-avatar.png' // Your default avatar
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(avatarFileName)

  return publicUrl
}
```

### Compress Before Upload

```typescript
import { compressImage } from './docs/avatar_upload_example'

async function uploadCompressedAvatar(file: File, userId: string) {
  const compressed = await compressImage(file, 800) // Max 800px width
  return uploadAvatar(compressed, userId)
}
```

---

## Security Checklist

Before going to production, verify:

- [ ] RLS is enabled on `storage.objects`
- [ ] All 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
- [ ] Bucket is public (for public avatars)
- [ ] File size limit is set (5MB)
- [ ] MIME types are restricted (images only)
- [ ] Filename validation works (user ID prefix)
- [ ] Unauthenticated uploads fail
- [ ] Cross-user uploads fail
- [ ] Security tests pass

Run automated tests:
```typescript
await runSecurityTests() // Should show all green checkmarks
```

---

## Troubleshooting

### "new row violates row-level security policy"

**Problem**: Can't upload file

**Solutions**:
1. Check filename format: Must be `${userId}.${ext}`
2. Verify user is authenticated
3. Ensure policies exist (run verify SQL)

### "The object already exists"

**Problem**: Can't overwrite avatar

**Solution**: Use `upsert: true` in upload options

### File too large

**Problem**: 5MB limit exceeded

**Solutions**:
1. Compress image before upload (see `compressImage()`)
2. Inform user to use smaller image
3. Reject client-side before uploading

### Can't view avatar (404)

**Problem**: Avatar URL returns 404

**Solutions**:
1. Check bucket is public: `select public from storage.buckets where id = 'avatars'`
2. Verify file exists: `select * from storage.objects where name = 'filename.jpg'`
3. Check URL format

---

## Next Steps

1. **Customize** - Adjust file size limit, allowed types, etc.
2. **Add compression** - Implement `compressImage()` before upload
3. **Add cropping** - Use a library like react-image-crop
4. **Monitor usage** - Check storage metrics in dashboard
5. **Set up backups** - Configure automatic storage backups
6. **Add rate limiting** - Prevent abuse
7. **Implement CDN** - Supabase includes CDN by default

---

## Support

### Documentation

- **Full Setup Guide**: `AVATAR_STORAGE_SETUP.md`
- **Quick Reference**: `avatar_quick_reference.md`
- **Client Examples**: `avatar_upload_example.ts`

### Supabase Docs

- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage RLS](https://supabase.com/docs/guides/storage/security/access-control)

### Debugging

1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Run verification SQL queries
4. Run security tests
5. Check this README and other docs

---

## Summary

You now have a complete, production-ready avatar upload system:

- ✅ Secure storage bucket
- ✅ RLS policies preventing unauthorized access
- ✅ Client code ready to use
- ✅ React component
- ✅ Security testing
- ✅ Full documentation

**Ready to implement!** Start with the Quick Start section above.

---

## License

Use freely in your project. No attribution required.

---

**Need help?** Check the documentation files listed above or Supabase docs.
