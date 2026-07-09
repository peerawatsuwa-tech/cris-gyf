interface ShipHeaderProps {
  name: string;
  hullNumber: string;
  status: string;
}

export function ShipHeader({ name, hullNumber, status }: ShipHeaderProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Ship Overview</p>
          <h2 className="text-2xl font-semibold text-white">{name}</h2>
          <p className="text-sm text-slate-400">Hull {hullNumber}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400">
          {status}
        </span>
      </div>
    </div>
  );
}
