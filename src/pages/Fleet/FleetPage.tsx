import { MainLayout } from "@/components/layout/MainLayout";
import FleetCard from "@/components/fleet/FleetCard";
import { FleetFilter } from "@/components/fleet/FleetFilter";
import FleetSearch from "@/components/fleet/FleetSearch";

import { fleet } from "@/data/fleet";

import { useState } from "react";


export default function FleetPage() {
  const [filter, setFilter] = useState("");
  return (
    <MainLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Fleet Overview
          </h1>

          <p className="text-slate-400">
            Coast Guard Squadron Readiness
          </p>
        </div>

        <div className="flex gap-4">
          <FleetSearch
  value=""
  onChange={() => {}}
/>
          <FleetFilter
    value={filter}
    onChange={setFilter}
/>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          {fleet.map((ship) => (
            <FleetCard
              key={ship.id}
              ship={ship}
            />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}