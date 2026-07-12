import { useState } from "react";

import { MainLayout } from "@/components/layout/MainLayout";

import FleetCard from "@/components/fleet/FleetCard";
import FleetSearch from "@/components/fleet/FleetSearch";
import { FleetFilter } from "@/components/fleet/FleetFilter";

import { useFleet } from "@/context/FleetContext";

import { calculateReadiness } from "@/engine/calculateReadiness";

export default function FleetPage() {

  const { fleet } = useFleet();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const filteredFleet = fleet.filter((ship) => {

    const readiness =
      calculateReadiness(ship);

    const matchSearch =
      ship.shipName
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      ship.hullNumber
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : readiness.readiness === filter;

    return matchSearch && matchFilter;

  });

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold text-white">

            Fleet Overview

          </h1>

          <p className="text-slate-400">

            Coast Guard Squadron Readiness

          </p>

        </div>

        {/* Search + Filter */}

        <div className="flex flex-col gap-4 md:flex-row">

          <div className="flex-1">

            <FleetSearch
              value={search}
              onChange={setSearch}
            />

          </div>

          <FleetFilter
            value={filter}
            onChange={setFilter}
          />

        </div>

        {/* Summary */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

          <p className="text-slate-400">

            พบเรือทั้งหมด

            <span className="ml-2 font-bold text-sky-400">

              {filteredFleet.length}

            </span>

            ลำ

          </p>

        </div>

        {/* Fleet Cards */}

        <div className="
grid
grid-cols-1
lg:grid-cols-2
2xl:grid-cols-3
gap-6
">

          {filteredFleet.length > 0 ? (

            filteredFleet.map((ship) => (

              <FleetCard
                key={ship.id}
                ship={ship}
              />

            ))

          ) : (

            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/70 p-10 text-center">

              <p className="text-lg text-slate-400">

                ไม่พบข้อมูลเรือ

              </p>

            </div>

          )}

        </div>

      </div>

    </MainLayout>

  );

}