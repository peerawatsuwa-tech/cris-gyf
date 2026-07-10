import { fleet } from "@/data/fleet";

export default function FleetOverviewCard() {

  const ready = fleet.filter(
    (ship) => ship.readiness === "Y"
  ).length;

  const limited = fleet.filter(
    (ship) => ship.readiness === "Q"
  ).length;

  const notReady = fleet.filter(
    (ship) => ship.readiness === "N"
  ).length;

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">
        Fleet Overview
      </h2>

      <div className="mt-6 space-y-5">

        <div className="flex justify-between">

          <span className="text-slate-300">
            Ready
          </span>

          <span className="font-bold text-emerald-400">
            {ready}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-300">
            Limited
          </span>

          <span className="font-bold text-yellow-400">
            {limited}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-300">
            Not Ready
          </span>

          <span className="font-bold text-red-400">
            {notReady}
          </span>

        </div>

      </div>

    </div>

  );

}