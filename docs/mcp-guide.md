# MCP (Model Context Protocol) Guide

## Overview

MCPs extend Claude Code's capabilities by enabling integration with external services and APIs. This guide documents the MCPs installed in this project and how to use them effectively.

## MCP Configuration Levels

Claude Code supports three levels of MCP configuration, each serving different use cases:

### User-Level MCPs
- **Location:** `~/.claude.json`
- **Scope:** Available across all projects on your machine
- **Use for:** Personal tools, API credentials, common utilities
- **Visibility:** Private to you, never committed to git
- **Examples:** GitHub (with your personal token), Filesystem (for your directories)

### Project-Level MCPs
- **Location:** `.mcp.json` in project root
- **Scope:** Available to all team members working on the project
- **Use for:** Project-specific integrations, shared team tools
- **Visibility:** Committed to git, shared with team
- **Examples:** Project-specific databases, team Slack workspace

### Local-Level MCPs
- **Location:** `~/.claude.json` under specific project path
- **Scope:** Only available for that specific project
- **Use for:** Project configurations you don't want to share
- **Visibility:** Private to you, never committed to git
- **Examples:** Development database credentials, personal testing tools

### Configuration Priority

When the same MCP is configured at multiple levels:
1. User-level takes precedence over project-level
2. You must approve project-level MCPs before they activate
3. Local-level is the default when adding MCPs without specifying scope

## Installed MCPs

### Project-Level MCPs

Based on `.claude/settings.local.json`, the following MCPs are currently enabled for this project:

1. **Brave Search** - Web search capabilities
2. **GitHub** - GitHub repository and workflow management
3. **Supabase** - Database and backend services integration

### User-Level MCPs

User-level MCPs are stored in `~/.claude.json` and available across all your projects.

**Recommended to add at user level:**
- **Filesystem** - Enhanced file operations across multiple projects

Check your current user-level configuration with:

```bash
# List all configured MCPs (user, project, and local)
claude mcp list

# Add Filesystem MCP at user level
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem ~/Sites ~/Documents/projects
```

### Custom MCPs

**Location:** `~/.claude/mcp-servers/`

Custom-built MCP servers tailored for the Next.js + Supabase + Vercel workflow.

#### Vercel Deployment MCP (vercel-deploy)

**Status:** ✅ Implemented and ready for testing

**Purpose:** Manage Vercel deployments directly from Claude Code without context switching.

**Installation:**
```bash
# First, build the MCP servers
cd ~/.claude/mcp-servers
npm install
npm run build

# Install Vercel MCP at user level
claude mcp add --transport stdio vercel-deploy --scope user \
  --env VERCEL_TOKEN=your_vercel_token_here \
  -- node ~/.claude/mcp-servers/dist/vercel-deploy/server.js
```

**Requirements:**
- Vercel API Token from https://vercel.com/account/tokens

**Available Tools (5):**
1. `vercel_list_deployments` - List recent deployments with filters
2. `vercel_get_deployment` - Get detailed deployment information
3. `vercel_trigger_deployment` - Trigger new deployments or redeploy
4. `vercel_get_env_vars` - List environment variables
5. `vercel_check_deployment_status` - Quick status check for latest deployment

**Example usage:**
```
"What's the status of my latest production deployment?"
"Show me all failed deployments from the last week"
"List environment variables for my-project in production"
"Redeploy the latest deployment to production"
```

**Use cases:**
- Monitor deployment status during development
- Debug failed deployments
- Quick environment variable verification
- Automated deployment status checks in workflows
- Redeploy without leaving Claude Code

#### Coming Soon

- **Supabase Management MCP** - Project health monitoring, migration management, RLS policies
- **Database Schema Diff MCP** - Schema comparison and migration generation
- **API Documentation & Testing MCP** - Next.js API route testing and OpenAPI generation
- **Environment & Secrets Management MCP** - Configuration validation and secret scanning
- **AI/LLM Monitor MCP** - OpenAI/Anthropic usage tracking and cost monitoring

For implementation details, see `~/.claude/mcp-servers/README.md`

## When to Use Each MCP

### Brave Search MCP

**Use cases:**
- Research best practices and design patterns
- Find current documentation for libraries and frameworks
- Check latest trends and version information
- Discover solutions to technical problems
- Validate architectural decisions against industry standards
- Find examples and tutorials
- Stay updated on breaking changes and deprecations

**Example scenarios:**
```
"What are the latest Next.js 14 app router patterns?"
"Find best practices for Supabase Row Level Security"
"Research accessible form validation patterns"
```

**Available via:** `WebSearch` tool

### GitHub MCP

**Use cases:**
- Create and manage pull requests
- Review and comment on PRs
- Check repository issues and discussions
- Browse repository code and file structure
- Create branches and manage commits
- Search code across repositories
- Fork repositories
- Manage issue tracking and labels
- Merge pull requests
- Check CI/CD status

**Available tools:**
- `mcp__github__create_pull_request` - Create new PRs
- `mcp__github__get_pull_request` - Get PR details
- `mcp__github__list_pull_requests` - List and filter PRs
- `mcp__github__create_pull_request_review` - Review PRs
- `mcp__github__merge_pull_request` - Merge approved PRs
- `mcp__github__get_pull_request_files` - See changed files
- `mcp__github__get_pull_request_status` - Check CI status
- `mcp__github__create_issue` - Create issues
- `mcp__github__list_issues` - List and filter issues
- `mcp__github__update_issue` - Update existing issues
- `mcp__github__add_issue_comment` - Comment on issues
- `mcp__github__search_repositories` - Find repositories
- `mcp__github__search_code` - Search code in repos
- `mcp__github__get_file_contents` - Read files from repos
- `mcp__github__create_or_update_file` - Modify repo files
- `mcp__github__push_files` - Push multiple files
- `mcp__github__create_branch` - Create new branches
- `mcp__github__fork_repository` - Fork repos

**Example scenarios:**
```
"Create a PR for the authentication feature"
"Check if there are any open issues related to form validation"
"Review the files changed in PR #42"
"Search for React component patterns in the codebase"
```

### Supabase MCP

**Use cases:**
- Database schema design and management
- Row Level Security (RLS) policy implementation
- Query optimization and debugging
- Backend API integration
- Authentication and authorization setup
- Real-time subscription configuration
- Storage bucket management

**Example scenarios:**
```
"Create a migration for the user profiles table"
"Implement RLS policies for multi-tenant data"
"Debug slow queries in the dashboard"
```

### Filesystem MCP

**Use cases:**
- Enhanced file and directory operations across multiple projects
- Advanced file searching and pattern matching
- File metadata management
- Directory traversal and monitoring
- Cross-project file access (when configured at user level)
- Bulk file operations

**Available tools:**
- `mcp__filesystem__read_file` - Read file contents
- `mcp__filesystem__write_file` - Write or update files
- `mcp__filesystem__create_directory` - Create directories
- `mcp__filesystem__list_directory` - List directory contents
- `mcp__filesystem__move_file` - Move or rename files
- `mcp__filesystem__search_files` - Search for files by pattern
- `mcp__filesystem__get_file_info` - Get file metadata

**Example scenarios:**
```
"Search for all TypeScript config files across my projects"
"Find all files modified in the last week in ~/Sites"
"Get detailed metadata for package.json files"
"List all markdown files in the docs directory"
```

**Security note:** When adding at user level, restrict access to specific directories:
```bash
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem ~/Sites ~/Documents/projects
```

## How Subagents Can Use MCPs

All specialized subagents have access to the same MCP tools:

### Explore Agent
Can use MCPs to:
- Search external repositories for patterns (`GitHub MCP`)
- Research architectural decisions (`Brave Search MCP`)
- Find similar implementations (`GitHub MCP` code search)
- Search for files across multiple projects (`Filesystem MCP`)
- Locate configuration files and patterns (`Filesystem MCP`)

### Plan Agent
Can use MCPs to:
- Research best practices before planning (`Brave Search MCP`)
- Review existing implementations in other repos (`GitHub MCP`)
- Check database schema requirements (`Supabase MCP`)
- Analyze file structures across projects (`Filesystem MCP`)
- Find similar project setups (`Filesystem MCP`)

### Test Writer Agent
Can use MCPs to:
- Find testing patterns and examples (`Brave Search MCP`, `GitHub MCP`)
- Research testing library documentation (`Brave Search MCP`)
- Locate existing test files for reference (`Filesystem MCP`)
- Search for test fixtures and utilities (`Filesystem MCP`)

### Database Architect Agent
Can use MCPs to:
- Research database design patterns (`Brave Search MCP`)
- Review RLS policy examples (`GitHub MCP`)
- Validate schema designs (`Supabase MCP`)
- Find migration files across projects (`Filesystem MCP`)
- Locate database configuration files (`Filesystem MCP`)

### Design Explorer Agent
Can use MCPs to:
- Research UI/UX trends and patterns (`Brave Search MCP`)
- Find design system examples (`GitHub MCP`)
- Review component library implementations (`GitHub MCP`)
- Search for design tokens and theme files (`Filesystem MCP`)
- Locate component examples across projects (`Filesystem MCP`)

## MCP Usage Examples in Workflows

### Example 1: Feature Development Workflow

```markdown
1. Research phase (Brave Search MCP)
   - Find best practices for the feature
   - Check latest framework documentation
   - Review security considerations

2. Planning phase (GitHub MCP)
   - Search for similar implementations
   - Review how other projects solved this
   - Check if related issues exist

3. Implementation phase
   - Use standard tools (Read, Edit, Write)

4. Review phase (GitHub MCP)
   - Create pull request
   - Add reviewers and labels
   - Link related issues
```

### Example 2: Database Design Workflow

```markdown
1. Research phase (Brave Search MCP)
   - Find RLS best practices
   - Review indexing strategies
   - Check performance patterns

2. Schema design (Supabase MCP)
   - Create migration files
   - Implement RLS policies
   - Add indexes

3. Review phase (GitHub MCP)
   - Create PR with schema changes
   - Add migration notes in PR description
   - Tag database team for review
```

### Example 3: Bug Investigation Workflow

```markdown
1. Search for similar issues (GitHub MCP)
   - Check open/closed issues
   - Search codebase for error patterns

2. Research solutions (Brave Search MCP)
   - Find documentation on the error
   - Check if it's a known framework bug
   - Look for workarounds

3. Implement fix
   - Use standard tools

4. Create PR (GitHub MCP)
   - Reference the issue number
   - Add reproduction steps
   - Link to related discussions
```

### Example 4: Pre-deployment Checklist

```markdown
1. Code quality (GitHub MCP)
   - Check all PRs are merged
   - Verify CI/CD status is green
   - Review recent commits

2. Documentation check (Brave Search MCP)
   - Verify framework version compatibility
   - Check for breaking changes
   - Review deployment best practices

3. Deploy
   - Run deployment scripts
```

### Example 5: Cross-Project Pattern Analysis

```markdown
1. Find pattern usage (Filesystem MCP)
   - Search all projects for authentication patterns
   - Locate all instances of a specific component
   - Identify common configuration patterns

2. Research best implementation (Brave Search MCP + GitHub MCP)
   - Find current best practices
   - Review reference implementations
   - Check for security considerations

3. Standardize across projects (Filesystem MCP)
   - Update files in multiple projects
   - Create consistent configuration
   - Document the standard pattern
```

### Example 6: Complete Deployment Workflow (with Vercel MCP)

```markdown
1. Pre-deployment verification
   - Check deployment status (Vercel MCP)
     "What's the current status of my production deployment?"
   - Verify environment variables (Vercel MCP)
     "List all production environment variables for my-app"
   - Review recent commits (GitHub MCP)
     "Show commits since last deployment"

2. Deploy
   - Trigger deployment (Vercel MCP)
     "Trigger a new production deployment from main branch"
   - Monitor build progress (Vercel MCP)
     "Check the status of the latest deployment"

3. Post-deployment verification
   - Check deployment health (Vercel MCP)
     "Get detailed information about the latest deployment"
   - Verify deployment succeeded (Vercel MCP)
     "Show me the deployment URL and status"
   - Monitor for errors (Vercel MCP)
     "List any failed deployments from the last hour"

4. Rollback if needed
   - Identify previous good deployment (Vercel MCP)
     "List the last 5 production deployments"
   - Redeploy previous version (Vercel MCP)
     "Redeploy deployment dpl_abc123xyz"
```

This workflow demonstrates how the Vercel MCP eliminates context switching during deployments, keeping you in the development flow.

## Adding New MCPs

Claude Code provides CLI commands to easily add and manage MCP servers. Choose the appropriate scope based on your needs.

### Adding User-Level MCPs (Recommended for Personal Tools)

User-level MCPs are available across all your projects:

```bash
# Add an MCP at user scope
claude mcp add --transport stdio <server-name> --scope user -- <command>

# Example: Add Filesystem MCP for enhanced file operations
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem

# Example: Add Filesystem with directory restrictions (recommended)
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem ~/Sites ~/Documents/projects

# Example: Add PostgreSQL MCP
claude mcp add --transport stdio postgres --scope user -- npx -y @modelcontextprotocol/server-postgres --env DB_URL=postgresql://localhost/mydb
```

**Note for Windows users:** Wrap `npx` commands with `cmd /c`:
```bash
claude mcp add --transport stdio filesystem --scope user -- cmd /c npx -y @modelcontextprotocol/server-filesystem
```

### Adding Project-Level MCPs (For Team-Shared Tools)

Project-level MCPs are committed to `.mcp.json` and shared with your team:

```bash
# Add an MCP at project scope
claude mcp add --transport stdio <server-name> --scope project -- <command>

# Example: Add project-specific Supabase MCP
claude mcp add --transport stdio supabase --scope project -- npx -y @supabase/mcp-server --env SUPABASE_URL=https://yourproject.supabase.co
```

### Adding Local-Level MCPs (Default)

Local-level MCPs are private to you for the current project:

```bash
# Add an MCP at local scope (default, --scope not needed)
claude mcp add --transport stdio <server-name> -- <command>
```

### Adding HTTP-Based MCPs

Some MCPs run as HTTP services:

```bash
# Add HTTP-based MCP
claude mcp add --transport http <server-name> <server-url> --scope user

# Example: Add a custom API MCP
claude mcp add --transport http custom-api https://api.example.com/mcp --scope user
```

### Verifying Installation

After adding an MCP, verify it's configured correctly:

```bash
# List all configured MCPs
claude mcp list

# Get details about a specific MCP
claude mcp get filesystem

# Within Claude Code, check active servers
/mcp
```

New MCP tools will be prefixed with `mcp__servername__` (e.g., `mcp__filesystem__search_files`).

### Recommended MCPs by Use Case

#### Development Tools (User-Level)
- **Filesystem** - Enhanced file operations and directory management
  ```bash
  claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem
  ```

#### Databases (User or Project-Level)
- **PostgreSQL** - Direct database access and queries
  ```bash
  claude mcp add --transport stdio postgres --scope user -- npx -y @modelcontextprotocol/server-postgres
  ```
- **Supabase** - Supabase-specific database operations (project-level for teams)

#### Project Management (User-Level)
- **GitHub** - Repository and workflow management
- **Linear** - Issue tracking and project management
- **Slack** - Team communication and notifications

#### External Services (User-Level)
- **Stripe** - Payment processing integration
- **SendGrid** - Email service operations
- **Google Drive** - Document management
- **Notion** - Knowledge base integration

### When to Use Each Scope

| Scope | Use When | Examples |
|-------|----------|----------|
| **User** | Personal tools, cross-project utilities, API keys | Filesystem, GitHub (personal token), PostgreSQL |
| **Project** | Team-shared integrations, project-specific services | Project Supabase instance, team Slack workspace |
| **Local** | Development credentials, temporary testing | Test databases, experimental MCPs |

## Managing MCPs

### Listing Configured MCPs

```bash
# List all MCPs across all scopes
claude mcp list

# View details of a specific MCP
claude mcp get <server-name>

# Example
claude mcp get filesystem
```

### Removing MCPs

```bash
# Remove an MCP (automatically detects scope)
claude mcp remove <server-name>

# Examples
claude mcp remove filesystem
claude mcp remove postgres
```

This removes the MCP from your configuration at the appropriate scope level.

### Resetting Project MCP Approvals

If you've previously declined a project-level MCP and want to reconsider:

```bash
# Reset your approval choices for project MCPs
claude mcp reset-project-choices
```

This allows you to re-approve or decline project MCPs that the team has configured.

### Updating MCP Configuration

To update an MCP's configuration:

1. Remove the existing MCP:
   ```bash
   claude mcp remove <server-name>
   ```

2. Re-add it with new configuration:
   ```bash
   claude mcp add --transport stdio <server-name> --scope user -- <new-command>
   ```

### Managing Environment Variables

MCPs often need environment variables for authentication or configuration:

```bash
# Add MCP with environment variables
claude mcp add --transport stdio <server-name> --scope user --env KEY=value -- <command>

# Example: PostgreSQL with connection string
claude mcp add --transport stdio postgres --scope user --env DATABASE_URL=postgresql://localhost/mydb -- npx -y @modelcontextprotocol/server-postgres

# Example: Multiple environment variables
claude mcp add --transport stdio api-service --scope user --env API_KEY=xxx --env API_URL=https://api.example.com -- node server.js
```

### Checking MCP Status Within Claude Code

Inside a Claude Code conversation:

```bash
# List active MCPs in the current session
/mcp

# This shows which MCPs are loaded and available
```

### Configuration File Locations

If you need to manually edit configurations:

- **User-level:** `~/.claude.json`
- **Project-level:** `.mcp.json` (in project root)
- **Local-level:** `~/.claude.json` (under project-specific path)

**Note:** Using the CLI commands is preferred over manual editing to avoid syntax errors.

## Best Practices

### 1. Choose the Right Scope

**User-level for:**
- Personal authentication tokens (GitHub, APIs)
- Tools you use across all projects (Filesystem, PostgreSQL)
- Development utilities (linters, formatters)

**Project-level for:**
- Project-specific services (project database, Supabase instance)
- Team-shared integrations (team Slack, Linear workspace)
- Tools that should be consistent across the team

**Local-level for:**
- Testing and experimentation
- Personal development configurations
- Temporary integrations

### 2. Restrict Filesystem Access

When adding Filesystem MCP at user level, always specify allowed directories:

```bash
# Good - restricted access
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem ~/Sites ~/Documents/work

# Avoid - unrestricted access to entire filesystem
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem
```

### 3. Use MCPs for External Data

MCPs should handle external service interactions. Use standard tools (Read, Edit, Write) for local file operations in the current project.

### 4. Chain MCPs with Standard Tools

```markdown
1. Research with Brave Search MCP → Get best practices
2. Find examples with GitHub MCP → See implementations
3. Implement with Edit/Write → Apply learnings
4. Create PR with GitHub MCP → Share changes
```

### 5. Let Subagents Use MCPs

Don't manually gather information if a subagent can use MCPs to do research autonomously. Trust them to leverage MCPs effectively.

### 6. Combine MCPs

Use multiple MCPs together:
- Search GitHub for examples (GitHub MCP)
- Research the pattern (Brave Search MCP)
- Implement in your database (Supabase MCP)
- Find similar patterns in other projects (Filesystem MCP)

### 7. Document MCP Usage

When using MCPs in workflows, document which MCPs were used and why. This helps team members understand the research behind decisions.

### 8. Manage Credentials Securely

- Never commit credentials to git (use user or local scope)
- Use environment variables for sensitive data
- Keep API keys in user-level MCPs only
- Use project-level MCPs with team-shared, non-sensitive configs

## Troubleshooting

### MCP Tools Not Available

1. **Check if MCP is configured:**
   ```bash
   claude mcp list
   ```

2. **Verify the MCP server is installed:**
   - For npx-based servers: Ensure Node.js is installed
   - Check network connectivity for HTTP-based servers

3. **Check configuration scope:**
   - User-level: Check `~/.claude.json`
   - Project-level: Check `.mcp.json` (may need approval)
   - Use `/mcp` command within Claude Code to see active servers

4. **Restart Claude Code after configuration changes**

5. **Check MCP server logs if available**

### Project MCP Not Loading

If a project-level MCP isn't loading:

1. **Check if you need to approve it:**
   - Project MCPs require user approval on first use
   - You'll be prompted to approve when starting Claude Code

2. **Reset approval choices:**
   ```bash
   claude mcp reset-project-choices
   ```

3. **Verify `.mcp.json` exists in project root**

### Permission Errors

Some MCPs require authentication:

1. **Environment variables:**
   - Check required variables are set (e.g., `GITHUB_TOKEN`, `DATABASE_URL`)
   - Use `--env` flag when adding MCP:
     ```bash
     claude mcp add --transport stdio github --scope user --env GITHUB_TOKEN=xxx -- npx @github/mcp-server
     ```

2. **API keys and OAuth:**
   - Verify API keys are valid
   - Complete OAuth flows if required
   - Check key permissions/scopes

3. **File system permissions:**
   - Filesystem MCP requires read/write access to specified directories
   - Verify directory paths exist and are accessible

### Scope Conflicts

If an MCP isn't behaving as expected:

1. **Check for duplicate configurations:**
   ```bash
   claude mcp list
   ```
   User-level takes precedence over project-level

2. **Remove conflicting configurations:**
   ```bash
   claude mcp remove <server-name>
   ```

3. **Re-add at the correct scope:**
   ```bash
   claude mcp add --transport stdio <server-name> --scope user -- <command>
   ```

### Rate Limiting

MCPs often have rate limits:
- **GitHub**: 5,000 requests/hour (authenticated), 60/hour (unauthenticated)
- **Brave Search**: Varies by plan
- **Filesystem**: No rate limits, but may have performance limits

**Best practices:**
- Cache results when possible
- Batch operations when available
- Use authenticated requests for higher limits

### Windows-Specific Issues

If MCPs fail to start on Windows:

1. **Wrap npx commands with `cmd /c`:**
   ```bash
   claude mcp add --transport stdio filesystem --scope user -- cmd /c npx -y @modelcontextprotocol/server-filesystem
   ```

2. **Use forward slashes in paths:**
   ```bash
   C:/Users/YourName/Projects
   ```

3. **Check Node.js is in PATH**

## Configuration Reference

### Configuration Files Overview

| File | Scope | Location | Shared via Git | Purpose |
|------|-------|----------|----------------|---------|
| `~/.claude.json` | User & Local | Home directory | No | User-level and local MCPs |
| `.mcp.json` | Project | Project root | Yes | Team-shared project MCPs |
| `.claude/settings.local.json` | Project | Project `.claude/` | No | Project settings (legacy) |

### Project Configuration (`.claude/settings.local.json`)

Current project configuration:

```json
{
  "enabledMcpjsonServers": [
    "brave-search",
    "github",
    "supabase"
  ],
  "enableAllProjectMcpServers": true,
  "permissions": {
    "allow": [
      "mcp__github__search_repositories",
      // ... other permissions
    ]
  }
}
```

### User-Level Configuration (`~/.claude.json`)

Example user-level configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Sites", "/Users/you/Documents"]
      }
    },
    "postgres": {
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres"]
      },
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    }
  }
}
```

**Note:** Use `claude mcp add` commands instead of manual editing.

### Project-Level Configuration (`.mcp.json`)

Example project-level configuration (shared with team):

```json
{
  "mcpServers": {
    "supabase": {
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@supabase/mcp-server"]
      },
      "env": {
        "SUPABASE_URL": "https://yourproject.supabase.co"
      }
    }
  }
}
```

This file should be committed to git so team members get the same MCP configuration.

### Permission System

Some MCP tools require explicit permission grants in `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__github__search_repositories",
      "mcp__github__*",              // All GitHub MCP tools
      "mcp__filesystem__*",           // All Filesystem MCP tools
      "WebSearch"                     // Web search capability
    ]
  }
}
```

**Permission patterns:**
- Specific tools: `mcp__github__search_repositories`
- Tool families: `mcp__github__*` (all GitHub tools)
- Built-in features: `WebSearch`, `Bash(ls:*)`, etc.

**Note:** Restart Claude Code after permission changes.

### Environment Variables in MCPs

MCPs can use environment variables for configuration:

```json
{
  "mcpServers": {
    "github": {
      "transport": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@github/mcp-server"]
      },
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "GITHUB_API_URL": "https://api.github.com"
      }
    }
  }
}
```

Or via CLI:
```bash
claude mcp add --transport stdio github --scope user --env GITHUB_TOKEN=xxx --env GITHUB_API_URL=https://api.github.com -- npx @github/mcp-server
```

### Checking Active Configuration

View your current MCP configuration:

```bash
# List all configured MCPs
claude mcp list

# View specific MCP details
claude mcp get filesystem

# Check active MCPs in Claude Code
# (within a conversation)
/mcp
```

## Additional Resources

- [MCP Official Documentation](https://modelcontextprotocol.io)
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Building Custom MCPs](https://modelcontextprotocol.io/docs/building)
- Claude Code Skill: `/document-skills:mcp-builder` - Guide for creating custom MCPs

## Summary

MCPs transform Claude Code into a connected development environment with three configuration levels:

### Configuration Levels
- **User-level:** Personal tools available across all projects (Filesystem, GitHub with your token)
- **Project-level:** Team-shared integrations committed to git (project Supabase instance)
- **Local-level:** Private project configurations never committed to git (dev credentials)

### Installed MCPs

**Project-Level:**
- **Brave Search** - Keeps you informed with current information and best practices
- **GitHub** - Integrates your workflow with version control and repository management
- **Supabase** - Streamlines database operations and schema management

**User-Level (Recommended):**
- **Filesystem** - Enhanced file operations across multiple projects

**Custom MCPs (User-Level):**
- **Vercel Deployment** - Monitor and manage Vercel deployments, check status, manage env vars

### Quick Start Commands

```bash
# Add Filesystem MCP for enhanced file operations
claude mcp add --transport stdio filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem ~/Sites ~/Documents/projects

# Install custom Vercel MCP
cd ~/.claude/mcp-servers
npm install && npm run build
claude mcp add --transport stdio vercel-deploy --scope user \
  --env VERCEL_TOKEN=your_token \
  -- node ~/.claude/mcp-servers/dist/vercel-deploy/server.js

# List all configured MCPs
claude mcp list

# Check active MCPs in Claude Code
/mcp
```

### Best Practices Summary
1. Choose the right scope (user for personal tools, project for team tools)
2. Restrict Filesystem access to specific directories
3. Use MCPs for external services, standard tools for local files
4. Let subagents leverage MCPs autonomously
5. Combine multiple MCPs for powerful workflows
6. Document MCP usage in your workflows
7. Manage credentials securely (never commit to git)

Use MCPs strategically to enhance workflows, let subagents leverage them for autonomous research, and combine them with standard tools for powerful development experiences.
