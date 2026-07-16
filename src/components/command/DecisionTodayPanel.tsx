import {
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock4,
  Ship,
} from "lucide-react";
import { useCommanderDecision } from "@/hooks/useCommanderDecision";
import { useFleet } from "@/context/FleetContext";
import type { EquipmentStatus, Ship as ShipType } from "@/types/ship";

interface WatchItem {
  ship: ShipType;
  issue: string;
  impact: string;
  priority: "วิกฤต" | "สูง" | "ปานกลาง";
  score: number;
}

const equipmentLabel: Record<keyof ShipType["equipment"], string> = {
  radar: "ระบบเรดาร์",
  communication: "ระบบสื่อสาร",
  weapon: "ระบบอาวุธ",
  navigation: "ระบบเดินเรือ",
  eoir: "ระบบ EO/IR",
  rhib: "RHIB",
};

const equipmentImpact: Record<keyof ShipType["equipment"], string> = {
  radar: "กระทบการตรวจการณ์และการตระหนักรู้สถานการณ์ทางทะเล",
  communication: "กระทบการควบคุมบังคับบัญชาและการประสานกำลัง",
  weapon: "กระทบการคุ้มกันและขีดความสามารถด้านการป้องกัน",
  navigation: "กระทบความปลอดภัยในการเดินเรือและการเข้าพื้นที่",
  eoir: "กระทบการพิสูจน์ทราบเป้าหมายและการปฏิบัติกลางคืน",
  rhib: "กระทบการตรวจค้น VBSS และการช่วยเหลือผู้ประสบภัย",
};

function equipmentPenalty(status: EquipmentStatus) {
  if (status === "Not Ready") return 35;
  if (status === "Limited") return 15;
  return 0;
}

function buildWatchList(fleet: ShipType[]): WatchItem[] {
  return fleet
    .map((ship) => {
      const equipmentIssues = (
        Object.entries(ship.equipment) as Array<
          [keyof ShipType["equipment"], EquipmentStatus]
        >
      )
        .filter(([, status]) => status !== "Operational")
        .sort(
          (a, b) => equipmentPenalty(b[1]) - equipmentPenalty(a[1]),
        );

      const [primaryKey, primaryStatus] =
        equipmentIssues[0] ?? ["radar", "Operational"];

      const crewRatio =
        ship.authorizedCrew > 0 ? ship.crew / ship.authorizedCrew : 0;

      const score =
        equipmentIssues.reduce(
          (sum, [, status]) => sum + equipmentPenalty(status),
          0,
        ) +
        (crewRatio < 0.8 ? 25 : crewRatio < 0.9 ? 10 : 0) +
        (ship.readiness === "N" ? 45 : ship.readiness === "Q" ? 20 : 0);

      const priority =
        score >= 70 ? "วิกฤต" : score >= 35 ? "สูง" : "ปานกลาง";

      return {
        ship,
        issue:
          primaryStatus === "Operational"
            ? "กำลังพลต่ำกว่าเกณฑ์"
            : `${equipmentLabel[primaryKey]} ${
                primaryStatus === "Not Ready"
                  ? "ไม่พร้อมใช้งาน"
                  : "พร้อมแบบมีข้อจำกัด"
              }`,
        impact:
          primaryStatus === "Operational"
            ? "กระทบความต่อเนื่องในการจัดชุดปฏิบัติการ"
            : equipmentImpact[primaryKey],
        priority,
        score,
      } satisfies WatchItem;
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

const priorityClass = {
  วิกฤต: "border-rose-500/40 bg-rose-950/30 text-rose-300",
  สูง: "border-orange-500/40 bg-orange-950/25 text-orange-300",
  ปานกลาง: "border-amber-500/40 bg-amber-950/20 text-amber-300",
} as const;

export default function DecisionTodayPanel() {
  const { fleet } = useFleet();
  const decision = useCommanderDecision();
  const watchList = buildWatchList(fleet);

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <ClipboardList className="h-4 w-4" />
              เรื่องที่ควรพิจารณาสั่งการวันนี้
            </div>
            <p className="mt-1 text-sm text-slate-500">
              เรียงตามความเร่งด่วนและผลต่อความพร้อมของกองเรือ
            </p>
          </div>

          <span className="rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
            {decision.decisions.length} ข้อเสนอ
          </span>
        </header>

        <div className="divide-y divide-slate-800">
          {decision.decisions.length === 0 ? (
            <div className="flex items-center gap-3 p-6 text-sm text-slate-400">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              รักษาระดับความพร้อมและติดตามสถานการณ์ต่อเนื่อง
            </div>
          ) : (
            decision.decisions.slice(0, 4).map((item) => (
              <div
                key={`${item.priority}-${item.title}`}
                className="px-6 py-4"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950">
                    {item.priority}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-white">{item.title}</p>
                      <span className="rounded-full border border-emerald-700/60 bg-emerald-950/30 px-2.5 py-1 text-xs font-bold text-emerald-300">
                        {item.urgency}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.expectedOutcome}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Ship className="h-3.5 w-3.5" />
                        กระทบเรือ {item.affectedShips} ลำ
                      </span>

                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        เพิ่มความพร้อมประมาณ {item.estimatedReadinessGain}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
              <AlertOctagon className="h-4 w-4" />
              รายการเฝ้าระวังเร่งด่วน
            </div>
            <p className="mt-1 text-sm text-slate-500">
              เรือและระบบที่อาจส่งผลต่อภารกิจสำคัญ
            </p>
          </div>

          <Clock4 className="h-5 w-5 text-amber-400" />
        </header>

        <div className="divide-y divide-slate-800">
          {watchList.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">
              ไม่พบเรือที่ต้องเฝ้าระวังเป็นกรณีพิเศษ
            </div>
          ) : (
            watchList.map((item, index) => (
              <div
                key={item.ship.id}
                className="grid gap-3 px-6 py-4 md:grid-cols-[auto,1fr,auto]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-black text-white">
                  {index + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-white">
                      {item.ship.hullNumber}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${priorityClass[item.priority]}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-amber-200">
                    {item.issue}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.impact}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-500">สถานะเรือ</p>
                  <p
                    className={
                      item.ship.readiness === "N"
                        ? "mt-1 font-black text-rose-300"
                        : item.ship.readiness === "Q"
                          ? "mt-1 font-black text-amber-300"
                          : "mt-1 font-black text-emerald-300"
                    }
                  >
                    {item.ship.readiness}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
