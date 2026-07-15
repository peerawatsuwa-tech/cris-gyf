import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function PriorityFleetCard() {
  const { items } = useCommanderSnapshot();
  const ships = [...items].sort((a, b) => a.result.score - b.result.score).slice(0, 10);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-xs tracking-[0.3em] text-red-400">ลำดับเร่งด่วน</p>
      <h2 className="mt-2 text-xl font-bold text-white">เรือที่ควรเร่งดำเนินการ</h2>
      <div className="mt-5 space-y-3">
        {ships.map((item, index) => (
          <div key={item.ship.id} className="flex items-center justify-between rounded-xl bg-slate-900 p-3">
            <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-300">{index + 1}</span><div><p className="font-semibold text-white">{item.ship.hullNumber}</p><p className="text-xs text-slate-500">{item.ship.squadron}</p></div></div>
            <div className="text-right"><p className={item.result.readiness === "N" ? "font-bold text-red-400" : "font-bold text-yellow-400"}>{item.result.score.toFixed(1)}%</p><p className="text-xs text-slate-500">สถานะ {item.result.readiness}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
