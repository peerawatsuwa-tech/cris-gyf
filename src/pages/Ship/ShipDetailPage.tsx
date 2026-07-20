import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, ShipWheel } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import EquipmentCard from "@/components/ship/EquipmentCard";
import PersonnelCard from "@/components/ship/PersonnelCard";
import { useFleet } from "@/context/FleetContext";
import { calculateAlerts } from "@/engine/alertEngine";
import { calculateReadiness } from "@/engine/calculateReadiness";
import { calculateMission } from "@/engine/MissionEngine";
import type { Ship } from "@/types/ship";

const equipmentLabels = {
  radar: "เรดาร์",
  communication: "การสื่อสาร",
  weapon: "ระบบอาวุธ",
  navigation: "การเดินเรือ",
  eoir: "EO/IR",
  rhib: "RHIB",
} satisfies Record<keyof Ship["equipment"], string>;

const alertLabels: Record<string, string> = {
  "Crew below 90%": "กำลังพลต่ำกว่าร้อยละ 90",
  "Radar unavailable": "เรดาร์ไม่พร้อมใช้งาน",
  "Weapon unavailable": "ระบบอาวุธไม่พร้อมใช้งาน",
  "RHIB unavailable": "RHIB ไม่พร้อมใช้งาน",
};

const readinessStyle = {
  Y: { label: "พร้อมปฏิบัติ", text: "text-emerald-300", border: "border-emerald-500/30", bg: "bg-emerald-500" },
  Q: { label: "มีข้อจำกัด", text: "text-amber-300", border: "border-amber-500/30", bg: "bg-amber-500" },
  N: { label: "ไม่พร้อม", text: "text-rose-300", border: "border-rose-500/30", bg: "bg-rose-500" },
};

export default function ShipDetailPage() {
  const { id } = useParams();
  const { fleet } = useFleet();
  const ship = fleet.find((item) => item.id === id);

  if (!ship) {
    return <MainLayout><div className="rounded-xl border border-rose-800 bg-rose-950/20 p-10 text-center"><h1 className="text-2xl font-bold text-rose-400">ไม่พบข้อมูลเรือ</h1><Link to="/fleet" className="mt-4 inline-block text-sky-300">กลับหน้ากองเรือ</Link></div></MainLayout>;
  }

  const readiness = calculateReadiness(ship);
  const missions = calculateMission(ship);
  const alerts = calculateAlerts(ship);
  const style = readinessStyle[readiness.readiness];
  const limitations = Object.entries(ship.equipment).filter(([, value]) => value !== "Operational");
  const recommendation = alerts.length
    ? `เร่งแก้ไข ${alerts.map((alert) => alertLabels[alert.message] ?? alert.message).join(" และ ")} ก่อนมอบหมายภารกิจที่ได้รับผลกระทบ`
    : "เรือพร้อมรับการมอบหมายตามผลประเมินภารกิจปัจจุบัน";

  return (
    <MainLayout>
      <div className="space-y-5">
        <Link to="/fleet" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" />กลับภาพรวมกองเรือ</Link>

        <section className={`overflow-hidden rounded-2xl border ${style.border} bg-slate-950/70`}>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4"><div className="rounded-xl bg-sky-500/15 p-3 text-sky-300"><ShipWheel className="h-7 w-7" /></div><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">Ship Decision Summary</p><h1 className="text-3xl font-bold text-white">{ship.hullNumber} · {ship.shipName}</h1><p className="text-sm text-slate-400">{ship.shipClass} · {ship.squadron}</p></div></div>
            <div className="text-left lg:text-right"><p className={`text-lg font-bold ${style.text}`}>{style.label} ({readiness.readiness})</p><p className="text-4xl font-bold text-sky-300">{readiness.score}%</p></div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1fr_1fr]">
            <DecisionBlock label="สถานะปัจจุบัน"><p className={`text-2xl font-bold ${style.text}`}>{style.label}</p><p className="mt-2 text-sm text-slate-400">กำลังพล {ship.crew}/{ship.authorizedCrew} · C-Rating {ship.cRating}</p><div className="mt-4 h-2 rounded-full bg-slate-800"><div className={`h-2 rounded-full ${style.bg}`} style={{ width: `${readiness.score}%` }} /></div></DecisionBlock>
            <DecisionBlock label="ข้อจำกัดหลัก">{alerts.length ? <ul className="space-y-2">{alerts.map((alert) => <li key={alert.message} className="flex gap-2 text-sm text-rose-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{alertLabels[alert.message] ?? alert.message}</li>)}</ul> : <p className="flex gap-2 text-emerald-300"><CheckCircle2 className="h-5 w-5" />ไม่พบข้อจำกัดวิกฤต</p>}</DecisionBlock>
            <DecisionBlock label="ข้อเสนอสำหรับผู้บังคับบัญชา"><p className="text-sm leading-6 text-slate-200">{recommendation}</p></DecisionBlock>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"><h2 className="text-xl font-bold text-white">ผลกระทบต่อภารกิจ</h2><p className="text-sm text-slate-500">ผลประเมินจาก Mission Engine ปัจจุบัน</p><div className="mt-4 space-y-2">{missions.map((mission) => { const missionStyle = readinessStyle[mission.readiness]; return <div key={mission.mission} className="flex items-center justify-between rounded-xl border border-slate-800 p-3"><div><p className="font-semibold text-white">{mission.mission}</p><p className="text-xs text-slate-500">{mission.reasons[0] ?? "ผ่านเกณฑ์ที่กำหนด"}</p></div><p className={`font-bold ${missionStyle.text}`}>{mission.readiness} · {mission.score}%</p></div>; })}</div></section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"><h2 className="text-xl font-bold text-white">หลักฐานสำคัญ</h2><p className="text-sm text-slate-500">Personnel และ Equipment ที่มีใน Domain Model ปัจจุบัน</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{(Object.entries(ship.equipment) as [keyof Ship["equipment"], Ship["equipment"][keyof Ship["equipment"]]][]).map(([key, value]) => <div key={key} className={`flex justify-between rounded-lg border p-3 text-sm ${value === "Operational" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-200" : value === "Limited" ? "border-amber-500/20 bg-amber-500/5 text-amber-200" : "border-rose-500/20 bg-rose-500/5 text-rose-200"}`}><span>{equipmentLabels[key]}</span><strong>{value}</strong></div>)}</div>{limitations.length === 0 && <p className="mt-3 text-sm text-emerald-300">ระบบสำคัญทั้งหมดพร้อมใช้งาน</p>}</section>
        </div>

        <details className="group rounded-2xl border border-slate-800 bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between p-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Supporting Data</p><h2 className="text-xl font-bold text-white">ปรับปรุงข้อมูลต้นทาง</h2><p className="text-sm text-slate-500">เปิดเมื่อจำเป็นต้องแก้ไขกำลังพลหรือสถานะอุปกรณ์</p></div><ChevronDown className="h-5 w-5 text-sky-400 transition group-open:rotate-180" /></summary>
          <div className="grid gap-4 border-t border-slate-800 p-5 lg:grid-cols-2"><PersonnelCard ship={ship} /><EquipmentCard ship={ship} /></div>
        </details>

        <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100"><strong>ขอบเขตข้อมูล:</strong> Training, Logistics และ Maintenance ยังไม่อยู่ใน Ship Domain Model จึงไม่สร้างข้อมูลจำลองใน Prototype นี้</section>
      </div>
    </MainLayout>
  );
}

function DecisionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>{children}</div>;
}
