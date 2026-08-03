import { supabase, supabaseConfigurationError } from "@/services/supabase";
import type { UserProfile } from "@/types/auth";

const PROTOTYPE_EMAIL_DOMAIN = "cris.local";

export function normalizeLoginIdentifier(identifier: string): string {
  const trimmed = identifier.trim().toLowerCase();
  return trimmed.includes("@") ? trimmed : `${trimmed}@${PROTOTYPE_EMAIL_DOMAIN}`;
}

export async function loadProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,role,ship_id,active")
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (!data.active) throw new Error("บัญชีนี้ถูกระงับการใช้งาน");

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    shipId: data.ship_id,
    active: data.active,
  };
}

export async function signIn(identifier: string, password: string) {
  if (supabaseConfigurationError) throw new Error(supabaseConfigurationError);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeLoginIdentifier(identifier),
    password,
  });

  if (error) throw error;
  if (!data.user || !data.session) throw new Error("ไม่พบบัญชีผู้ใช้");
  return { user: data.user, session: data.session };
}
