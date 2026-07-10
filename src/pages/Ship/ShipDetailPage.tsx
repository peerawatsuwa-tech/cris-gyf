import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

import { fleet } from "@/data/fleet";

import ShipHeader from "@/components/ship/ShipHeader";
import PersonnelCard from "@/components/ship/PersonnelCard";
import EquipmentCard from "@/components/ship/EquipmentCard";
import MissionCard from "@/components/ship/MissionCard";
import RecommendationCard from "@/components/ship/RecommendationCard";

export default function ShipDetailPage() {
  const { id } = useParams();

  const ship = fleet.find((s) => s.id === id);

  if (!ship) {
    return (
      <MainLayout>
        <div className="text-center text-red-400 text-xl">
          Ship not found
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-6">

        <ShipHeader ship={ship} />

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