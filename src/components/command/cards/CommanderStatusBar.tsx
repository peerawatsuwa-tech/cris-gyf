import { fleet } from "@/data/fleet";
import { calculateReadiness } from "@/engine/calculateReadiness";

export default function CommanderStatusBar() {
  const results = fleet.map((ship) => calculateReadiness(ship));

  const ready = results.filter((r) => r.readiness === "Y").length;
  const limited = results.filter((r) => r.readiness === "Q").length;
  const notReady = results.filter((r) => r.readiness === "N").length;

  const avg =
    results.reduce((sum, r) => sum + r.score, 0) / results.length;

  return (
    <div className="grid gap-4 md:grid-cols-4">

      <Status
        title="พร้อมปฏิบัติ"
        subtitle="Ready"
        value={ready}
        color="text-emerald-400"
      />

      <Status
        title="พร้อมบางส่วน"
        subtitle="Qualified"
        value={limited}
        color="text-yellow-400"
      />

      <Status
        title="ไม่พร้อม"
        subtitle="Not Ready"
        value={notReady}
        color="text-red-400"
      />

      <Status
        title="คะแนนเฉลี่ย"
        subtitle="Average Score"
        value={`${avg.toFixed(1)}%`}
        color="text-sky-400"
      />

    </div>
  );
}

function Status({
  title,
  subtitle,
  value,
  color,
}: {
  title: string;
  subtitle: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <p className="text-xs uppercase tracking-wider text-slate-500">
        {subtitle}
      </p>

      <p className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}