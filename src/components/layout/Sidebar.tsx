import {
LayoutGrid,
ShipWheel,
BarChart3,
Settings,
LogOut,
ClipboardList,
} from "lucide-react";

const navItems = [
  {
    label: "Command Center",
    icon: LayoutGrid,
    href: "/",
  },

  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },

  {
    label: "Fleet",
    icon: ShipWheel,
    href: "/fleet",
  },

  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
  label: "Assessment",
  icon: ClipboardList,
  href: "/assessment",
},
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950/90 p-6 text-slate-200">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          CRIS GYF
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Fleet Console</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-800 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          )
        })}
      </nav>

      <button className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white">
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}
