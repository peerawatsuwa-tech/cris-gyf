import {
  LayoutGrid,
  ShipWheel,
  BarChart3,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { UI } from "@/constants/uiText";

const navItems = [
  {
    label: UI.commandCenter,
    icon: LayoutGrid,
    href: "/",
  },
  {
    label: UI.dashboard,
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: UI.fleet,
    icon: ShipWheel,
    href: "/fleet",
  },
  {
    label: UI.assessment,
    icon: ClipboardList,
    href: "/assessment",
  },
  {
    label: UI.reports,
    icon: BarChart3,
    href: "/reports",
  },
  {
    label: UI.settings,
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">

      {/* Header */}
      <div className="border-b border-slate-800 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">
          CRIS
        </p>

        <h2 className="mt-2 text-xl font-bold leading-tight text-white">
          Combat Readiness
          <br />
          Information System
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          กองเรือยามฝั่ง
          <br />
          Coast Guard Squadron
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">

        {navItems.map((item) => {

          const Icon = item.icon;

          return (

            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-800 hover:text-white"
            >

              <Icon className="h-5 w-5 text-sky-400" />

              <span>{item.label}</span>

            </a>

          );

        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            System Version
          </p>

          <p className="mt-1 font-semibold text-white">
            CRIS Demo v0.9
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Combat Readiness Information System
          </p>

        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">

          <LogOut className="h-4 w-4" />

          ออกจากระบบ

        </button>

      </div>

    </aside>
  );
}