# Avatar System Integration Guide

This guide shows how to integrate the avatar upload system with your existing profiles table.

## Overview

Your existing setup:
- **Profiles table** already exists with `avatar_url` column
- **RLS policies** on profiles allow users to SELECT/UPDATE/INSERT their own profile
- **Triggers** automatically create profile on user signup and update `updated_at`

New addition:
- **Avatars storage bucket** for storing actual image files
- **Storage RLS policies** to secure file uploads
- **Client functions** to handle upload/delete operations

## Architecture

```
User uploads avatar file
       ↓
Storage bucket (avatars/)
       ↓
Get public URL
       ↓
Update profiles.avatar_url
       ↓
Display in UI
```

## Complete Integration Flow

### 1. Database Setup (One-Time)

Run the migration to create storage bucket:

```bash
# In Supabase Dashboard → SQL Editor
# Paste and run: supabase/migrations/create_avatar_storage.sql
```

This creates:
- Storage bucket named `avatars`
- 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)
- Optional helper functions

### 2. Client-Side Upload Flow

```typescript
// Example: Profile page with avatar upload

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const supabase = createClient(url, key)

export function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // 1. Load user profile
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    }

    loadProfile()
  }, [])

  // 2. Handle avatar upload
  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Validate file
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File must be JPG, PNG, GIF, or WebP')
      }

      // Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile (this triggers the updated_at timestamp automatically)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))

      alert('Avatar updated successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  // 3. Handle avatar deletion
  async function handleAvatarDelete() {
    try {
      setUploading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Extract filename from current avatar URL
      const currentUrl = profile?.avatar_url
      if (!currentUrl) throw new Error('No avatar to delete')

      const fileName = currentUrl.split('/').pop()

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName])

      if (deleteError) throw deleteError

      // Update profile to remove avatar_url
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: null }))

      alert('Avatar deleted successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="avatar-section">
        {profile.avatar_url ? (
          <div>
            <img
              src={profile.avatar_url}
              alt="Avatar"
              style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }}
            />
            <button onClick={handleAvatarDelete} disabled={uploading}>
              {uploading ? 'Deleting...' : 'Delete Avatar'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              No Avatar
            </div>
          </div>
        )}

        <div>
          <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>
          </label>
        </div>
      </div>

      <div className="profile-info">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Name:</strong> {profile.full_name}</p>
        <p><strong>Updated:</strong> {new Date(profile.updated_at).toLocaleString()}</p>
      </div>
    </div>
  )
}
```

## Displaying Avatars in Lists

When showing user avatars in lists (e.g., comments, user directory):

```typescript
// Example: User card component
function UserCard({ userId }: { userId: string }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single()

      setProfile(data)
    }

    loadProfile()
  }, [userId])

  return (
    <div className="user-card">
      <img
        src={profile?.avatar_url || '/default-avatar.png'}
        alt={profile?.full_name || 'User'}
        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
      />
      <span>{profile?.full_name}</span>
    </div>
  )
}
```

## Optimized Avatar Component

For better performance with many avatars:

```typescript
// Avatar component with fallback and loading state
import { useState, useEffect } from 'react'

interface AvatarProps {
  src: string | null
  alt?: string
  size?: number
  fallback?: string
}

export function Avatar({ src, alt = 'User', size = 40, fallback = '/default-avatar.png' }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setImgSrc(src || fallback)
  }, [src, fallback])

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: loading ? '#f0f0f0' : 'transparent',
      }}
    >
      <img
        src={imgSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loading ? 'none' : 'block',
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc(fallback)
          setLoading(false)
        }}
      />
    </div>
  )
}

// Usage
<Avatar src={profile.avatar_url} alt={profile.full_name} size={50} />
```

## Image Compression (Recommended)

Always compress images before upload to save storage and bandwidth:

```typescript
async function compressImage(file: File, maxWidth: number = 800): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Compression failed'))
            }
          },
          file.type,
          0.85 // Quality (0-1)
        )
      }

      img.onerror = reject
    }

    reader.onerror = reject
  })
}

// Use in upload handler
async function handleAvatarUpload(file: File) {
  const compressed = await compressImage(file, 500) // Max 500px wide
  // ... then upload compressed file
}
```

## Advanced: Image Cropping

For better UX, allow users to crop their avatar:

```typescript
// Install: npm install react-image-crop
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function AvatarCropper() {
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1, // Square crop
  })

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setSrc(reader.result as string))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  async function getCroppedImg(): Promise<File> {
    // Implement cropping logic
    // Return cropped image as File
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {src && (
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
          <img src={src} alt="Crop me" />
        </ReactCrop>
      )}
      <button onClick={async () => {
        const croppedFile = await getCroppedImg()
        // Upload croppedFile
      }}>
        Upload Cropped Avatar
      </button>
    </div>
  )
}
```

## Automatic Profile Update (Alternative)

Instead of manually updating `profiles.avatar_url` in client code, you can use a database trigger:

```sql
-- This is already in create_avatar_storage.sql (commented out)
-- Uncomment if you want automatic profile updates

create or replace function handle_avatar_upload()
returns trigger
language plpgsql
security definer
as $$
declare
  user_id_from_filename uuid;
  public_url text;
begin
  user_id_from_filename := (regexp_match(NEW.name, '^([a-f0-9\-]+)\.'))[1]::uuid;

  if NEW.bucket_id = 'avatars' and user_id_from_filename is not null then
    public_url := format(
      'https://your-project-ref.supabase.co/storage/v1/object/public/avatars/%s',
      NEW.name
    );

    update public.profiles
    set
      avatar_url = public_url,
      updated_at = now()
    where id = user_id_from_filename;
  end if;

  return NEW;
end;
$$;

create trigger on_avatar_upload
  after insert on storage.objects
  for each row
  execute function handle_avatar_upload();
```

**Pros**: Less client code, guaranteed consistency
**Cons**: Need to update Supabase project URL in function

## Testing the Integration

1. **Test upload**:
   - Log in as a user
   - Upload an avatar
   - Verify `profiles.avatar_url` is updated
   - Check file exists in storage

2. **Test permissions**:
   - Try to upload another user's avatar (should fail)
   - Try to delete another user's avatar (should fail)

3. **Test UI**:
   - Upload new avatar (should replace old)
   - Delete avatar (should show placeholder)
   - Refresh page (avatar should persist)

Use the security test suite:

```typescript
import { runSecurityTests } from './docs/test_avatar_security'
await runSecurityTests()
```

## Cleanup: Removing Orphaned Avatars

Sometimes avatars might remain in storage after users are deleted. Clean them up:

```sql
-- Find avatars without corresponding users
select o.name, o.created_at
from storage.objects o
where o.bucket_id = 'avatars'
  and not exists (
    select 1
    from public.profiles p
    where p.id::text = substring(o.name from '^[a-f0-9\-]+')
  );

-- Delete orphaned avatars (run carefully!)
delete from storage.objects
where bucket_id = 'avatars'
  and not exists (
    select 1
    from public.profiles p
    where p.id::text = substring(name from '^[a-f0-9\-]+')
  );
```

## Performance Considerations

1. **CDN Caching**: Supabase Storage uses CDN by default (cache-control: 3600s)
2. **Lazy Loading**: Load avatars only when visible (use Intersection Observer)
3. **Compression**: Always compress images before upload
4. **Thumbnails**: For large lists, consider creating thumbnails
5. **Batch Loading**: Load multiple profiles in one query:

```typescript
// Instead of loading profiles one by one
const userIds = ['id1', 'id2', 'id3']
const { data: profiles } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url')
  .in('id', userIds)
```

## Summary

Integration checklist:

- [x] Profiles table exists with `avatar_url` column
- [ ] Run `create_avatar_storage.sql` migration
- [ ] Verify setup with `verify_avatar_storage.sql`
- [ ] Add upload component to profile page
- [ ] Implement compression (recommended)
- [ ] Test upload/delete/view
- [ ] Run security tests
- [ ] Display avatars in UI
- [ ] Add fallback images
- [ ] Test in production

You're all set! The avatar system integrates seamlessly with your existing profiles table.
