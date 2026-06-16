# Recent Fixes and Improvements - June 17, 2026

## 1. Database Resilience & Connectivity
- **Real-time Status Monitoring:** Added a dynamic "Cluster Status" indicator to the Login Page that verifies backend connectivity (Supabase/Express) on mount.
- **Improved Connection Error Handling:** Enhanced login error reporting to specifically identify when the database is unreachable or paused.
- **Supabase Keep-Alive Workflow:** Implemented a new GitHub Action (`supabase-keep-alive.yml`) that pings the Supabase API daily to prevent free-tier projects from pausing due to inactivity.
- **Documentation:** Updated `GitHub-Hosting.md` with setup instructions for the keep-alive workflow.

## 2. Runbook Saving Reliability
- **Hardened Tag Synchronization:** Wrapped tag upsert and linking logic in try-catch blocks within the Supabase document service. 
- **Persistence Guarantee:** Fixed a "Syncing" hang issue where tag-related database errors would prevent the main document save from completing.
- **Safety Timeouts:** Implemented 15-second timeouts for all document save/update operations to prevent the UI from getting stuck in an indefinite "Syncing" state during connection failures.

## 3. Session Management & Deployment
- **Robust Logout:** Fixed the logout button to ensure it always clears local state and redirects to the login page, even if the Supabase `signOut` call hangs or fails due to network issues. Added a safety timeout to remote sign-out requests.
- **GitHub Pages Subfolder Fix:** Corrected the logout redirect to respect the `BASE_URL`, preventing 404 errors when hosted in subfolders (e.g., `/infraKB/`).
- **SPA Routing Support:** Implemented a `404.html` redirection hack and corresponding `index.html` logic to support direct deep-linking and page refreshes on GitHub Pages.
- **Redirect Loop Fix:** Eliminated a "flashing" login screen issue by consolidating authentication initialization and removing redundant bootstrap checks that caused race conditions between the dashboard and login page.

# Recent Fixes and Improvements - June 6, 2026

## 1. Bulk Import Improvements
- **Increased Payload Limit:** Express JSON body limit increased from 100KB to 10MB to support large markdown files.
- **Sequential Processing:** Frontend now processes bulk imports sequentially to prevent slug collision race conditions.
- **Root Import Support:** Added ability to bulk import documents directly into the root directory.
- **Progress Feedback:** Added "Bulk Sync in Progress" status indicator and detailed success/failure reports.
- **Slugify Fix:** Corrected backend usage of `slugify` library (removed incorrect `.default` calls).

## 2. Supabase Integration Fixes (GitHub Pages Deployment)
- **Data Mapping Layer:** Implemented `mapDocument`, `mapCategory`, and `mapUser` helpers to convert Supabase `snake_case` fields to frontend `camelCase`.
- **Document Persistence:** Fixed `update` logic in `docs.service.ts` to correctly handle `category_id`, `os_env`, and `status`.
- **Tag Support:** Fully implemented tag upsert and association logic for Supabase.
- **RBAC & RLS Overhaul:** 
    - Updated `handle_new_user` trigger to default to 'EDITOR' role (matching local behavior).
    - Implemented `can_edit()` and `is_admin()` SQL helpers for robust policy enforcement.
    - Added comprehensive RLS policies for all tables (`profiles`, `categories`, `documents`, `tags`, `doc_tags`, `doc_versions`, `attachments`, `activity_logs`).
    - Fixed `403 Forbidden` on document updates by allowing EDITORS to view/select DRAFT documents.
- **Reliability:** Hardened Supabase tag processing using parallel `Promise.all` and explicit `onConflict` resolution.
- **Error Handling:** Added `onError` to `DocEditPage` to prevent UI hanging on failed syncs.
- **Login Visuals:** Fixed pixelated backdrop by reducing noise opacity (20% -> 3%) and increasing image resolution/quality.
- **ID Consistency:** Improved ID vs Slug detection logic in API calls.

## 3. UI/UX Refinements
- **Clarity:** Renamed "Bulk Import Mode" in the editor to "Import from File" to distinguish it from the true Bulk Import tool in the Admin panel.
- **Safety:** Disabled import buttons while a sync is already active.
