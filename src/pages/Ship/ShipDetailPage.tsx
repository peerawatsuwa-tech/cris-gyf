import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

import { useFleet } from "@/context/FleetContext";

import ShipHeader from "@/components/ship/ShipHeader";
import PersonnelCard from "@/components/ship/PersonnelCard";
import EquipmentCard from "@/components/ship/EquipmentCard";
import MissionCard from "@/components/ship/MissionCard";
import RecommendationCard from "@/components/ship/RecommendationCard";

import { calculateReadiness } from "@/engine/calculateReadiness";

export default function ShipDetailPage() {

  const { id } = useParams();

  const { fleet } = useFleet();

  const ship = fleet.find((s) => s.id === id);

  if (!ship) {

    return (

      <MainLayout>

        <div className="rounded-xl border border-red-800 bg-red-950/20 p-10 text-center">

          <h1 className="text-2xl font-bold text-red-400">
            ไม่พบข้อมูลเรือ
          </h1>

        </div>

      </MainLayout>

    );

  }

  const readiness = calculateReadiness(ship);

  const status = {
    Y: {
      text: "พร้อมปฏิบัติ",
      color: "text-emerald-400",
      bg: "bg-emerald-500",
    },
    Q: {
      text: "พร้อมบางส่วน",
      color: "text-yellow-400",
      bg: "bg-yellow-500",
    },
    N: {
      text: "ไม่พร้อม",
      color: "text-red-400",
      bg: "bg-red-500",
    },
  }[readiness.readiness];

  return (

    <MainLayout>

      <div className="space-y-6">

        <ShipHeader ship={ship} />

        {/* Executive Summary */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

          <h2 className="text-xl font-bold text-white">

            สรุปความพร้อมรบ

          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <div>

              <p className="text-sm text-slate-400">

                ระดับความพร้อม

              </p>

              <p className={`mt-2 text-3xl font-bold ${status.color}`}>

                {status.text}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-400">

                คะแนนรวม

              </p>

              <p className="mt-2 text-3xl font-bold text-sky-400">

                {readiness.score.toFixed(1)}%

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-400">

                กำลังพล

              </p>

              <p className="mt-2 text-3xl font-bold text-white">

                {ship.crew}/{ship.authorizedCrew}

              </p>

            </div>

          </div>

          <div className="mt-6 h-3 rounded-full bg-slate-700">

            <div
              className={`h-3 rounded-full ${status.bg}`}
              style={{
                width: `${readiness.score}%`,
              }}
            />

          </div>

        </div>

        {/* Detail */}

        <div className="grid gap-4 lg:grid-cols-2">

          <PersonnelCard ship={ship} />

          <EquipmentCard ship={ship} />

          <MissionCard ship={ship} />

          <RecommendationCard ship={ship} />

        </div>

      </div>

    </MainLayout>

  );

}