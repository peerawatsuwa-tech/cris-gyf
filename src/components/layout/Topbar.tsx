import { useEffect, useState } from "react";

import {
  Bell,
  CalendarDays,
  Clock,
  Search,
  ShieldCheck,
} from "lucide-react";

export function Topbar() {

  const [now, setNow] = useState(new Date());

  useEffect(() => {

    const timer = setInterval(() => {

      setNow(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const date = now.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (

    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4">

      {/* LEFT */}

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-sky-600 p-3">

          <ShieldCheck className="h-8 w-8 text-white" />

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">

            Combat Readiness Information System

          </p>

          <h1 className="text-2xl font-bold text-white">

            ระบบประเมินความพร้อมรบ

          </h1>

          <p className="text-sm text-slate-400">

            กองเรือยามฝั่ง • Royal Thai Navy

          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">

          <Search className="h-4 w-4 text-slate-500" />

          <input
            placeholder="ค้นหาเรือ..."
            className="w-48 bg-transparent text-white outline-none placeholder:text-slate-500"
          />

        </label>

        {/* Date */}

        <div className="flex items-center gap-2">

          <CalendarDays className="h-4 w-4 text-sky-400" />

          <span className="text-sm text-slate-300">

            {date}

          </span>

        </div>

        {/* Time */}

        <div className="flex items-center gap-2">

          <Clock className="h-4 w-4 text-sky-400" />

          <span className="text-sm text-slate-300">

            {time}

          </span>

        </div>

        {/* System */}

        <div className="rounded-xl border border-emerald-700 bg-emerald-950/30 px-4 py-2">

          <div className="flex items-center gap-2">

            <ShieldCheck className="h-4 w-4 text-emerald-400" />

            <span className="text-sm font-semibold text-emerald-400">

              ONLINE

            </span>

          </div>

        </div>

        {/* Notification */}

        <div className="relative">

          <button className="rounded-xl border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800">

            <Bell className="h-5 w-5 text-white" />

          </button>

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">

            4

          </span>

        </div>

      </div>

    </header>

  );

}