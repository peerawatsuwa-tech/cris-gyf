# Changelog

## CRIS v0.27.2 — Mission Order 008 — 2026-08-02

- Consolidated the duplicate Command Center and Dashboard navigation into one Dashboard executive view.
- Made `/` and the legacy `/command-center` bookmark redirect to `/dashboard` behind route protection.
- Removed Command Center from the Sidebar and standardized the remaining executive navigation label as `Dashboard`.
- Kept the existing Dashboard data, readiness summary, three missions, fleet dataset, and persistence behavior unchanged.
- Verified login/logout, editing, refresh persistence, route redirects, and responsive layouts without changing `src/engine`.

## CRIS v0.27.1 — Critical Hotfix 007 — 2026-07-27

- Made readiness overlay writes synchronous before React state updates, closing the refresh/close race window.
- Kept the existing `cris-v027-readiness-overlay-v1` key, schema version, dataset identity, and stable ship-ID merge behavior.
- Added visible save success/failure feedback to Ship Detail without changing the edit workflow.
- Routed Command Center through the same approved fleet summary and three-mission dataset used by Dashboard.
- Verified persistence across navigation, refresh, logout/login, and a new browser tab.
- Verified the three-mission scope and responsive layouts without changing `src/engine`.

## CRIS v0.27 — 2026-07-27

- Added mock authentication with Login, Logout, Remember Me, and protected routes.
- Replaced the mock fleet dataset with the reviewed 40-ship Excel-derived dataset.
- Added a versioned Local Storage readiness overlay keyed by stable ship IDs.
- Limited mission readiness to Patrol, Search/Inspection, and Search and Rescue.
- Added the approved Y/Q/N calculation gate with a separate pending-assessment state.
- Added Commander Summary and streamlined Dashboard, Fleet, and Ship Detail views.
- Standardized unknown readiness wording as “รอการประเมิน”.
- Verified responsive layouts at 1920, 1440, and 1280 pixels.
