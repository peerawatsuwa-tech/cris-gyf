# CRIS v0.28 Supabase Foundation

Apply migrations in filename order, then load `seed.sql`, then provision the
prototype users with `npm run provision:demo-users`. The service-role key and
prototype passwords must be supplied only as process environment variables.

Prototype login aliases are normalized by the frontend:

- `command` → `command@cris.local` → role `commander`
- `admin` → `admin@cris.local` → role `admin`
- `ship111` → `ship111@cris.local` → role `ship`, ship ID `ship-ต111`

The passwords from the War Room order are deployment inputs, not source code.
Disable or rotate these accounts after the demonstration.

Security boundaries are enforced in PostgreSQL:

- `commander`: all ships and overlays are selectable; no overlay mutation.
- `admin`: all ships and overlays are selectable and editable through the
  validated `patch_ship_overlay` RPC; audit logs are selectable.
- `ship`: only its assigned ship and overlay are selectable; the RPC rejects
  any other ship ID.

`ship_overlay` is included in the `supabase_realtime` publication. The frontend
subscribes to its authorized Postgres changes and refreshes the shared fleet
summary without a page reload.
