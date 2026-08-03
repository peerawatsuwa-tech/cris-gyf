import { createClient } from "@supabase/supabase-js";

const required = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRIS_COMMANDER_PASSWORD",
  "CRIS_ADMIN_PASSWORD",
  "CRIS_SHIP111_PASSWORD",
];

for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const accounts = [
  {
    email: "command@cris.local",
    password: process.env.CRIS_COMMANDER_PASSWORD,
    role: "commander",
    ship_id: null,
  },
  {
    email: "admin@cris.local",
    password: process.env.CRIS_ADMIN_PASSWORD,
    role: "admin",
    ship_id: null,
  },
  {
    email: "ship111@cris.local",
    password: process.env.CRIS_SHIP111_PASSWORD,
    role: "ship",
    ship_id: "ship-ต111",
  },
];

const { data: existing, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) throw listError;

for (const account of accounts) {
  let user = existing.users.find((candidate) => candidate.email === account.email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: account.password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
  }

  const { error: profileError } = await supabase.from("users").upsert({
    id: user.id,
    email: account.email,
    role: account.role,
    ship_id: account.ship_id,
    active: true,
  });
  if (profileError) throw profileError;

  console.log(`Provisioned ${account.email} as ${account.role}`);
}
