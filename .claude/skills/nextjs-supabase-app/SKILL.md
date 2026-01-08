---
name: nextjs-supabase-app
description: Build Next.js 14+ applications with Supabase, following modern patterns. Use when scaffolding apps, adding features, or implementing auth. Includes Vercel deployment considerations.
---

# Next.js + Supabase Application Builder

You are an expert at building modern Next.js applications with Supabase backend.

## Tech Stack Standards
- **Next.js 14+** with App Router (never Pages Router)
- **TypeScript** with strict mode
- **Supabase** for backend (database, auth, storage, realtime)
- **Tailwind CSS** for styling
- **shadcn/ui** for components when appropriate
- **Vercel** for deployment

## Project Structure
```
/app
  /(auth)         # Auth-related pages
  /(dashboard)    # Protected routes
  /api            # API routes (minimal, prefer Server Actions)
/components
  /ui             # shadcn/ui components
  /[feature]      # Feature-specific components
/lib
  /supabase       # Supabase client configs
  /actions        # Server Actions
  /hooks          # Custom React hooks
  /utils          # Utility functions
/types            # TypeScript types
```

## Authentication Patterns

### Always use Supabase Auth with these principles:
1. **Server Components by default** - Use `createServerClient` for RSC
2. **Client Components when needed** - Use `createBrowserClient` for client-side
3. **Middleware for protected routes** - Check auth in middleware.ts
4. **RLS everywhere** - Every table must have Row Level Security policies

### Standard Auth Setup:
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### Middleware Pattern:
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if accessing protected route
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## Database Patterns

### Always follow these RLS principles:
1. **Enable RLS on every table**
2. **Create policies for each operation** (SELECT, INSERT, UPDATE, DELETE)
3. **Test policies thoroughly** before going to production
4. **Use `auth.uid()`** to scope to current user

### Example Table with RLS:
```sql
-- Create table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);
```

## Server Actions Pattern

Prefer Server Actions over API routes for mutations:
```typescript
// lib/actions/profile.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const username = formData.get('username') as string
  
  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/profile')
  return { success: true }
}
```

## Component Patterns

### Server Component (default):
```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
  
  return <div>...</div>
}
```

### Client Component (when needed):
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function RealtimeComponent() {
  const [data, setData] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('realtime-data')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          // Handle realtime updates
        }
      )
      .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [])
  
  return <div>...</div>
}
```

## Error Handling

Always handle errors gracefully:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')

if (error) {
  console.error('Error fetching profiles:', error)
  return { error: 'Failed to load profiles' }
}
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel deployment:
- Add these in Vercel dashboard → Settings → Environment Variables
- Available to all environments (Development, Preview, Production)

## Vercel Deployment Checklist

Before deploying:
1. ✅ All environment variables set in Vercel
2. ✅ Supabase database migrations run
3. ✅ RLS policies tested
4. ✅ Auth redirect URLs configured in Supabase (add Vercel domains)
5. ✅ Test authentication flow on preview deployment
6. ✅ Check for any hardcoded localhost URLs

## Common Pitfalls to Avoid

❌ **Don't** use Pages Router patterns
❌ **Don't** forget to enable RLS
❌ **Don't** use client components unnecessarily
❌ **Don't** forget revalidatePath after mutations
❌ **Don't** expose service role key in client code
❌ **Don't** skip TypeScript types
❌ **Don't** forget to handle loading and error states

✅ **Do** use Server Components by default
✅ **Do** enable RLS on every table
✅ **Do** use Server Actions for mutations
✅ **Do** implement proper TypeScript types
✅ **Do** test auth flows thoroughly
✅ **Do** use Supabase's built-in auth hooks
✅ **Do** implement proper error boundaries

## Testing Considerations

- Unit tests for utility functions
- Integration tests for Server Actions
- E2E tests for critical auth flows
- Test RLS policies in Supabase dashboard before deployment

## Performance Best Practices

1. **Use streaming** for slow queries
2. **Implement pagination** for large datasets
3. **Use Supabase indexes** for frequently queried columns
4. **Cache static data** with proper revalidation
5. **Optimize images** with next/image
6. **Use loading.tsx** for instant loading states
7. **Implement error.tsx** for error boundaries

When scaffolding a new app, always:
1. Set up the project structure
2. Configure Supabase clients (server + client)
3. Set up authentication middleware
4. Create initial database schema with RLS
5. Implement auth UI (login/signup)
6. Add basic protected routes
7. Set up environment variables
8. Create deployment checklist