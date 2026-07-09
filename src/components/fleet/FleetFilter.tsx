interface FleetFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function FleetFilter({ value, onChange }: FleetFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none"
    >
      <option value="all">All ships</option>
      <option value="Operational">Operational</option>
      <option value="Limited">Limited</option>
      <option value="Maintenance">Maintenance</option>
    </select>
  );
}
