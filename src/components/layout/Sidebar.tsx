import {
  ShipWheel,
  BarChart3,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { UI } from "@/constants/uiText";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    label: UI.navigation.dashboard,
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: UI.navigation.fleet,
    icon: ShipWheel,
    href: "/fleet",
  },
  {
    label: UI.navigation.assessment,
    icon: ClipboardList,
    href: "/assessment",
  },
];

export function Sidebar() {
  const { logout, profile } = useAuth();
  const visibleNavItems = profile?.role === "ship"
    ? [{
        label: profile.shipId ? profile.shipId.replace("ship-", "เรือ ") : UI.navigation.shipEdit,
        icon: ShipWheel,
        href: profile.shipId ? `/ship/${encodeURIComponent(profile.shipId)}` : "/fleet",
      }]
    : navItems;
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">

      {/* Header */}

      <div className="border-b border-slate-800 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">

          {UI.organization.navy}

        </p>

        <h2 className="mt-2 text-xl font-bold leading-tight text-white">

          {UI.organization.systemName}

        </h2>

        <p className="mt-3 text-sm text-slate-400">

          {UI.organization.squadron}

          <br />

          CRIS v0.28

        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {visibleNavItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-sky-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `
              }
            >

              <Icon className="h-5 w-5" />

              <span>{item.label}</span>

            </NavLink>

          );

        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

          <p className="text-xs uppercase tracking-widest text-slate-500">

            {UI.labels.system}

          </p>

          <p className="mt-1 text-lg font-bold text-emerald-400">

            CRIS v0.28

          </p>

          <p className="mt-2 text-xs text-slate-500">

            {UI.labels.officialDemo}

          </p>

        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-900/30 hover:text-red-300"
        >

          <LogOut className="h-4 w-4" />

          {UI.auth.logout}

        </button>

      </div>

    </aside>
  );
}
