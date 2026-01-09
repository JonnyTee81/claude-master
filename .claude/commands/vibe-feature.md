---
description: Full-stack feature development workflow - design, plan, database, implement, test, PR
argument-hint: "<feature description>"
---

# Vibe Feature Development

Build a complete feature from design exploration to tested implementation.

## Phase 1: Design Exploration (5-10 minutes)

**Use design-explorer subagent for this phase**

1. Invoke design-explorer: "Use the design-explorer subagent to explore designs for [feature]"
2. Review design options provided
3. Select preferred direction
4. Note any UX concerns raised

## Phase 2: Planning (5 minutes)

**Enter plan mode: Shift+Tab twice**

1. Research codebase for similar patterns
2. Identify files that need changes
3. Create implementation plan
4. Save plan to `docs/plans/[feature-name]-plan.md`

## Phase 3: Database Design (10 minutes)

**Use database-architect subagent if database changes needed**

If feature requires database changes:
1. Invoke database-architect: "Use the database-architect subagent to design schema for [feature]"
2. Review proposed schema
3. Verify RLS policies
4. Check indexes
5. Create migration file
6. Test RLS in Supabase dashboard

## Phase 4: Implementation (30-60 minutes)

**Exit plan mode: Shift+Tab twice**

1. Create/update components
2. Implement Server Actions if needed
3. Add proper TypeScript types
4. Implement error handling
5. Add loading states
6. Test manually in browser

## Phase 5: Testing (15-20 minutes)

**Use test-writer subagent**

1. Invoke test-writer: "Use the test-writer subagent to add tests for [feature]"
2. Review tests generated
3. Run tests: `npm run test:e2e`
4. Fix any failures
5. Add additional edge case tests if needed

## Phase 6: Documentation & PR (5 minutes)

1. Update relevant documentation:
   - README if needed
   - CLAUDE.md if new patterns
   - JSDoc comments on functions

2. Create git commit:
```bash
   git add .
   git commit -m "feat: add [feature description]
   
   - Implemented [x]
   - Added tests for [y]
   - Updated docs for [z]"
```

3. Create PR:
```bash
   git push origin HEAD
   # Create PR in GitHub UI
```

## Success Criteria

Before marking complete, verify:
- [ ] Feature works as designed
- [ ] All states handled (loading, error, empty, success)
- [ ] RLS policies tested (if database changes)
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation works)
- [ ] Documentation updated
- [ ] Clean git history

## Time Budget

- Design: 5-10 min
- Planning: 5 min
- Database: 10 min (if needed)
- Implementation: 30-60 min
- Testing: 15-20 min
- Documentation: 5 min
- **Total: ~60-90 minutes for complete feature**

Remember: Use subagents liberally - they keep your main context clean!