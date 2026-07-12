import { useState } from "react";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type MainLayoutProps = {
  children: ReactNode;
};

const pageTitle: Record<string, string> = {
  "/": "ศูนย์บัญชาการ",
  "/dashboard": "ภาพรวมความพร้อมรบ",
  "/fleet": "ข้อมูลกองเรือ",
  "/assessment": "การประเมินความพร้อมรบ",
};

export function MainLayout({ children }: MainLayoutProps) {

  const location = useLocation();

  const [open, setOpen] = useState(false);

  const title =
    pageTitle[location.pathname] ??
    "Combat Readiness Information System";

  return (

    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      {/* Mobile Overlay */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          transform
          bg-slate-950
          transition-transform
          duration-300
          lg:static
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </div>

      {/* Main */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Mobile Header */}

        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 lg:hidden">

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-slate-700 p-2"
          >
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>

          <div className="text-center">

            <div className="text-sm font-bold text-white">
              CRIS
            </div>

            <div className="text-xs text-slate-400">
              Coast Guard Squadron
            </div>

          </div>

          <div className="w-9" />

        </div>

        {/* Desktop Topbar */}

        <div className="hidden lg:block">
          <Topbar />
        </div>

        {/* Page Header */}

        <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-sky-400">

                Combat Readiness Information System

              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">

                {title}

              </h2>

            </div>

            <div className="text-left md:text-right">

              <p className="text-xs uppercase tracking-widest text-slate-500">

                Version

              </p>

              <p className="font-semibold text-emerald-400">

                CRIS v1.0

              </p>

            </div>

          </div>

        </div>

        {/* Content */}

        <main className="flex-1 overflow-auto p-4 md:p-6">

          {children}

        </main>

        {/* Footer */}

        <footer className="border-t border-slate-800 bg-slate-950/70 px-6 py-4">

          <div className="flex flex-col gap-2 text-center text-sm md:flex-row md:justify-between">

            <span className="text-slate-500">

              Combat Readiness Information System (CRIS)

            </span>

            <span className="text-slate-500">

              Royal Thai Navy • Coast Guard Squadron • Version 1.0

            </span>

          </div>

        </footer>

      </div>

    </div>

  );

}