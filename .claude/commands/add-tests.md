Create a file at .claude/commands/add-tests.md with the following content:

---
description: Add comprehensive tests for a feature using the test-writer subagent
argument-hint: "<feature-name>"
---

# Add Tests for Feature

Use the test-writer subagent to add comprehensive test coverage.

## Workflow

1. **Invoke test-writer**

Use the test-writer subagent to add tests for [feature name].

Include tests for:
- Happy path
- Edge cases
- Error handling
- Loading states
- Empty states

2. **Review generated tests**
   - Check test coverage
   - Verify test quality
   - Add any missing scenarios

3. **Run tests**
```bash
   npx playwright test
```

4. **Fix any failures**
   - Debug with `--headed` flag
   - Use `--debug` for step-through
   - Update code or tests as needed

5. **Verify test quality**
   - Run tests multiple times (check for flakiness)
   - Try breaking the feature (tests should catch it)
   - Check that tests are readable

## Success Criteria

- [ ] All tests pass
- [ ] Critical paths covered
- [ ] Edge cases tested
- [ ] Error scenarios handled
- [ ] Tests are readable
- [ ] No flaky tests