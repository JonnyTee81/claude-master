# Test App

A production-ready Next.js 14+ application with Supabase authentication, protected routes, and end-to-end testing.

## Features

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Supabase Authentication
- Protected routes with middleware
- Row Level Security (RLS) policies
- Playwright E2E tests
- Ready for Vercel deployment

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be set up (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

1. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste and run the migration
5. Verify the `profiles` table was created in **Table Editor**

### 5. Install Dependencies

```bash
npm install
```

### 6. Install Playwright Browsers (for testing)

```bash
npx playwright install
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
test-app/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── (dashboard)/
│   │   ├── dashboard/      # Protected dashboard
│   │   └── layout.tsx      # Dashboard layout with nav
│   └── page.tsx            # Home page
├── components/
│   └── LogoutButton.tsx    # Logout button component
├── lib/
│   ├── actions/
│   │   └── auth.ts         # Server actions for auth
│   └── supabase/
│       ├── client.ts       # Client-side Supabase client
│       ├── server.ts       # Server-side Supabase client
│       └── middleware.ts   # Middleware helper
├── supabase/
│   └── migrations/         # Database migrations
├── tests/
│   └── e2e/
│       └── auth/           # Authentication E2E tests
├── middleware.ts           # Route protection middleware
└── .env.local             # Environment variables (create this)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests with UI
- `npm run test:debug` - Debug tests

## Testing

This project includes Playwright E2E tests for authentication flows.

### Run Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Debug Tests

```bash
npm run test:debug
```

## Authentication Flow

1. **Sign Up**: Users create an account with email/password
2. **Email Confirmation**: Supabase sends a confirmation email (configurable)
3. **Sign In**: Users log in with their credentials
4. **Protected Routes**: Middleware redirects unauthenticated users to `/login`
5. **Sign Out**: Users can log out from the dashboard

## Database Schema

The app includes a `profiles` table with:
- User profile information
- Automatic profile creation on signup
- Row Level Security (RLS) policies
- Indexes for performance

See `supabase/migrations/20240101000000_initial_schema.sql` for details.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Supabase Site URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your Vercel deployment URL to **Site URL**
3. Add redirect URLs if needed

## Security Notes

- Environment variables are properly configured for client/server usage
- Row Level Security (RLS) is enabled on all tables
- Middleware protects all routes except auth pages
- Server-side validation in Server Actions
- CSRF protection via Supabase

## Customization

### Add More Protected Routes

Add routes to the middleware matcher in `middleware.ts` or create new route groups under `(dashboard)`.

### Modify the Profile Schema

1. Update the migration in `supabase/migrations/`
2. Run the new migration in Supabase SQL Editor
3. Update TypeScript types as needed

### Customize Authentication

Edit the auth forms in `app/(auth)/` and server actions in `lib/actions/auth.ts`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Playwright Documentation](https://playwright.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions:
- Next.js: [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- Supabase: [Discord Community](https://discord.supabase.com)
- Playwright: [GitHub Issues](https://github.com/microsoft/playwright/issues)
