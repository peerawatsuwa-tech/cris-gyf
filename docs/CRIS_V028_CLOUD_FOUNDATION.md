# CRIS v0.28 Cloud Data Foundation

## Architecture

Supabase Auth establishes the session. The authenticated user ID resolves to a
row in `public.users`, which supplies the CRIS role and optional ship assignment.
The browser then queries `ships` and `ship_overlay`; PostgreSQL RLS limits the
rows before they leave Supabase. Dashboard, Fleet, Assessment, and Ship Detail
continue to consume the existing `Ship` domain model.

Editable readiness fields are written through `patch_ship_overlay`. This RPC
validates the caller role, ship assignment, and allowed fields, then performs a
field-level merge. A database trigger writes one `audit_logs` row per changed
field. Supabase Realtime publishes authorized `ship_overlay` changes and every
connected client reloads its permitted fleet view.

## Authentication Flow

1. Login accepts an email or a prototype alias such as `admin`.
2. Aliases normalize to `<alias>@cris.local`.
3. `signInWithPassword` authenticates with Supabase Auth.
4. `public.users` supplies `role`, `ship_id`, and `active`.
5. Inactive or missing profiles are signed out.
6. Supabase refreshes tokens automatically.
7. Remember Me stores the Supabase session in IndexedDB; an unremembered session
   uses `sessionStorage`. Fleet/readiness data is never stored in browser storage.
8. Logout invalidates the Supabase session and clears the client fleet state.

## Role Matrix

| Capability | commander | admin | ship |
| --- | --- | --- | --- |
| Dashboard | Allow | Allow | Deny |
| Fleet Summary | Allow | Allow | Deny |
| Assessment Summary | Allow | Allow | Deny |
| Ship Detail | All, read-only | All | Assigned ship only |
| Edit readiness | Deny | All ships | Assigned ship only |
| Read audit logs | Deny | Allow | Deny |
| Storage `cris-imports` | Deny | Allow | Deny |
| User provisioning | Deny | Server-side service role only | Deny |

User Management is intentionally server-side because exposing a Supabase
service-role key in the frontend would bypass RLS. No new UI route was added in
this sprint, consistent with the requirement to preserve the v0.27.2 UI.

## Database Objects

- `users`: Auth profile, `commander | admin | ship`, assignment, active flag.
- `ships`: the existing 40-ship domain objects as JSONB plus indexed identity.
- `ship_overlay`: only the editable readiness fields.
- `audit_logs`: actor, ship, field, before, after, and timestamp.
- `patch_ship_overlay(text, jsonb)`: the only browser mutation boundary.
- `cris-imports`: private Supabase Storage bucket restricted to admin.

## Configuration and Deployment

1. Create a Supabase project.
2. Apply `supabase/migrations/202608030001_cloud_data_foundation.sql`.
3. Apply `supabase/seed.sql` and confirm 40 rows in `public.ships`.
4. Set the server-only environment variables in `.env.example`, then run
   `npm run provision:demo-users`. Do not commit the resulting `.env` file.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the frontend hosting
   environment. Never use `SUPABASE_SERVICE_ROLE_KEY` in a `VITE_*` variable.
6. Build and deploy the exact tested commit.

The War Room passwords are supplied to the provisioning process at deployment
time and are deliberately absent from source control.

## Security Notes

- RLS is enabled on every exposed application table.
- A ship user cannot select another ship or overlay; the RPC repeats the same
  assignment check to protect mutations.
- Commander mutation is rejected in both UI and PostgreSQL.
- Direct table mutation grants are revoked; authenticated writes use the RPC.
- Audit insertion runs in a trigger and cannot be forged through the client API.
- The service-role key is server-only and ignored by Git environment rules.
- Realtime authorization follows the table RLS policies.

## External Verification Gate

Role browser testing, live Realtime verification, audit inspection, default
account creation, and production deployment require an actual Supabase project
URL, publishable/anon key, and a server-side service-role key. These values are
not present in the repository and must be supplied through the deployment secret
store before the external verification gate can pass.
