import { Bell, CalendarDays, Clock, Search, ShieldCheck } from "lucide-react";

export function Topbar() {
  const now = new Date();

  const date = now.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">

      {/* Left */}

      <div>

        <p className="text-sm uppercase tracking-[0.25em] text-sky-400">
          Combat Readiness Information System
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          ระบบประเมินความพร้อมรบ
        </h1>

        <p className="text-sm text-slate-400">
          กองเรือยามฝั่ง (Coast Guard Squadron)
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400">

          <Search className="h-4 w-4" />

          <input
            className="w-48 border-0 bg-transparent outline-none placeholder:text-slate-500"
            placeholder="ค้นหาเรือ..."
          />

        </label>

        {/* Date */}

        <div className="flex items-center gap-2 text-slate-300">

          <CalendarDays className="h-4 w-4 text-sky-400" />

          <span className="text-sm">
            {date}
          </span>

        </div>

        {/* Time */}

        <div className="flex items-center gap-2 text-slate-300">

          <Clock className="h-4 w-4 text-sky-400" />

          <span className="text-sm">
            {time}
          </span>

        </div>

        {/* System Status */}

        <div className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950/30 px-3 py-2">

          <ShieldCheck className="h-4 w-4 text-emerald-400" />

          <span className="text-sm font-medium text-emerald-400">
            ระบบพร้อมใช้งาน
          </span>

        </div>

        {/* Notification */}

        <button className="rounded-xl border border-slate-700 bg-slate-900 p-2 transition hover:bg-slate-800">

          <Bell className="h-5 w-5 text-slate-300" />

        </button>

      </div>

    </header>
  );
}