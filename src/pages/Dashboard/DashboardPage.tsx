import { MainLayout } from "@/components/layout/MainLayout";

import KPICards from "@/components/dashboard/KPICards";
import FleetSummary from "@/components/dashboard/FleetSummary";
import { FleetStatus } from "@/components/dashboard/FleetStatus";
import { MissionCapability } from "@/components/dashboard/MissionCapability";

import CriticalAlerts from "@/components/dashboard/CriticalAlerts";
import ReadinessTrend from "@/components/dashboard/ReadinessTrend";
import Recommendation from "@/components/dashboard/Recommendation";
import RecentEvents from "@/components/dashboard/RecentEvents";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">

        <KPICards />

        <FleetSummary />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MissionCapability />
          <FleetStatus />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CriticalAlerts />
          <ReadinessTrend />
        </div>

        <Recommendation />

        <RecentEvents />

      </div>
    </MainLayout>
  );
}