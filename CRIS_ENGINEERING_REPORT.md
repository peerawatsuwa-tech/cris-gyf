# CRIS Engineering Report

## Critical Hotfix 007 — CRIS v0.27.1

### Defects and Root Cause

- Persistence: the previous `useEffect` writer ran after rendering, leaving a race
  window in which an immediate refresh or browser close could occur before the
  overlay reached Local Storage.
- Mission scope: Command Center retained a separate legacy presentation pipeline
  instead of sharing the approved three-mission fleet summary.

### Repair

- Local Storage key remains `cris-v027-readiness-overlay-v1`.
- Overlay schema remains version `1` and dataset remains
  `fleet-2026-07-20-v1`; no reset or migration was introduced.
- Each ship edit now writes the complete next overlay synchronously before the
  visible state is updated.
- Loading validates schema and dataset identity, filters records by stable ship
  IDs from the Excel-derived base fleet, then overlays matching edits.
- Ship Detail reports visible save success or failure.
- Command Center now renders the same Dashboard summary, calculation path, and
  approved mission constants.

### Verification

- Two ships edited across all supported fields: PASS
- Navigate away/return and refresh persistence: PASS
- Logout/login persistence: PASS
- New browser tab then login persistence: PASS
- Dashboard immediate update: PASS (`Y 1`, `N 1`, pending `38`)
- Dashboard, Mission, Command Center, Ship Detail, and Fleet modal mission scope:
  PASS (exactly three approved missions)
- Responsive 1920 / 1440 / 1280: PASS; no horizontal overflow
- Browser console errors: 0
- TypeScript and Vite build: PASS
- Lint: PASS with existing Fast Refresh warnings
- `src/engine` changes: NONE

## Repository Synchronization

- Repository: `/Users/opekungmaco/Documents/GitHub/cris-gyf`
- Branch: `feature/fleet-40`
- Approved workspace: `/Users/opekungmaco/Documents/Codex/2026-07-27/referenced-chatgpt-conversation-this-is-untrusted-2/work/cris-v027-final`
- Backup: `/Users/opekungmaco/Documents/GitHub/CRIS-v0.27-before-sync-backup`
- Package: `cris-gyf@0.0.0`

## Included

- Login, Logout, Remember Me, and route protection
- Excel-derived fleet dataset containing 40 unique ships
- Versioned Local Storage readiness overlay
- Commander Summary, Fleet, Ship Detail, and three approved missions
- Y/Q/N readiness gate and “รอการประเมิน” state
- Responsive layout at 1920, 1440, and 1280 pixels

## Verification

- TypeScript: PASS
- Vite build: PASS
- Lint: PASS
- Browser flow: PASS
- Console errors: 0
- Runtime errors: 0
- Horizontal overflow: 0
- `src/engine` changed by synchronization: NO

## Packaging Policy

Source and build packages exclude `.git`, `node_modules`, local environment files,
secrets, build caches, temporary files, OS metadata, and unrelated pre-existing
archives. The supplied Excel workbook is not included because redistribution was
not explicitly authorized.
