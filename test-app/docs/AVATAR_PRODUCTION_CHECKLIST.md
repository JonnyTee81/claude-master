# Avatar System - Production Deployment Checklist

Complete checklist for deploying the avatar upload system to production.

## Pre-Deployment

### 1. Database Setup

- [ ] **Run SQL migration in production**
  ```sql
  -- In Supabase Dashboard → SQL Editor
  -- Run: supabase/migrations/create_avatar_storage.sql
  ```

- [ ] **Verify bucket created**
  ```sql
  select * from storage.buckets where id = 'avatars';
  -- Expected: 1 row with public=true, file_size_limit=5242880
  ```

- [ ] **Verify RLS enabled**
  ```sql
  select rowsecurity from pg_tables
  where schemaname = 'storage' and tablename = 'objects';
  -- Expected: true
  ```

- [ ] **Verify all 4 policies exist**
  ```sql
  select policyname, cmd from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and policyname like '%avatar%';
  -- Expected: 4 rows (SELECT, INSERT, UPDATE, DELETE)
  ```

### 2. Security Testing

- [ ] **Run automated security tests**
  ```typescript
  import { runSecurityTests } from './docs/test_avatar_security'
  await runSecurityTests()
  // All tests should pass
  ```

- [ ] **Manual security tests**
  - [ ] Authenticated user can upload their own avatar
  - [ ] Authenticated user CANNOT upload other user's avatar
  - [ ] Unauthenticated user CANNOT upload
  - [ ] Anyone can view public avatar URLs
  - [ ] User can delete their own avatar
  - [ ] User CANNOT delete other user's avatar

- [ ] **Test file validation**
  - [ ] Files larger than 5MB are rejected
  - [ ] Non-image files (PDF, etc.) are rejected
  - [ ] Valid image types (JPG, PNG, GIF, WebP) are accepted

### 3. Client Code

- [ ] **Environment variables set**
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
  ```

- [ ] **Upload function implemented**
  - [ ] Validates file type
  - [ ] Validates file size
  - [ ] Compresses image (recommended)
  - [ ] Uploads to storage
  - [ ] Updates profile.avatar_url
  - [ ] Handles errors gracefully

- [ ] **Delete function implemented**
  - [ ] Deletes from storage
  - [ ] Clears profile.avatar_url
  - [ ] Handles errors gracefully

- [ ] **UI components ready**
  - [ ] Avatar display component
  - [ ] Upload button/input
  - [ ] Delete button
  - [ ] Loading states
  - [ ] Error messages
  - [ ] Success feedback

### 4. Performance Optimization

- [ ] **Image compression implemented**
  ```typescript
  // Compress before upload
  const compressed = await compressImage(file, 800)
  await uploadAvatar(compressed, userId)
  ```

- [ ] **CDN caching configured**
  ```typescript
  // Set cache-control header
  upload(fileName, file, { cacheControl: '3600' })
  ```

- [ ] **Avatar component optimized**
  - [ ] Lazy loading for lists
  - [ ] Fallback images for missing avatars
  - [ ] Loading states
  - [ ] Error handling (image fails to load)

### 5. User Experience

- [ ] **Clear upload instructions**
  - "Upload a JPG, PNG, GIF, or WebP image (max 5MB)"

- [ ] **File size indicator**
  - Show selected file size before upload

- [ ] **Preview before upload**
  - Show image preview after selection

- [ ] **Loading indicators**
  - Spinner/progress during upload
  - Disable buttons while processing

- [ ] **Success/error messages**
  - "Avatar uploaded successfully!"
  - Clear error messages for failures

- [ ] **Avatar preview updates immediately**
  - Show new avatar without page refresh

## Deployment

### 6. Production Deployment

- [ ] **Update Supabase project URL in code**
  ```typescript
  // If using auto-update trigger (optional)
  // Update URL in handle_avatar_upload() function
  ```

- [ ] **Deploy client code**
  - [ ] Build passes
  - [ ] No TypeScript errors
  - [ ] No console errors

- [ ] **Test in production environment**
  - [ ] Upload avatar
  - [ ] Delete avatar
  - [ ] View avatar
  - [ ] Refresh page (avatar persists)

### 7. Monitoring Setup

- [ ] **Set up storage alerts**
  - [ ] Alert if storage usage > 80%
  - [ ] Alert on unusual upload patterns

- [ ] **Monitor storage metrics**
  - [ ] Total files uploaded
  - [ ] Total storage used
  - [ ] Average file size

- [ ] **Error tracking**
  - [ ] Log upload failures
  - [ ] Track RLS policy violations
  - [ ] Monitor network errors

### 8. Documentation

- [ ] **User documentation**
  - How to upload avatar
  - Supported file types
  - File size limits
  - How to delete avatar

- [ ] **Developer documentation**
  - [ ] API reference
  - [ ] Component usage
  - [ ] Troubleshooting guide

## Post-Deployment

### 9. Verification

- [ ] **Verify in production**
  ```bash
  # Test with real user account
  1. Log in as test user
  2. Upload avatar
  3. Verify file in Supabase Storage dashboard
  4. Verify avatar_url in profiles table
  5. Check avatar displays correctly
  6. Delete avatar
  7. Verify file removed from storage
  8. Verify avatar_url cleared in profiles
  ```

- [ ] **Check Supabase dashboard**
  - [ ] Storage > Avatars bucket exists
  - [ ] Files are being uploaded
  - [ ] Storage usage is reasonable
  - [ ] No error logs

- [ ] **Performance testing**
  - [ ] Upload time < 5 seconds
  - [ ] Page load time < 2 seconds
  - [ ] Avatar images load quickly

### 10. Maintenance Setup

- [ ] **Regular cleanup tasks**
  ```sql
  -- Schedule monthly cleanup of orphaned avatars
  delete from storage.objects
  where bucket_id = 'avatars'
    and not exists (
      select 1 from public.profiles p
      where p.id::text = substring(name from '^[a-f0-9\-]+')
    );
  ```

- [ ] **Backup strategy**
  - [ ] Supabase automatic backups enabled
  - [ ] Consider separate storage backups

- [ ] **Update policy**
  - [ ] Plan for increasing file size limit if needed
  - [ ] Plan for adding new file types if needed

### 11. User Support

- [ ] **Common issues documented**
  - "File too large" → Compress or use smaller image
  - "Invalid file type" → Use JPG, PNG, GIF, or WebP
  - "Upload failed" → Check internet connection, try again

- [ ] **Support contact**
  - [ ] Email or support form for avatar issues

## Security Hardening (Optional but Recommended)

### 12. Additional Security

- [ ] **Rate limiting**
  ```typescript
  // Limit uploads to 5 per hour per user
  // Use Supabase Edge Functions or middleware
  ```

- [ ] **Content scanning**
  - [ ] Virus scanning (Supabase Enterprise)
  - [ ] NSFW content detection (optional)

- [ ] **Image validation**
  ```typescript
  // Verify file is actually an image
  // Check image dimensions
  // Strip EXIF data (privacy)
  ```

- [ ] **Logging and auditing**
  ```sql
  -- Log all avatar changes
  create table avatar_audit_log (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users,
    action text, -- 'upload', 'delete'
    filename text,
    timestamp timestamptz default now()
  );
  ```

### 13. Compliance (if applicable)

- [ ] **GDPR compliance**
  - [ ] User can delete their avatar
  - [ ] Avatar deleted when user account deleted
  - [ ] Privacy policy mentions avatar storage

- [ ] **Terms of Service**
  - [ ] Acceptable use policy for avatars
  - [ ] Content restrictions

## Performance Benchmarks

Target metrics for production:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Upload time (1MB file) | < 3s | ___ | [ ] |
| Upload time (compressed 200KB) | < 1s | ___ | [ ] |
| Page load with avatar | < 2s | ___ | [ ] |
| Avatar CDN cache hit rate | > 90% | ___ | [ ] |
| Storage cost per 1000 users | < $1/month | ___ | [ ] |

## Rollback Plan

If something goes wrong:

- [ ] **Database rollback**
  ```sql
  -- Drop bucket (WARNING: deletes all avatars)
  delete from storage.buckets where id = 'avatars';

  -- Drop policies
  drop policy "Anyone can view avatars" on storage.objects;
  drop policy "Users can upload their own avatar" on storage.objects;
  drop policy "Users can update their own avatar" on storage.objects;
  drop policy "Users can delete their own avatar" on storage.objects;
  ```

- [ ] **Client rollback**
  - Revert to previous deployment
  - Hide avatar upload UI
  - Use default avatars only

## Success Criteria

The deployment is successful when:

- [x] All checklist items completed
- [x] Security tests pass
- [x] Users can upload avatars
- [x] Users can delete avatars
- [x] Avatars display correctly
- [x] No errors in logs
- [x] Performance meets targets
- [x] Documentation complete

## Next Steps After Deployment

1. **Monitor for 24 hours**
   - Check error logs
   - Monitor storage usage
   - Watch for user issues

2. **Gather feedback**
   - Ask users about experience
   - Track success/error rates
   - Identify improvements

3. **Optimize based on data**
   - Adjust compression settings
   - Tune cache settings
   - Update documentation

4. **Plan enhancements**
   - Image cropping
   - Multiple avatar sizes
   - Avatar history
   - Profile themes

## Support Contacts

| Issue | Contact |
|-------|---------|
| Supabase platform issues | Supabase Support |
| Storage quota | Upgrade plan or contact billing |
| Security concerns | Security team |
| User-reported bugs | Development team |

---

## Final Checks Before Go-Live

- [ ] All checkboxes above are checked
- [ ] Security team approval (if required)
- [ ] Stakeholder sign-off
- [ ] Rollback plan tested
- [ ] Monitoring alerts configured
- [ ] Documentation published
- [ ] Team trained on support issues

**Ready to deploy!**

Date deployed: _______________

Deployed by: _______________

Production URL: _______________

---

## Post-Launch Monitoring (First Week)

Daily checks:

- [ ] Day 1: Check error logs, verify uploads working
- [ ] Day 2: Monitor storage growth, check performance
- [ ] Day 3: Review user feedback, address issues
- [ ] Day 4: Analyze usage patterns
- [ ] Day 5: Optimize based on data
- [ ] Day 6: Review security logs
- [ ] Day 7: Full system health check

## Long-term Maintenance

Monthly tasks:

- [ ] Clean up orphaned avatars
- [ ] Review storage costs
- [ ] Check for security updates
- [ ] Analyze usage trends
- [ ] Update documentation

Quarterly tasks:

- [ ] Security audit
- [ ] Performance review
- [ ] User satisfaction survey
- [ ] Plan feature enhancements

---

**Deployment complete!** System is production-ready when all items are checked.
