interface ShipSummaryProps {
  shipClass: string;
  fleet: string;
  cRating: string;
}

export function ShipSummary({ shipClass, fleet, cRating }: ShipSummaryProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">Ship Summary</p>
      <div className="mt-3 space-y-2 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <span>Class</span>
          <span>{shipClass}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Fleet</span>
          <span>{fleet}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>C-Rating</span>
          <span>{cRating}</span>
        </div>
      </div>
    </div>
  );
}
