import { MainLayout } from "@/components/layout/MainLayout";
import FleetOverviewCard from "@/components/command/FleetOverviewCard";
import MissionOverviewCard from "@/components/command/MissionOverviewCard";
import CriticalAlertCard from "@/components/command/CriticalAlertCard";
import ImpactCard from "@/components/command/ImpactCard";
import PriorityFleetCard from "@/components/command/PriorityFleetCard";
import ImmediateActionCard from "@/components/command/ImmediateActionCard";

export default function CommandCenterPage() {
  return (
    <MainLayout>
      <div className="space-y-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Commander Command Center
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Combat Readiness Information System
          </h1>

          <p className="mt-3 text-slate-400">
            Coast Guard Squadron Operational Picture
          </p>
<FleetOverviewCard />
<MissionOverviewCard />
<CriticalAlertCard />
<ImpactCard />
<PriorityFleetCard />
<ImmediateActionCard />
        </div>

      </div>
    </MainLayout>
  );
}