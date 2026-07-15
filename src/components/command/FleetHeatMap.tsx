import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function FleetHeatMap() {
  const { items } = useCommanderSnapshot();
  const groups = Array.from(new Set(items.map(({ ship }) => ship.squadron))).map((name) => ({
    name,
    ships: items.filter(({ ship }) => ship.squadron === name),
  }));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 xl:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs tracking-[0.3em] text-sky-400">Y / Q / N</p><h2 className="mt-2 text-xl font-bold text-white">แผนภาพความพร้อมเรือ 40 ลำ</h2></div>
        <div className="flex gap-4 text-xs text-slate-400"><Legend color="bg-emerald-500" label="พร้อม"/><Legend color="bg-yellow-500" label="มีข้อจำกัด"/><Legend color="bg-red-500" label="ไม่พร้อม"/></div>
      </div>
      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <div key={group.name}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold text-white">{group.name}</h3><span className="text-xs text-slate-500">{group.ships.length} ลำ</span></div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
              {group.ships.map(({ ship, result }) => {
                const color = result.readiness === "Y" ? "border-emerald-700 bg-emerald-950/70 text-emerald-300" : result.readiness === "Q" ? "border-yellow-700 bg-yellow-950/70 text-yellow-300" : "border-red-700 bg-red-950/70 text-red-300";
                return <div key={ship.id} title={`${ship.shipName} ${result.score.toFixed(1)}%`} className={`rounded-lg border px-2 py-3 text-center ${color}`}><p className="text-sm font-bold">{ship.hullNumber}</p><p className="mt-1 text-xs">{result.readiness}</p></div>;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><i className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>; }
