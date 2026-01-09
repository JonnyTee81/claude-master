# Avatar System Architecture

Visual overview of how the avatar upload system works.

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER UPLOADS AVATAR                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   1. File Selection in UI     │
         │   - User picks image file     │
         │   - Client validates:         │
         │     * File type (JPG/PNG/...)│
         │     * File size (<5MB)        │
         │   - Optional: Compress image  │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   2. Upload to Storage        │
         │   supabase.storage            │
         │     .from('avatars')          │
         │     .upload(fileName, file)   │
         │                               │
         │   Filename: {userId}.{ext}    │
         │   Example: abc-123.jpg        │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   3. RLS Policy Check         │
         │   (storage.objects)           │
         │                               │
         │   ✅ Is user authenticated?   │
         │   ✅ Does filename match      │
         │      user's ID?               │
         │   ✅ Is bucket 'avatars'?     │
         └───────────────┬───────────────┘
                         │
                ┌────────┴────────┐
                │                 │
              PASS              FAIL
                │                 │
                ▼                 ▼
    ┌───────────────────┐   ┌──────────────┐
    │  4a. File Saved   │   │  4b. Error   │
    │  in Storage       │   │  "RLS Policy │
    │                   │   │  Violation"  │
    │  Location:        │   └──────────────┘
    │  /avatars/        │
    │    {userId}.jpg   │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │  5. Get Public URL│
    │  supabase.storage │
    │    .getPublicUrl()│
    │                   │
    │  Returns:         │
    │  https://...      │
    │  /avatars/        │
    │  {userId}.jpg     │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │  6. Update Profile│
    │  supabase         │
    │    .from('profiles')│
    │    .update({      │
    │      avatar_url   │
    │    })             │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │  7. Display in UI │
    │  <img src=        │
    │    {avatar_url} />│
    └───────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────┐
│          auth.users (Supabase)          │
├─────────────────────────────────────────┤
│ id (UUID) - Primary Key                 │
│ email                                    │
│ ... other auth fields                   │
└────────────────┬────────────────────────┘
                 │
                 │ Foreign Key
                 │ ON DELETE CASCADE
                 ▼
┌─────────────────────────────────────────┐
│         public.profiles                 │
├─────────────────────────────────────────┤
│ id (UUID) - FK to auth.users            │
│ email (TEXT)                             │
│ full_name (TEXT)                         │
│ avatar_url (TEXT) ◄────────────────┐    │
│ created_at (TIMESTAMPTZ)            │    │
│ updated_at (TIMESTAMPTZ)            │    │
├─────────────────────────────────────┤    │
│ RLS Policies:                       │    │
│ ✅ Users can view own profile       │    │
│ ✅ Users can update own profile     │    │
│ ✅ Users can insert own profile     │    │
└─────────────────────────────────────┘    │
                                           │
                                           │ References
                                           │ (logical, not FK)
                                           │
┌──────────────────────────────────────────┤
│        storage.objects                   │
├──────────────────────────────────────────┤
│ id (UUID)                                │
│ bucket_id (TEXT) = 'avatars'             │
│ name (TEXT) = '{userId}.{ext}'           │
│ owner (UUID) - References auth.users     │
│ metadata (JSONB)                         │
│   - size                                 │
│   - mimetype                             │
│ created_at (TIMESTAMPTZ)                 │
│ updated_at (TIMESTAMPTZ)                 │
├──────────────────────────────────────────┤
│ RLS Policies:                            │
│ ✅ Anyone can SELECT (public bucket)     │
│ ✅ Users can INSERT own files            │
│ ✅ Users can UPDATE own files            │
│ ✅ Users can DELETE own files            │
└──────────────────────────────────────────┘
         │
         │ Belongs to
         ▼
┌──────────────────────────────────────────┐
│        storage.buckets                   │
├──────────────────────────────────────────┤
│ id (TEXT) = 'avatars'                    │
│ name (TEXT) = 'avatars'                  │
│ public (BOOLEAN) = true                  │
│ file_size_limit (BIGINT) = 5242880       │
│ allowed_mime_types (TEXT[])              │
│   - image/jpeg                           │
│   - image/png                            │
│   - image/gif                            │
│   - image/webp                           │
└──────────────────────────────────────────┘
```

## RLS Policy Logic Flow

### INSERT Policy (Upload)

```
User uploads file: "abc-123.jpg"
                    │
                    ▼
    ┌───────────────────────────────┐
    │  Is bucket_id = 'avatars'?    │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │  Is auth.role() =             │
    │    'authenticated'?           │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │  Does filename start with     │
    │    auth.uid()?                │
    │                               │
    │  Check:                       │
    │  'abc-123' == auth.uid()      │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │        ALLOW UPLOAD           │
    └───────────────────────────────┘
```

### SELECT Policy (View)

```
User views avatar URL
                    │
                    ▼
    ┌───────────────────────────────┐
    │  Is bucket_id = 'avatars'?    │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │        ALLOW VIEW             │
    │   (Public bucket - anyone     │
    │    can view avatars)          │
    └───────────────────────────────┘
```

### DELETE Policy (Remove)

```
User deletes file: "abc-123.jpg"
                    │
                    ▼
    ┌───────────────────────────────┐
    │  Is bucket_id = 'avatars'?    │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │  Is auth.role() =             │
    │    'authenticated'?           │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │  Does filename start with     │
    │    auth.uid()?                │
    │                               │
    │  Check:                       │
    │  'abc-123' == auth.uid()      │
    └────────┬──────────────────────┘
             │
         YES │ NO → DENY
             ▼
    ┌───────────────────────────────┐
    │       ALLOW DELETE            │
    └───────────────────────────────┘
```

## Component Architecture

```
┌──────────────────────────────────────────────────────┐
│                   ProfilePage.tsx                    │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │          Profile Data (from DB)                │ │
│  │  - id                                          │ │
│  │  - email                                       │ │
│  │  - full_name                                   │ │
│  │  - avatar_url ◄──────────────────┐            │ │
│  └────────────────────────────────────┼───────────┘ │
│                                        │             │
│  ┌────────────────────────────────────┼───────────┐ │
│  │        AvatarUpload Component      │           │ │
│  │                                    │           │ │
│  │  ┌──────────────────┐              │           │ │
│  │  │  Avatar Display  │              │           │ │
│  │  │  <img src=       │              │           │ │
│  │  │   {avatar_url}>  │──────────────┘           │ │
│  │  └──────────────────┘                          │ │
│  │                                                 │ │
│  │  ┌──────────────────┐                          │ │
│  │  │  Upload Button   │                          │ │
│  │  │  <input type=    │                          │ │
│  │  │   "file">        │                          │ │
│  │  └────────┬─────────┘                          │ │
│  │           │                                     │ │
│  │           └──► handleUpload()                  │ │
│  │                     │                           │ │
│  │                     ├─► Validate File           │ │
│  │                     ├─► Compress (optional)     │ │
│  │                     ├─► Upload to Storage       │ │
│  │                     ├─► Get Public URL          │ │
│  │                     └─► Update Profile          │ │
│  │                                                 │ │
│  │  ┌──────────────────┐                          │ │
│  │  │  Delete Button   │                          │ │
│  │  └────────┬─────────┘                          │ │
│  │           │                                     │ │
│  │           └──► handleDelete()                  │ │
│  │                     │                           │ │
│  │                     ├─► Delete from Storage     │ │
│  │                     └─► Clear Profile URL       │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## Client-Server Interaction

```
┌─────────────┐                      ┌──────────────────┐
│   Browser   │                      │  Supabase Cloud  │
│             │                      │                  │
│  ┌────────┐ │                      │  ┌────────────┐  │
│  │ React  │ │                      │  │  Storage   │  │
│  │  App   │ │                      │  │  API       │  │
│  └───┬────┘ │                      │  └─────┬──────┘  │
│      │      │                      │        │         │
│      │ 1. Upload file              │        │         │
│      ├──────────────────────────────────────►         │
│      │      │                      │        │         │
│      │      │                      │  2. Check RLS    │
│      │      │                      │     Policies     │
│      │      │                      │        │         │
│      │      │                      │  ┌─────▼──────┐  │
│      │      │                      │  │ storage.   │  │
│      │      │                      │  │ objects    │  │
│      │      │                      │  │ (INSERT)   │  │
│      │      │                      │  └─────┬──────┘  │
│      │      │                      │        │         │
│      │ 3. Success/Error            │        │         │
│      ◄──────────────────────────────────────┘         │
│      │      │                      │                  │
│      │ 4. Get public URL           │                  │
│      ├──────────────────────────────────────►         │
│      ◄──────────────────────────────────────┘         │
│      │      │                      │                  │
│      │      │                      │  ┌────────────┐  │
│      │ 5. Update profile.avatar_url  │ PostgreSQL │  │
│      ├───────────────────────────────►  Database  │  │
│      │      │                      │  │            │  │
│      │      │                      │  │ ┌────────┐ │  │
│      │      │                      │  │ │profiles│ │  │
│      │      │                      │  │ └────────┘ │  │
│      │      │                      │  └─────┬──────┘  │
│      │ 6. Success                  │        │         │
│      ◄──────────────────────────────────────┘         │
│      │      │                      │                  │
│  ┌───▼────┐ │                      │                  │
│  │ Update │ │                      │                  │
│  │   UI   │ │                      │                  │
│  └────────┘ │                      │                  │
│             │                      │                  │
└─────────────┘                      └──────────────────┘
```

## File Storage Structure

```
Supabase Storage
│
└── avatars/ (bucket)
    │
    ├── abc-123-def-456.jpg  ◄─ User ID: abc-123-def-456
    ├── xyz-789-ghi-012.png  ◄─ User ID: xyz-789-ghi-012
    ├── lmn-345-opq-678.webp ◄─ User ID: lmn-345-opq-678
    └── ...

Public URL format:
https://[project-ref].supabase.co/storage/v1/object/public/avatars/{userId}.{ext}

Example:
https://abcdefg.supabase.co/storage/v1/object/public/avatars/abc-123.jpg
```

## Security Layers

```
┌──────────────────────────────────────────────────┐
│               Security Layer 1                   │
│         Client-Side Validation                   │
│  - File type check (JPG/PNG/GIF/WebP)           │
│  - File size check (<5MB)                       │
│  - Filename format check                        │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│               Security Layer 2                   │
│         Bucket Configuration                     │
│  - allowed_mime_types enforcement               │
│  - file_size_limit enforcement                  │
│  - public/private setting                       │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│               Security Layer 3                   │
│          RLS Policies (INSERT)                   │
│  - Authentication check                         │
│  - Filename matches user ID                     │
│  - Bucket ID verification                       │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│               Security Layer 4                   │
│        Database-Level Permissions                │
│  - Supabase service role                        │
│  - Row-level security enforcement               │
└──────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Upload Request
       │
       ▼
┌──────────────────┐
│  File too large? ├─YES─► "File must be less than 5MB"
└─────┬────────────┘
      NO
      │
      ▼
┌──────────────────┐
│  Invalid type?   ├─YES─► "File must be JPG/PNG/GIF/WebP"
└─────┬────────────┘
      NO
      │
      ▼
┌──────────────────┐
│ Authenticated?   ├─NO──► "Please log in first"
└─────┬────────────┘
      YES
      │
      ▼
┌──────────────────┐
│ Filename valid?  ├─NO──► "Invalid filename format"
└─────┬────────────┘
      YES
      │
      ▼
┌──────────────────┐
│ Upload to        │
│ Storage          │
└─────┬────────────┘
      │
      ├─ERROR─► "RLS policy violation: filename must start with user ID"
      │
      ├─ERROR─► "Network error"
      │
      └─SUCCESS
           │
           ▼
    ┌──────────────────┐
    │ Get Public URL   │
    └─────┬────────────┘
          │
          ▼
    ┌──────────────────┐
    │ Update Profile   │
    └─────┬────────────┘
          │
          ├─ERROR─► "Failed to update profile"
          │
          └─SUCCESS
               │
               ▼
        "Avatar uploaded!"
```

## Performance Optimization

```
┌─────────────────────────────────────────────────┐
│            Avatar Upload Performance             │
└─────────────────────────────────────────────────┘

Original File: 3.5MB, 4000x3000px
       │
       ▼
┌──────────────────┐
│  1. Compress     │  Reduce to 800px width
│     Image        │  Quality: 85%
└─────┬────────────┘
      │
      │ Result: 250KB, 800x600px
      ▼
┌──────────────────┐
│  2. Upload to    │  Faster upload
│     Storage      │  Less bandwidth
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  3. Supabase CDN │  Cached for 1 hour
│     Caching      │  (cache-control: 3600)
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  4. Browser      │  Cached in browser
│     Caching      │  Fewer requests
└──────────────────┘

Improvement:
- Upload time: 10s → 2s
- Storage cost: -93%
- Bandwidth: -93%
- Load time: <100ms (CDN)
```

## Summary

This architecture provides:
- **Security**: Multi-layer validation and RLS policies
- **Performance**: CDN caching and image compression
- **Scalability**: Supabase handles infrastructure
- **Simplicity**: Clean separation of concerns
- **Reliability**: Built on Supabase's proven platform

The system is production-ready and follows best practices for secure file uploads.
