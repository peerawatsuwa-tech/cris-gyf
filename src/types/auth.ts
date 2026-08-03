export type UserRole = "commander" | "admin" | "ship";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  shipId: string | null;
  active: boolean;
}

export function homePathFor(profile: UserProfile | null): string {
  if (profile?.role === "ship") {
    return profile.shipId ? `/ship/${encodeURIComponent(profile.shipId)}` : "/fleet";
  }

  return "/dashboard";
}
