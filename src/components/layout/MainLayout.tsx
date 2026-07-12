import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useLocation } from "react-router-dom";

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

  const title =
    pageTitle[location.pathname] ?? "Combat Readiness Information System";

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar />

        {/* Breadcrumb */}

        <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-3">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                CRIS
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                {title}
              </h2>

            </div>

            <div className="text-right">

              <p className="text-xs text-slate-500">
                เวอร์ชัน
              </p>

              <p className="font-semibold text-sky-400">
                Demo v0.9
              </p>

            </div>

          </div>

        </div>

        <main className="flex-1 overflow-auto p-6">

          {children}

        </main>

        {/* Footer */}

        <footer className="border-t border-slate-800 bg-slate-950/60 px-6 py-4">

          <div className="flex items-center justify-between text-sm">

            <span className="text-slate-500">
              Combat Readiness Information System
            </span>

            <span className="text-slate-500">
              Royal Thai Navy • Coast Guard Squadron
            </span>

          </div>

        </footer>

      </div>

    </div>
  );
}