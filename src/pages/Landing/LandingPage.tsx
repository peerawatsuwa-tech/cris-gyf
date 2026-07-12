import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <div className="max-w-xl text-center">

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sky-600 shadow-2xl">

          <ShieldCheck className="h-12 w-12 text-white"/>

        </div>

        <p className="text-sm uppercase tracking-[0.5em] text-sky-400">
          ROYAL THAI NAVY
        </p>

        <h1 className="mt-4 text-5xl font-bold text-white">
          CRIS
        </h1>

        <h2 className="mt-3 text-2xl text-slate-300">
          Combat Readiness Information System
        </h2>

        <p className="mt-6 text-slate-500">
          Coast Guard Squadron
        </p>

        <p className="mt-2 text-slate-500">
          Executive Demonstration Version 1.0
        </p>

        <Link
          to="/"
          className="mt-10 inline-flex rounded-xl bg-sky-600 px-10 py-4 font-semibold text-white transition hover:bg-sky-500"
        >
          ENTER SYSTEM
        </Link>

      </div>

    </div>
  );
}