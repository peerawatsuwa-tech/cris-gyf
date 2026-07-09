interface EquipmentStatusProps {
  equipment: Record<string, string>;
}

export function EquipmentStatus({ equipment }: EquipmentStatusProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">Equipment Status</p>
      <div className="mt-3 space-y-2 text-sm text-slate-300">
        {Object.entries(equipment).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2">
            <span className="capitalize">{key}</span>
            <span className="text-slate-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
