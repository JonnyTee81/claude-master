# Claude Code Setup Guide for Vibe Coding

A high-level guide to setting up Claude Code for rapid Next.js + Supabase development.

## What This Setup Does

Transforms Claude Code into a personalized development assistant that automates:
- Project scaffolding
- Design exploration with multiple UI variations
- Database schema design with Row Level Security (RLS)
- Full-stack feature development workflows
- Comprehensive test coverage
- Pre-deployment validation

## Architecture Overview

```
Your Claude Code Setup
│
├── Skills (Auto-triggered expertise)
│   ├── nextjs-supabase-app          # Next.js + Supabase patterns
│   ├── design-prototype-builder     # Design exploration & prototyping
│   └── test-everything              # Testing with Playwright
│
├── Subagents (Specialized AI assistants)
│   ├── design-explorer              # UX thinking (read-only)
│   ├── test-writer                  # Test coverage (write access)
│   └── database-architect           # Schema + RLS design
│
├── Commands (Workflow shortcuts)
│   ├── /scaffold-app                # New project setup
│   ├── /vibe-feature                # Full feature workflow
│   ├── /pre-deploy                  # Deployment checklist
│   └── /add-tests                   # Test coverage
│
└── MCP Servers (Optional integrations)
    ├── Brave Search                 # Research best practices
    └── GitHub                       # PR management
```

## Quick Start

### Phase 1: Skills (30-45 min)
Create `.claude/skills/` directory with three skills that teach Claude your patterns:

1. **nextjs-supabase-app** - Your core development patterns
   - Next.js 14+ App Router patterns
   - Supabase authentication flows
   - Database design with RLS
   - Server Actions over API routes
   - Vercel deployment best practices

2. **design-prototype-builder** - Design exploration
   - Interactive React prototypes
   - Multiple design variations
   - All UI states (empty, loading, error, success)
   - Mobile-first responsive design
   - Tailwind CSS patterns

3. **test-everything** - Testing philosophy
   - Playwright E2E tests
   - Authentication flow tests
   - CRUD operation tests
   - Test real behavior, not implementation

**Verify**: Run `/skills list` to see your skills

### Phase 2: Subagents (20-30 min)
Create `.claude/agents/` directory with three specialists:

1. **design-explorer** - Design thinking (read-only)
   - Generates 2-3 design directions
   - Considers edge cases and states
   - UX flow mapping

2. **test-writer** - Test coverage (write access)
   - Writes Playwright tests
   - Covers critical paths
   - Tests user behavior

3. **database-architect** - Schema design (write access)
   - PostgreSQL schema design
   - RLS policies for security
   - Proper indexes and relationships

**Create with**: `/agents` command in Claude Code

### Phase 3: Commands (30-45 min)
Create `.claude/commands/` directory with workflow shortcuts:

1. **scaffold-app.md** - New project setup
   - Creates Next.js + Supabase starter
   - Auth pages and protected routes
   - Initial database schema
   - Test setup

2. **vibe-feature.md** - Full feature workflow
   - Design → Plan → Database → Implement → Test → PR
   - Orchestrates subagents
   - 60-90 min for complete features

3. **pre-deploy.md** - Deployment checklist
   - Environment variables check
   - Build verification
   - RLS policy verification
   - Test suite execution
   - Security audit

4. **add-tests.md** - Test coverage helper
   - Uses test-writer subagent
   - Comprehensive test scenarios

### Phase 4: Testing (15 min)
Install Playwright:
```bash
npm init playwright@latest
```

Configure `playwright.config.ts` for your Next.js app.

### Phase 5: MCP (Optional, 10-20 min)
Add external integrations:
```bash
claude mcp add brave-search -- npx @modelcontextprotocol/server-brave-search
claude mcp add github -- npx @modelcontextprotocol/server-github
```

## Example Workflows

### New Project
```
You: /scaffold-app my-app
Claude: Creates complete starter with auth, DB, tests
Time: 10 minutes
```

### New Feature
```
You: /vibe-feature "users can create workout plans"
Claude: 
  1. design-explorer creates UI mockups
  2. Plans implementation
  3. database-architect designs schema
  4. Implements feature
  5. test-writer adds tests
  6. Creates PR
Time: 60-90 minutes for complete, tested feature
```

### Deploy
```
You: /pre-deploy
Claude: Runs checklist, identifies issues
Time: 5-10 minutes
```

## File Structure

```
your-project/
├── .claude/
│   ├── skills/
│   │   ├── nextjs-supabase-app/SKILL.md
│   │   ├── design-prototype-builder/SKILL.md
│   │   └── test-everything/SKILL.md
│   ├── agents/
│   │   ├── design-explorer.md
│   │   ├── test-writer.md
│   │   └── database-architect.md
│   └── commands/
│       ├── scaffold-app.md
│       ├── vibe-feature.md
│       ├── pre-deploy.md
│       └── add-tests.md
├── tests/
│   └── e2e/
└── [standard Next.js structure]
```

## Time Investment

| Phase | Time | Result |
|-------|------|--------|
| Skills | 30-45 min | Auto-triggered patterns |
| Subagents | 20-30 min | Specialist teammates |
| Commands | 30-45 min | Workflow automation |
| Testing | 15 min | Test infrastructure |
| **Total** | **~2-3 hours** | **Complete setup** |

## Speed Improvements

- ⚡ New project: 1 hour → 10 minutes
- ⚡ New feature: 3-4 hours → 60-90 minutes
- ⚡ Design exploration: 30 min → 5 minutes
- ⚡ Test coverage: 1 hour → 15 minutes
- ⚡ Deployment prep: 30 min → 10 minutes

## Key Concepts

**Skills**: Auto-triggered expertise. Claude reads these when tasks match their description. Like giving Claude a manual for your patterns.

**Subagents**: Isolated AI specialists with separate context windows. Prevents context pollution and enables parallel work.

**Commands**: Manual workflow triggers. You explicitly call them with `/command-name`.

**MCP**: External tool connections. Adds capabilities like web search, API access, etc.

## Resources

- [Claude Code Docs](https://code.claude.com/docs)
- [Agent Skills Guide](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Subagents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills)

## Tips

1. **Start minimal**: Just install skills from marketplace first
2. **Customize gradually**: Adjust skills as you discover your patterns
3. **Use `/skills list`**: Check what's loaded
4. **Use `/agents`**: Interactive subagent creation
5. **Use `/clear`**: Clear context often to save tokens
6. **Read skill docs**: See how Anthropic structures their official skills

## What Makes This Powerful

- **Persistent**: Knowledge persists across conversations
- **Automatic**: Skills trigger without you asking
- **Consistent**: Same patterns every time
- **Scalable**: Add new skills/agents as needs grow
- **Shareable**: Commit `.claude/` to git for team use

---

**Setup complete when:**
- ✅ `/skills list` shows your three skills
- ✅ Questions about Next.js trigger skill usage
- ✅ `/vibe-feature` command works end-to-end
- ✅ Subagents respond when invoked
- ✅ Tests run with Playwright

Time to first productive use: **30 minutes** (with defaults)  
Time to fully customized setup: **2-3 hours**
