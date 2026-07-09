interface PersonnelStatusProps {
  crew: number;
  authorizedCrew: number;
}

export function PersonnelStatus({ crew, authorizedCrew }: PersonnelStatusProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">Personnel</p>
      <p className="mt-1 text-2xl font-semibold text-white">{crew}/{authorizedCrew}</p>
      <p className="text-sm text-slate-400">Crew onboard</p>
    </div>
  );
}
