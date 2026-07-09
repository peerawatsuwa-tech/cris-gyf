interface ReadinessGaugeProps {
  score: number;
}

export function ReadinessGauge({ score }: ReadinessGaugeProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">Readiness</p>
      <div className="mt-3 flex items-end gap-3">
        <div className="text-4xl font-semibold text-white">{score}</div>
        <div className="text-sm text-slate-400">/ 100</div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
    </div>
  );
}
