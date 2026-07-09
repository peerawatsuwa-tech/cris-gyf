interface MissionStatusProps {
  mission: string;
  readiness: string;
}

export function MissionStatus({ mission, readiness }: MissionStatusProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">Current Mission</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{mission}</h3>
      <p className="mt-2 text-sm text-slate-400">Readiness: {readiness}</p>
    </div>
  );
}
