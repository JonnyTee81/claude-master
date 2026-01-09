---
description: Pre-deployment checklist and validation before pushing to Vercel
---

# Pre-Deployment Checklist

Run comprehensive checks before deploying to production.

## 1. Environment Variables Check

Verify all required environment variables:
```bash
# Check .env.local
cat .env.local

# Verify against .env.example
diff <(grep "^[A-Z]" .env.local | cut -d= -f1 | sort) <(grep "^[A-Z]" .env.example | cut -d= -f1 | sort)
```

Ensure Vercel has all variables:
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Any other custom variables

## 2. Build Verification

Test production build:
```bash
npm run build
```

Check for:
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] No warnings (or document if acceptable)

## 3. Supabase Configuration

Verify Supabase settings:
- [ ] All tables have RLS enabled
- [ ] RLS policies tested
- [ ] Auth redirect URLs include Vercel domains
  - Add: `https://your-app.vercel.app/*`
  - Add: `https://your-app-*.vercel.app/*` (for preview deploys)

Test in Supabase dashboard:
```sql
-- Verify RLS is enabled
select tablename, rowsecurity 
from pg_tables 
where schemaname = 'public';

-- Should show 't' (true) for all tables
```

## 4. Database Migrations

Ensure all migrations run:
- [ ] No pending migrations
- [ ] All migrations tested locally
- [ ] Foreign keys exist
- [ ] Indexes created

## 5. Test Suite

Run full test suite:
```bash
# E2E tests
npm run test:e2e

# Check for flaky tests (run twice)
npm run test:e2e
```

Verify:
- [ ] All critical path tests pass
- [ ] Auth flow tests pass
- [ ] CRUD operation tests pass
- [ ] No flaky tests

## 6. Performance Check

Test key pages for performance:
```bash
# Build and start production server
npm run build
npm run start

# Visit key pages and check for:
# - Load times < 3s
# - No console errors
# - No unnecessary re-renders
```

## 7. Security Audit

Manual security checks:
- [ ] No sensitive data in client code
- [ ] No exposed API keys (except NEXT_PUBLIC_* which are safe)
- [ ] RLS policies prevent unauthorized access
- [ ] Auth middleware protecting routes
- [ ] No SQL injection vectors

Quick check:
```bash
# Search for sensitive patterns
grep -r "process.env" app/ --exclude-dir=node_modules | grep -v "NEXT_PUBLIC"
```

## 8. Dependency Audit

Check for security issues:
```bash
npm audit

# If issues found, try to fix
npm audit fix
```

## 9. Git Status

Ensure clean state:
```bash
git status

# Should show clean working tree
# Commit any pending changes
```

## 10. Documentation

Verify docs are current:
- [ ] README accurate
- [ ] Setup instructions work
- [ ] Environment variables documented
- [ ] Deployment instructions current

## 11. Preview Deployment Test

Before production:
1. Push to GitHub (non-main branch)
2. Vercel creates preview deployment
3. Test preview URL thoroughly
4. Test authentication on preview
5. Test all critical paths
6. Check Vercel logs for errors

## 12. Rollback Plan

Document rollback procedure:
- [ ] Previous version tagged in git
- [ ] Database changes are backward compatible
- [ ] Know how to revert in Vercel (instant rollback)

## Final Checks

Before merging to main:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Preview deployment tested
- [ ] Database migrations run on production
- [ ] Environment variables set in Vercel production

## Post-Deployment

After deploying:
1. Visit production URL
2. Test authentication flow
3. Test one complete user journey
4. Check Vercel logs for errors
5. Monitor for 10-15 minutes

## Rollback Procedure

If issues found:
```bash
# In Vercel dashboard:
# Deployments → [Select previous good deployment] → Promote to Production

# Or via CLI:
vercel rollback
```

## Success Criteria

Deployment is successful when:
- ✅ Site loads without errors
- ✅ Authentication works
- ✅ Critical features functional
- ✅ No console errors
- ✅ No Vercel errors in logs
- ✅ Database operations work
- ✅ Mobile experience good

Remember: It's easier to catch issues before deployment than after!