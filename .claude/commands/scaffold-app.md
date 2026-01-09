---
description: Scaffold a complete Next.js + Supabase application with authentication, database setup, and deployment configuration
argument-hint: "<app-name>"
---

# Scaffold Next.js + Supabase Application

Create a production-ready Next.js application with Supabase backend, authentication, and Vercel deployment setup.

## Workflow

1. **Create Next.js project**
```bash
   npx create-next-app@latest {app-name} --typescript --tailwind --app --use-npm
   cd {app-name}
```

2. **Install dependencies**
```bash
   npm install @supabase/ssr @supabase/supabase-js
   npm install -D @playwright/test
```

3. **Setup Supabase clients**
   - Create `lib/supabase/server.ts` (server client)
   - Create `lib/supabase/client.ts` (client client)
   - Create `lib/supabase/middleware.ts` (middleware helper)

4. **Create middleware**
   - Create `middleware.ts` for auth protection
   - Configure matcher for protected routes

5. **Setup authentication pages**
   - Create `app/(auth)/login/page.tsx`
   - Create `app/(auth)/signup/page.tsx`
   - Create auth Server Actions in `lib/actions/auth.ts`

6. **Create protected dashboard**
   - Create `app/(dashboard)/dashboard/page.tsx`
   - Add layout with navigation
   - Add logout functionality

7. **Setup database schema**
   - Create initial `profiles` table migration
   - Enable RLS
   - Create policies
   - Add indexes

8. **Add environment variables**
   - Create `.env.local` with placeholders
   - Create `.env.example` for reference
   - Document required variables

9. **Setup Playwright tests**
   - Create `playwright.config.ts`
   - Create `tests/e2e/auth/` directory
   - Add basic auth flow tests
   - Add test scripts to `package.json`

10. **Configure Vercel deployment**
    - Create deployment checklist in README
    - Document environment variable setup

11. **Update README**
    - Add setup instructions
    - Add development instructions
    - Add deployment instructions
    - Add testing instructions

12. **Initialize git**
```bash
    git init
    git add .
    git commit -m "Initial commit: Next.js + Supabase scaffold"
```

## Deliverables

After completion, you should have:
- ✅ Working Next.js app with App Router
- ✅ Supabase clients configured
- ✅ Authentication (login/signup) working
- ✅ Protected routes with middleware
- ✅ Database schema with RLS
- ✅ Basic Playwright tests
- ✅ Environment variables documented
- ✅ README with instructions
- ✅ Git repository initialized

## Next Steps

Suggest to user:
1. Create Supabase project: https://supabase.com/dashboard
2. Add environment variables to `.env.local`
3. Run migrations in Supabase SQL Editor
4. Start dev server: `npm run dev`
5. Test auth flow
6. Deploy to Vercel
7. Add environment variables in Vercel dashboard