# SNAPSHOT - October 1, 2025 - Before Claude Code Edits

## Project State
- **Date**: Wednesday, October 01, 2025
- **Chat Session**: Starting autonomous code editing
- **Polygon API Trial**: Day 26/30 (expires Oct 3, 2025)

## Current Stack
- Next.js 14.2.25
- Clerk for auth (NOT Supabase)
- Stripe configured (env vars set, not tested)
- Polygon.io API key: geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp

## Known Issues (User Reported)
1. Opportunities & Watchlist showing "0 found"
2. ROI sorting backwards
3. Chart popout modal scrolling issues
4. Screener returns no results
5. Settings panel broken

## What Works
- Authentication flow
- Basic dashboard layout
- UI looks professional

## Git Status
Check current commit: `git log -1 --oneline`

## Rollback Command
If things break: `git reset --hard HEAD`

## Files to Watch
- src/components/dashboard/ProfessionalTerminal.tsx
- src/components/dashboard/ChartPopout.tsx
- src/lib/opportunitiesService.ts
- src/app/api/screener/route.ts

## Created Artifacts This Session
- launch_survival_guide (markdown)
- critical_fixes_today (bash script - NOT EXECUTED)
- saas_admin_dashboard (React component - REFERENCE ONLY)
- supabase_admin_queries (SQL - NOT USED, we use Clerk)
- landing_page_revamp (React component - NOT APPLIED)

**IMPORTANT**: All artifacts are references only. Nothing has been applied to codebase yet.
