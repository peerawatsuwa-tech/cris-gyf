import type { Ship } from "@/types/fleet";
import { Link } from "react-router-dom";

import { calculateReadiness } from "@/engine/calculateReadiness";
import { calculateMission } from "@/engine/MissionEngine";

interface Props {
  ship: Ship;
}

export default function FleetCard({ ship }: Props) {

  const readiness = calculateReadiness(ship);

  const missions = calculateMission(ship);

  const summary = {
    Y: missions.filter((m) => m.readiness === "Y").length,
    Q: missions.filter((m) => m.readiness === "Q").length,
    N: missions.filter((m) => m.readiness === "N").length,
  };

  const status = {
    Y: {
      text: "พร้อมปฏิบัติ",
      color: "bg-emerald-500",
      badge: "text-emerald-400",
    },
    Q: {
      text: "พร้อมบางส่วน",
      color: "bg-yellow-500",
      badge: "text-yellow-400",
    },
    N: {
      text: "ไม่พร้อม",
      color: "bg-red-500",
      badge: "text-red-400",
    },
  }[readiness.readiness];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg transition hover:border-sky-700">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className={`h-4 w-4 rounded-full ${status.color}`} />

          <div>

            <h2 className="text-2xl font-bold text-white">
              {ship.hullNumber}
            </h2>

            <p className="text-sm text-slate-400">
              {ship.shipName}
            </p>

          </div>

        </div>

        <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-300">
          {ship.cRating}
        </span>

      </div>

      {/* Ship Info */}

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

        <div>

          <p className="text-slate-500">
            ชั้นเรือ
          </p>

          <p className="text-white">
            {ship.shipClass}
          </p>

        </div>

        <div>

          <p className="text-slate-500">
            หน่วย
          </p>

          <p className="text-white">
            {ship.squadron}
          </p>

        </div>

      </div>

      {/* Readiness */}

      <div className="mt-6">

        <div className="flex justify-between">

          <span className="text-slate-400">
            ความพร้อมรบ
          </span>

          <span className={`font-bold ${status.badge}`}>
            {status.text}
          </span>

        </div>

        <div className="mt-2 h-2 rounded-full bg-slate-700">

          <div
            className="h-2 rounded-full bg-sky-500"
            style={{
              width: `${readiness.score}%`,
            }}
          />

        </div>

        <div className="mt-2 flex justify-between text-sm">

          <span className="text-slate-400">
            คะแนน
          </span>

          <span className="font-semibold text-sky-400">
            {readiness.score.toFixed(1)}%
          </span>

        </div>

      </div>

      {/* Crew */}

      <div className="mt-6 flex justify-between">

        <span className="text-slate-400">
          กำลังพล
        </span>

        <span className="font-semibold text-white">
          {ship.crew}/{ship.authorizedCrew}
        </span>

      </div>

      {/* Mission */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <p className="mb-3 font-semibold text-white">
          สรุปภารกิจ
        </p>

        <div className="grid grid-cols-3 text-center">

          <div>

            <p className="text-2xl font-bold text-emerald-400">
              {summary.Y}
            </p>

            <p className="text-xs text-slate-500">
              พร้อม
            </p>

          </div>

          <div>

            <p className="text-2xl font-bold text-yellow-400">
              {summary.Q}
            </p>

            <p className="text-xs text-slate-500">
              จำกัด
            </p>

          </div>

          <div>

            <p className="text-2xl font-bold text-red-400">
              {summary.N}
            </p>

            <p className="text-xs text-slate-500">
              ไม่พร้อม
            </p>

          </div>

        </div>

      </div>

      <Link
        to={`/ship/${ship.id}`}
        className="mt-6 block rounded-xl bg-sky-600 py-3 text-center font-semibold text-white transition hover:bg-sky-500"
      >
        ดูรายละเอียดเรือ
      </Link>

    </div>
  );
}