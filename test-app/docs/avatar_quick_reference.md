# Avatar Upload Quick Reference

Fast reference for common avatar operations. See `AVATAR_STORAGE_SETUP.md` for full documentation.

## Setup Checklist

```bash
# 1. Run SQL migration
# Copy supabase/migrations/create_avatar_storage.sql → Supabase SQL Editor → Run

# 2. Verify setup
# Copy supabase/migrations/verify_avatar_storage.sql → SQL Editor → Run

# 3. Test in client
# Import functions from avatar_upload_example.ts
```

## Client Code Snippets

### Upload Avatar

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}.jpg`, file, { upsert: true })

if (!error) {
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}.jpg`)

  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
}
```

### Delete Avatar

```typescript
await supabase.storage
  .from('avatars')
  .remove([`${userId}.jpg`])

await supabase
  .from('profiles')
  .update({ avatar_url: null })
  .eq('id', userId)
```

### Get Public URL

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}.jpg`)
```

### Download Avatar

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download(`${userId}.jpg`)
```

## File Constraints

- **Max size**: 5MB (5242880 bytes)
- **Allowed types**: JPG, PNG, GIF, WebP
- **Naming**: `{userId}.{ext}` (e.g., `abc-123.jpg`)
- **Quantity**: One avatar per user (upsert overwrites)

## Validation

```typescript
// File type
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type')
}

// File size
const maxSize = 5 * 1024 * 1024 // 5MB
if (file.size > maxSize) {
  throw new Error('File too large')
}
```

## SQL Quick Checks

```sql
-- Check bucket exists
select * from storage.buckets where id = 'avatars';

-- Check RLS enabled
select rowsecurity from pg_tables
where schemaname = 'storage' and tablename = 'objects';

-- List policies
select policyname, cmd from pg_policies
where schemaname = 'storage' and tablename = 'objects';

-- Count avatars
select count(*) from storage.objects where bucket_id = 'avatars';

-- Check user's avatar
select * from storage.objects
where bucket_id = 'avatars' and name like 'USER_ID%';
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "new row violates row-level security policy" | Filename doesn't start with user ID | Use `${userId}.${ext}` format |
| "The object already exists" | File exists, upsert = false | Set `upsert: true` |
| 404 on avatar URL | Bucket not public or file missing | Check bucket public setting |
| "File size exceeds limit" | File > 5MB | Compress image first |
| "Invalid MIME type" | Wrong file format | Use JPG/PNG/GIF/WebP only |

## RLS Policies Summary

| Operation | Who Can Do It | Condition |
|-----------|---------------|-----------|
| SELECT | Anyone | File in avatars bucket |
| INSERT | Authenticated users | Filename starts with their user ID |
| UPDATE | Authenticated users | Filename starts with their user ID |
| DELETE | Authenticated users | Filename starts with their user ID |

## File Structure

```
project/
├── supabase/
│   └── migrations/
│       ├── create_avatar_storage.sql     # Main setup
│       └── verify_avatar_storage.sql     # Verification
└── docs/
    ├── avatar_upload_example.ts          # Client code
    ├── AVATAR_STORAGE_SETUP.md          # Full guide
    └── avatar_quick_reference.md        # This file
```

## URLs

```
Public URL format:
https://[project-ref].supabase.co/storage/v1/object/public/avatars/{filename}

Example:
https://abcdefghijk.supabase.co/storage/v1/object/public/avatars/abc-123.jpg
```

## React Component (Minimal)

```tsx
function AvatarUpload({ userId }: { userId: string }) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (error) alert(error.message)
    else alert('Uploaded!')
  }

  return (
    <input
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      onChange={handleUpload}
    />
  )
}
```

## Security Checks

```typescript
// Test RLS is working
async function testSecurity() {
  const { data: { user } } = await supabase.auth.getUser()

  // Should succeed
  await supabase.storage.from('avatars').upload(`${user.id}.jpg`, file)

  // Should fail
  await supabase.storage.from('avatars').upload('other-user.jpg', file)
}
```

## Performance Tips

1. **Compress images** before upload (use Canvas API)
2. **Cache avatar URLs** in your app state
3. **Use CDN** - Supabase Storage includes CDN
4. **Lazy load** avatars in lists
5. **Set cache headers** - Already set to 3600s

## Next Steps

1. Run SQL migration
2. Test upload in client
3. Add to profile page UI
4. Implement compression
5. Add loading states
6. Handle errors gracefully

---

For complete documentation, see `/docs/AVATAR_STORAGE_SETUP.md`
