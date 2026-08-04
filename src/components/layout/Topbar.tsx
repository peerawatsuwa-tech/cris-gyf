import { useEffect, useState } from "react";

import {
  Bell,
  CalendarDays,
  Clock,
  Search,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { UI } from "@/constants/uiText";
import { useAuth } from "@/context/AuthContext";

export function Topbar() {

  const { profile } = useAuth();

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

    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/90 px-4 py-4 md:px-6">

      {/* LEFT */}

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-sky-600 p-3">

          <ShieldCheck className="h-7 w-7 text-white"/>

        </div>

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">

            {UI.organization.navy}

          </p>

          <h1 className="text-xl font-bold text-white md:text-2xl">

            {UI.organization.systemName}

          </h1>

          <p className="text-xs text-slate-400 md:text-sm">

            {UI.organization.squadron}

          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex flex-wrap items-center justify-end gap-3">

        {/* Search */}

        <label className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">

          <Search className="h-4 w-4 text-slate-500"/>

          <input
            aria-label={UI.labels.searchShip}
            placeholder={UI.labels.searchShip}
            className="w-48 bg-transparent text-white outline-none placeholder:text-slate-500"
          />

        </label>

        {/* Date */}

        <div className="hidden md:flex items-center gap-2">

          <CalendarDays className="h-4 w-4 text-sky-400"/>

          <span className="text-sm text-slate-300">

            {date}

          </span>

        </div>

        {/* Time */}

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">

          <Clock className="h-4 w-4 text-sky-400"/>

          <span className="text-sm font-medium text-white">

            {time}

          </span>

        </div>

        {/* Status */}

        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950/30 px-3 py-2">

          <ShieldCheck className="h-4 w-4 text-emerald-400"/>

          <span className="text-sm font-semibold text-emerald-400">

            {UI.labels.systemOnline}

          </span>

        </div>

        {/* Notification */}

        <div className="relative">

          <button className="rounded-xl border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800">

            <Bell className="h-5 w-5 text-white"/>

          </button>

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">

            4

          </span>

        </div>

        {/* Commander */}

        <div className="hidden lg:flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">

          <UserCircle2 className="h-7 w-7 text-sky-400"/>

          <div>

            <p className="text-xs text-slate-500">

              {profile ? UI.roles[profile.role] : UI.roles.commander}

            </p>

            <p className="text-sm font-semibold text-white">

              {UI.organization.squadron}

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}
