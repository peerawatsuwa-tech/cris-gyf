import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export default function CollapsedCommandSection({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-800/60 md:px-6"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.2em] text-sky-400">{eyebrow}</p>
          <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
            <h2 className="font-black text-white">{title}</h2>
            <span className="truncate text-xs text-slate-500">{summary}</span>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-sky-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="border-t border-slate-800 p-3 md:p-4">{children}</div>}
    </section>
  );
}
