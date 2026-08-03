import { useState } from "react";
import { Anchor, Eye, EyeOff, LockKeyhole, ShieldCheck, User } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

type LoginLocationState = {
  from?: { pathname?: string };
};

export default function LoginPage() {
  const { isAuthenticated, loading, login, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to={profile?.role === "ship"
          ? profile.shipId ? `/ship/${encodeURIComponent(profile.shipId)}` : "/fleet"
          : "/dashboard"}
        replace
      />
    );
  }

  const from =
    (location.state as LoginLocationState | null)?.from?.pathname ?? "/dashboard";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03101f] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(30,64,175,0.18),transparent_38%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-sky-400/25 bg-slate-950/65 shadow-2xl shadow-sky-950/60 backdrop-blur-xl">
        <div className="border-b border-sky-500/15 px-7 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-300">
            <Anchor className="h-8 w-8" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.34em] text-sky-400">
            Royal Thai Navy
          </p>
          <p className="mt-1 text-sm text-slate-400">Coast Guard Squadron</p>
          <h1 className="mt-4 text-4xl font-black tracking-[0.18em] text-white">CRIS</h1>
          <p className="mt-2 text-sm text-slate-300">
            Coast Guard Readiness Information System
          </p>
        </div>

        <form
          className="space-y-4 px-7 py-7"
          onSubmit={async (event) => {
            event.preventDefault();
            const result = await login(username, password, remember);
            if (result.ok) {
              navigate(from, { replace: true });
            } else {
              setError(result.error ?? "เข้าสู่ระบบไม่สำเร็จ");
            }
          }}
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-4 focus-within:border-sky-500">
              <User className="h-5 w-5 text-slate-500" />
              <input
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                className="min-w-0 flex-1 bg-transparent py-3.5 text-white outline-none placeholder:text-slate-600"
                placeholder="Username"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-4 focus-within:border-sky-500">
              <LockKeyhole className="h-5 w-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                className="min-w-0 flex-1 bg-transparent py-3.5 text-white outline-none placeholder:text-slate-600"
                placeholder="Password"
              />
              <button
                type="button"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                onClick={() => setShowPassword((value) => !value)}
                className="text-slate-500 hover:text-sky-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </span>
          </label>

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 accent-sky-500"
              />
              Remember Me
            </label>
            <span className="text-xs text-slate-500">Supabase Authentication</span>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-sky-950/50 transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <ShieldCheck className="h-5 w-5" />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <footer className="border-t border-slate-800 bg-slate-950/55 px-7 py-4 text-center text-xs font-semibold tracking-wider text-slate-500">
          Version v0.28 Prototype
        </footer>
      </section>
    </main>
  );
}
