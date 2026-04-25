# Project Audit & Remediation Plan
**Date**: April 14, 2026
**Project**: Motor Parts Management System (GECAIN)
**Framework Target**: Next.js 15.1.0

## Critical Issues Found

### 🔴 Issue 1: Vite/Next.js Build System Conflict
**Status**: BLOCKING
- vite.config.ts exists but conflicts with Next.js app/
- package.json has Vite dependencies alongside Next.js
- Environment variables misconfigured (VITE_* vs NEXT_PUBLIC_*)
- App.tsx uses React Router (BrowserRouter) while app/ directory is Next.js

**Solution**:
- ✅ Delete vite.config.ts
- ✅ Remove Vite dependencies (already done in package.json update)
- ✅ Delete @vitejs/plugin-react, @tailwindcss/vite
- ✅ Remove src/App.tsx completely

### 🔴 Issue 2: Duplicate Routing Systems
**Status**: BLOCKING
- Pages exist in BOTH src/pages/ AND app/ directories
- React Router imports conflict with Next.js routing
- Navigation statements use both router.push() and navigate()

**Solution**:
- ✅ Delete entire src/pages/ directory
- ✅ All routing now through app/ directory only
- ✅ Use Next.js useRouter and Link exclusively

### 🔴 Issue 3: Environment Variable Inconsistency
**Status**: CRITICAL
- next.config.ts defines NEXT_PUBLIC_SUPABASE_URL
- supabase.ts tries to read VITE_SUPABASE_URL
- GEMINI_API_KEY references missing

**Solution**:
- Update src/lib/supabase.ts to use NEXT_PUBLIC_* vars
- Update .env file structure
- Verify Supabase client initialization

## Implementation Plan

### Phase 1: Fix Architecture (Today)
1. Delete vite.config.ts
2. Delete src/App.tsx  
3. Delete entire src/pages/ directory
4. Update src/lib/supabase.ts for environment vars
5. Update next.config.ts with all required env vars
6. Verify build works: `npm run build`

### Phase 2: Add Core UI Components (Next: 1-2 days)
Components to create:
- ErrorBoundary.tsx
- Toast/NotificationSystem.tsx
- Modal.tsx  
- EmptyState.tsx
- Breadcrumbs.tsx
- ErrorScreen.tsx
- LoadingSpinner.tsx (refactor duplicate code)
- ConfirmationDialog.tsx

### Phase 3: Real-time Features (Next: 2-3 days)
- Real-time product stock sync via Supabase
- Customer order status subscriptions
- Live inventory updates

### Phase 4: Data Persistence & Flow (Next: 1-2 days)
- Wishlist backed by database
- Profile update re-render fixes
- Order history persistence
- Notification preference storage

### Phase 5: Missing Pages & Features (Next: 1-2 days)
- 404 page (app/not-found.tsx)
- 500 page (app/error.tsx)
- 403 page (app/forbidden/page.tsx)
- Pagination implementation
- Mobile responsiveness

## Verification Checklist
- [ ] Build completes without errors: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [ ] Login flow works
- [ ] Customer dashboard loads
- [ ] Admin dashboard loads
- [ ] No React Router imports remain
- [ ] No vite config referenced
- [ ] Environment variables properly loaded
- [ ] All navigation uses Next.js router
- [ ] No duplicate route definitions

## Estimated Timeline
- Phase 1: 2-3 hours
- Phase 2: 4-6 hours
- Phase 3: 6-8 hours  
- Phase 4: 4-6 hours
- Phase 5: 4-6 hours
**Total**: 20-30 hours (3-4 days of focused work)
