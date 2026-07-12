import { useState } from "react";

import { MainLayout } from "@/components/layout/MainLayout";

import { useFleet } from "@/context/FleetContext";

import PersonnelCard from "@/components/ship/PersonnelCard";
import EquipmentCard from "@/components/ship/EquipmentCard";
import MissionCard from "@/components/ship/MissionCard";
import RecommendationCard from "@/components/ship/RecommendationCard";

import { calculateReadiness } from "@/engine/calculateReadiness";
import { calculateMission } from "@/engine/MissionEngine";

export default function AssessmentPage() {
  const {
    fleet,
    updateShip,
} = useFleet();

const [shipId, setShipId] =
useState(fleet[0].id);

  const ship = fleet.find((s) => s.id === shipId)!;

  const readiness = calculateReadiness(ship);
  const missions = calculateMission(ship);

  const missionSummary = {
    Y: missions.filter((m) => m.readiness === "Y").length,
    Q: missions.filter((m) => m.readiness === "Q").length,
    N: missions.filter((m) => m.readiness === "N").length,
  };

  const readinessText = {
    Y: "พร้อมปฏิบัติ",
    Q: "พร้อมบางส่วน",
    N: "ไม่พร้อม",
  }[readiness.readiness];

  const readinessColor = {
    Y: "text-emerald-400",
    Q: "text-yellow-400",
    N: "text-red-400",
  }[readiness.readiness];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Combat Readiness Assessment
          </p>

          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">
            การประเมินความพร้อมรบ
          </h1>

         <p className="mt-2 text-sm md:text-base text-slate-400">
            เลือกเรือเพื่อประเมินระดับความพร้อมรบ
          </p>

          {/* Ship Selector */}
          <div className="mt-6">
            <label className="text-sm text-slate-300">
              เลือกเรือ
            </label>

            <select
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
            >
              {fleet.map((ship) => (
                <option
                  key={ship.id}
                  value={ship.id}
                >
                  {ship.shipName}
                </option>
              ))}
            </select>

            <button
  onClick={() => {
    updateShip(ship);

    alert("ประเมินสำเร็จ");
  }}
  className="mt-5 w-full rounded-lg bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700"
>
  ประเมินความพร้อมรบ
</button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white">
              ผลการประเมินล่าสุด
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  ระดับความพร้อม
                </p>

                <p className={`${readinessColor} mt-1 text-2xl font-bold`}>
                  {readinessText}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  คะแนนรวม
                </p>

                <p className="mt-1 text-2xl font-bold text-sky-400">
                  {readiness.score.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white">
              สรุปภารกิจ
            </h2>

            <div className="mt-5 grid grid-cols-3 text-center">
              <div>
                <p className="text-3xl font-bold text-emerald-400">
                  {missionSummary.Y}
                </p>

                <p className="text-slate-400">
                  พร้อม
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-yellow-400">
                  {missionSummary.Q}
                </p>

                <p className="text-slate-400">
                  จำกัด
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-red-400">
                  {missionSummary.N}
                </p>

                <p className="text-slate-400">
                  ไม่พร้อม
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <PersonnelCard ship={ship} />

          <EquipmentCard ship={ship} />

          <MissionCard ship={ship} />

          <RecommendationCard ship={ship} />
        </div>
      </div>
    </MainLayout>
  );
}