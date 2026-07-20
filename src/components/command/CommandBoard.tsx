import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  ShieldAlert,
  Ship,
  Target,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFleet } from "@/context/FleetContext";
import { buildCommanderIntelligence } from "@/engine/commanderIntelligenceEngine";
import { useCommanderDecisionsV2 } from "@/hooks/useCommanderDecisionsV2";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

type Detail = {
  eyebrow: string;
  title: string;
  status: string;
  rootCause: string;
  missionImpact: string;
  action: string;
  evidence: string[];
};

export default function CommandBoard() {
  const { fleet } = useFleet();
  const snapshot = useCommanderSnapshot();
  const decisions = useCommanderDecisionsV2();
  const intelligence = useMemo(() => buildCommanderIntelligence(fleet), [fleet]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const issues = decisions.constraints.slice(0, 3);
  const actions = decisions.actions.slice(0, 3);
  const attentionShips = intelligence.fleetRisks.slice(0, 4);
  const missions = intelligence.missions;

  useEffect(() => {
    if (!detail) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detail]);

  const openFleet = () =>
    setDetail({
      eyebrow: "FLEET STATUS",
      title: "สถานะกองเรือ 40 ลำ",
      status: `Y ${snapshot.ready} · Q ${snapshot.limited} · N ${snapshot.notReady}`,
      rootCause: `เรือ ${snapshot.limited + snapshot.notReady} ลำมีข้อจำกัดหรือไม่พร้อม`,
      missionImpact: `ความพร้อมเฉลี่ย ${snapshot.average.toFixed(0)}%`,
      action: decisions.topAction?.title ?? "รักษาระดับความพร้อม",
      evidence: [
        `พร้อมปฏิบัติ ${snapshot.ready} ลำ`,
        `มีข้อจำกัด ${snapshot.limited} ลำ`,
        `ไม่พร้อม ${snapshot.notReady} ลำ`,
      ],
    });

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-sky-800/60 bg-[radial-gradient(circle_at_top_right,rgba(14,116,144,0.2),transparent_36%),linear-gradient(135deg,rgba(3,15,31,0.99),rgba(5,26,46,0.98))] shadow-2xl shadow-slate-950/50">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-sky-900/60 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-cyan-400">
            <BrainCircuit className="h-4 w-4" />
            AI COMMANDER · COMMAND BOARD
          </div>
          <h1 className="mt-1 text-xl font-black text-white md:text-2xl">
            ภาพรวมเพื่อการตัดสินใจ
          </h1>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">
            {decisions.executiveSummary}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-950/25 px-3 py-2 sm:flex">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <div>
            <p className="text-[9px] font-bold text-emerald-400/80">OPERATIONAL STATUS</p>
            <p className="text-xs font-black text-emerald-300">
              {snapshot.notReady > 0 ? "พร้อมโดยมีความเสี่ยง" : "พร้อมปฏิบัติ"}
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 auto-rows-fr gap-2 overflow-auto p-2 md:grid-cols-12 md:grid-rows-[0.9fr,1.05fr,0.9fr] md:overflow-hidden md:p-3">
        <BoardCard
          className="md:col-span-3"
          icon={Gauge}
          label="OVERALL READINESS"
          onClick={openFleet}
        >
          <div className="flex items-end gap-1">
            <span className="text-4xl font-black text-sky-300">{snapshot.average.toFixed(0)}</span>
            <span className="pb-1 text-lg font-black text-sky-500">%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style={{ width: `${Math.min(100, snapshot.average)}%` }} />
          </div>
          <p className="mt-2 text-[10px] text-slate-500">กดเพื่อดู Fleet Status</p>
        </BoardCard>

        <BoardCard className="md:col-span-3" icon={Ship} label="FLEET STATUS" onClick={openFleet}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStatus label="Y" value={snapshot.ready} tone="text-emerald-300" />
            <MiniStatus label="Q" value={snapshot.limited} tone="text-amber-300" />
            <MiniStatus label="N" value={snapshot.notReady} tone="text-rose-300" />
          </div>
          <p className="mt-2 text-[10px] text-slate-500">เรือทั้งหมด {fleet.length} ลำ</p>
        </BoardCard>

        <BoardCard className="md:col-span-6" icon={Target} label="MISSION STATUS">
          <div className="grid grid-cols-4 gap-1.5">
            {missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={() => setDetail({
                  eyebrow: `MISSION ${mission.id}`,
                  title: mission.title,
                  status: `${mission.status} · ${mission.score}%`,
                  rootCause: mission.causes.slice(0, 2).join(" · ") || "ไม่พบข้อจำกัดหลัก",
                  missionImpact: `เรือได้รับผลกระทบ ${mission.affectedShips.length} ลำ`,
                  action: actions.find((action) => action.missionImpact.some((impact) => impact.missionId === mission.id))?.title ?? "ติดตามสถานการณ์",
                  evidence: mission.affectedShips.slice(0, 4),
                })}
                className="rounded-lg border border-slate-800 bg-slate-950/45 px-2 py-1.5 text-left transition hover:border-sky-600"
              >
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-sky-300">{mission.id}</span>
                  <span className={mission.status === "Y" ? "text-emerald-300" : mission.status === "Q" ? "text-amber-300" : "text-rose-300"}>{mission.status}</span>
                </div>
                <p className="mt-1 text-sm font-black text-white">{mission.score}%</p>
              </button>
            ))}
          </div>
        </BoardCard>

        <BoardCard className="md:col-span-4" icon={AlertTriangle} label="TOP CRITICAL ISSUES">
          <div className="space-y-1.5">
            {issues.map((issue, index) => (
              <CompactRow
                key={issue.id}
                index={index + 1}
                title={issue.title}
                meta={`${issue.affectedShipIds.length} ลำ · ${issue.affectedMissionIds.join(", ")}`}
                value={`${issue.severity}`}
                tone="rose"
                onClick={() => setDetail({
                  eyebrow: "CRITICAL ISSUE",
                  title: issue.title,
                  status: `Severity ${issue.severity}/100`,
                  rootCause: issue.evidence[0] ?? "อยู่ระหว่างตรวจสอบ",
                  missionImpact: issue.affectedMissionIds.join(", ") || "ผลกระทบภาพรวมกองเรือ",
                  action: actions.find((action) => action.constraintIds.includes(issue.id))?.title ?? "ติดตามและประเมินซ้ำ",
                  evidence: issue.evidence.slice(0, 4),
                })}
              />
            ))}
          </div>
        </BoardCard>

        <BoardCard className="md:col-span-4" icon={ShieldAlert} label="SHIPS REQUIRING ATTENTION">
          <div className="grid grid-cols-2 gap-1.5">
            {attentionShips.map((ship) => (
              <button
                key={ship.shipId}
                type="button"
                onClick={() => setDetail({
                  eyebrow: "SHIP STATUS",
                  title: ship.hullNumber,
                  status: `${ship.readiness} · Risk ${ship.riskScore}`,
                  rootCause: ship.primaryIssue,
                  missionImpact: ship.missionImpact.join(", ") || "ติดตามภาพรวม",
                  action: "ตรวจสอบข้อจำกัดและจัดลำดับการแก้ไข",
                  evidence: [`สังกัด ${ship.squadron}`, `กำลังพล ${ship.crewPercent}%`, `ระดับความเสี่ยง ${ship.riskLevel}`],
                })}
                className="rounded-lg border border-slate-800 bg-slate-950/45 p-2 text-left transition hover:border-sky-600"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-black text-white">{ship.hullNumber}</span>
                  <span className="text-xs font-black text-rose-300">{ship.riskScore}</span>
                </div>
                <p className="mt-1 truncate text-[9px] text-slate-500">{ship.primaryIssue}</p>
              </button>
            ))}
          </div>
        </BoardCard>

        <BoardCard className="md:col-span-4" icon={BrainCircuit} label="AI COMMANDER BRIEF">
          <p className="line-clamp-4 text-xs leading-5 text-slate-300">{intelligence.executiveAssessment}</p>
          <p className="mt-2 text-[10px] font-bold text-cyan-400">Confidence {decisions.topAction?.confidence ?? 0}%</p>
        </BoardCard>

        <BoardCard className="md:col-span-12" icon={Target} label="RECOMMENDED ACTIONS">
          <div className="grid gap-2 md:grid-cols-3">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => setDetail({
                  eyebrow: `RECOMMENDED ACTION · PRIORITY ${action.rank}`,
                  title: action.title,
                  status: `${action.priority} · ความเชื่อมั่น ${action.confidence}%`,
                  rootCause: action.rationale,
                  missionImpact: action.missionImpact.map((impact) => `${impact.missionId} ${impact.currentScore}→${impact.projectedScore}%`).join(" · "),
                  action: `พิจารณาอนุมัติ คาดเพิ่ม Fleet +${action.estimatedFleetGain}%`,
                  evidence: action.evidence.slice(0, 4),
                })}
                className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-950/15 px-3 py-2 text-left transition hover:border-emerald-400"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-black text-emerald-300">{action.rank}</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white">{action.title}</p>
                  <p className="mt-0.5 truncate text-[9px] text-slate-500">{action.affectedShips} ลำ · {action.missionImpact.map((item) => item.missionId).join(", ")}</p>
                </div>
                <span className="text-sm font-black text-emerald-300">+{action.estimatedFleetGain}%</span>
              </button>
            ))}
          </div>
        </BoardCard>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-sky-900/50 bg-slate-950/25 px-4 py-2 text-[10px] text-slate-500">
        <span>ข้อมูลสาธิตเพื่อสนับสนุนการพิจารณา</span>
        <span className="font-bold text-sky-400">One click to investigate</span>
      </footer>

      {detail && <DecisionDetailModal detail={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}

function BoardCard({ className, icon: Icon, label, onClick, children }: { className?: string; icon: typeof Ship; label: string; onClick?: () => void; children: React.ReactNode }) {
  const content = (
    <>
      <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.14em] text-sky-400"><Icon className="h-3.5 w-3.5" />{label}</div>
      {children}
    </>
  );
  const classes = `min-h-0 rounded-xl border border-slate-800 bg-slate-950/45 p-3 ${className ?? ""}`;
  return onClick ? <button type="button" onClick={onClick} className={`${classes} text-left transition hover:border-sky-600`}>{content}</button> : <div className={classes}>{content}</div>;
}

function MiniStatus({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-950/40 py-2"><p className={`text-xl font-black ${tone}`}>{value}</p><p className="text-[9px] font-bold text-slate-500">{label}</p></div>;
}

function CompactRow({ index, title, meta, value, tone, onClick }: { index: number; title: string; meta: string; value: string; tone: "rose" | "emerald"; onClick: () => void }) {
  const color = tone === "rose" ? "text-rose-300 bg-rose-500/15" : "text-emerald-300 bg-emerald-500/15";
  return <button type="button" onClick={onClick} className="grid w-full grid-cols-[auto,1fr,auto] items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-2 py-1.5 text-left transition hover:border-sky-600"><span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black ${color}`}>{index}</span><span className="min-w-0"><span className="block truncate text-[11px] font-bold text-white">{title}</span><span className="block truncate text-[9px] text-slate-500">{meta}</span></span><span className={`text-xs font-black ${tone === "rose" ? "text-rose-300" : "text-emerald-300"}`}>{value}</span></button>;
}

function DecisionDetailModal({ detail, onClose }: { detail: Detail; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="command-detail-title" className="w-full max-w-2xl overflow-hidden rounded-2xl border border-sky-700/60 bg-slate-950 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div><p className="text-[10px] font-black tracking-[0.2em] text-sky-400">{detail.eyebrow}</p><h2 id="command-detail-title" className="mt-1 text-xl font-black text-white">{detail.title}</h2></div>
          <button type="button" onClick={onClose} aria-label="ปิดรายละเอียด" className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-4 w-4" /></button>
        </header>
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <DetailBlock label="CURRENT STATUS" value={detail.status} tone="text-sky-300" />
          <DetailBlock label="ROOT CAUSE" value={detail.rootCause} />
          <DetailBlock label="MISSION IMPACT" value={detail.missionImpact} />
          <DetailBlock label="RECOMMENDED ACTION" value={detail.action} tone="text-emerald-300" />
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:col-span-2"><p className="text-[10px] font-black tracking-wider text-amber-300">KEY SUPPORTING EVIDENCE</p><ul className="mt-2 grid gap-1 text-xs text-slate-400 sm:grid-cols-2">{detail.evidence.length > 0 ? detail.evidence.map((item) => <li key={item}>• {item}</li>) : <li>• ไม่พบหลักฐานเพิ่มเติม</li>}</ul></div>
        </div>
        <footer className="flex items-center justify-between border-t border-slate-800 bg-slate-900/40 px-5 py-3 text-[10px] text-slate-500"><span>Decision Support · Evidence on Demand</span><button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">ปิด</button></footer>
      </div>
    </div>
  );
}

function DetailBlock({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-[10px] font-black tracking-wider text-slate-500">{label}</p><p className={`mt-2 text-sm font-bold leading-5 ${tone}`}>{value || "—"}</p></div>;
}
