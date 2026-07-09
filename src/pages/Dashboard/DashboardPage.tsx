import { MainLayout } from "@/components/layout/MainLayout";
import KPICards from "@/components/dashboard/KPICards";
import FleetSummary from "@/components/dashboard/FleetSummary";
import { FleetStatus } from "@/components/dashboard/FleetStatus";
import { MissionCapability } from "@/components/dashboard/MissionCapability";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <KPICards />
        <FleetSummary />

        <div className="grid grid-cols-2 gap-6">
          <MissionCapability />
          <FleetStatus />
        </div>
      </div>
    </MainLayout>
  );
}