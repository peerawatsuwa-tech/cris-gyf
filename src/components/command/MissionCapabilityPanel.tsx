import {
  Anchor,
  Binoculars,
  Crosshair,
  LifeBuoy,
  Radar,
  Search,
  Shield,
  Swords,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useFleet } from "@/context/FleetContext";
import type { EquipmentStatus, ReadinessLevel, Ship } from "@/types/ship";

interface MissionDefinition {
  id: string;
  title: string;
  shortTitle: string;
  icon: typeof Anchor;
  equipment: Array<keyof Ship["equipment"]>;
  crewWeight: number;
}

const missions: MissionDefinition[] = [
  { id: "M1", title: "การแสดงกำลังทางทะเล", shortTitle: "Maritime Presence", icon: Anchor, equipment: ["communication", "navigation"], crewWeight: 0.35 },
  { id: "M2", title: "การบังคับใช้กฎหมายทางทะเล", shortTitle: "Maritime Law Enforcement", icon: Shield, equipment: ["radar", "communication", "rhib"], crewWeight: 0.3 },
  { id: "M3", title: "การรักษาความมั่นคงทางทะเล", shortTitle: "Maritime Security", icon: Radar, equipment: ["radar", "communication", "eoir", "weapon"], crewWeight: 0.25 },
  { id: "M4", title: "การค้นหาและช่วยเหลือ", shortTitle: "Search and Rescue", icon: LifeBuoy, equipment: ["navigation", "communication", "rhib"], crewWeight: 0.3 },
  { id: "M5", title: "การตระหนักรู้สถานการณ์ทางทะเล", shortTitle: "Maritime Domain Awareness", icon: Binoculars, equipment: ["radar", "communication", "eoir"], crewWeight: 0.2 },
  { id: "M6", title: "การคุ้มกันและป้องกัน", shortTitle: "Maritime Escort", icon: Swords, equipment: ["weapon", "radar", "communication", "navigation"], crewWeight: 0.25 },
  { id: "M7", title: "การตรวจค้นและยึดเรือ", shortTitle: "VBSS", icon: Search, equipment: ["rhib", "communication", "weapon"], crewWeight: 0.4 },
  { id: "M8", title: "การป้องกันและการรบทางทะเล", shortTitle: "Maritime Defense", icon: Crosshair, equipment: ["weapon", "radar", "communication", "eoir", "navigation"], crewWeight: 0.25 },
];

const equipmentScore: Record<EquipmentStatus, number> = {
  Operational: 100,
  Limited: 70,
  "Not Ready": 20,
};

function calculateShipMissionScore(ship: Ship, mission: MissionDefinition) {
  const crewScore =
    ship.authorizedCrew > 0
      ? Math.min(100, (ship.crew / ship.authorizedCrew) * 100)
      : 0;

  const systemScore =
    mission.equipment.reduce(
      (sum, key) => sum + equipmentScore[ship.equipment[key]],
      0,
    ) / mission.equipment.length;

  const readinessModifier =
    ship.readiness === "Y" ? 1 : ship.readiness === "Q" ? 0.88 : 0.62;

  return (
    (crewScore * mission.crewWeight +
      systemScore * (1 - mission.crewWeight)) *
    readinessModifier
  );
}

function getStatus(score: number): ReadinessLevel {
  if (score >= 85) return "Y";
  if (score >= 60) return "Q";
  return "N";
}

const statusMeta = {
  Y: { label: "พร้อม", textClass: "text-emerald-300", borderClass: "border-emerald-500/30", barClass: "bg-emerald-400" },
  Q: { label: "มีข้อจำกัด", textClass: "text-amber-300", borderClass: "border-amber-500/30", barClass: "bg-amber-400" },
  N: { label: "ไม่พร้อม", textClass: "text-rose-300", borderClass: "border-rose-500/30", barClass: "bg-rose-500" },
} as const;

export default function MissionCapabilityPanel() {
  const { fleet } = useFleet();

  const missionResults = missions.map((mission) => {
    const score =
      fleet.length > 0
        ? fleet.reduce(
            (sum, ship) => sum + calculateShipMissionScore(ship, mission),
            0,
          ) / fleet.length
        : 0;

    return { ...mission, score: Math.round(score), status: getStatus(score) };
  });

  const atRisk = missionResults.filter((item) => item.status !== "Y").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <header className="flex flex-col gap-3 border-b border-slate-800 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold text-sky-300">
            ขีดความสามารถตามภารกิจ M1–M8
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">
            ภาพรวมผลกระทบต่อภารกิจ
          </h2>
        </div>

        <span className="rounded-full border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs font-bold text-amber-300">
          เฝ้าระวัง {atRisk} ภารกิจ
        </span>
      </header>

      <div className="grid gap-2.5 p-4 md:grid-cols-2 xl:grid-cols-4">
        {missionResults.map((mission) => {
          const Icon = mission.icon;
          const meta = statusMeta[mission.status];
          const improving = mission.score >= 85;
          const TrendIcon = improving ? TrendingUp : TrendingDown;

          return (
            <article
              key={mission.id}
              className={`rounded-xl border bg-slate-950/55 px-4 py-3 ${meta.borderClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="rounded-lg bg-sky-950 p-2 text-sky-300">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-sky-400">
                      {mission.id}
                    </p>
                    <p className="truncate text-sm font-bold text-white">
                      {mission.title}
                    </p>
                  </div>
                </div>

                <span className={`text-base font-black ${meta.textClass}`}>
                  {mission.status}
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <span className={`text-2xl font-black ${meta.textClass}`}>
                    {mission.score}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">%</span>
                </div>

                <div className={`flex items-center gap-1 text-[11px] font-bold ${meta.textClass}`}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  {improving ? "Stable" : "Watch"}
                </div>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${meta.barClass}`}
                  style={{ width: `${mission.score}%` }}
                />
              </div>

              <p className="mt-2 truncate text-[11px] text-slate-600">
                {mission.shortTitle}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
