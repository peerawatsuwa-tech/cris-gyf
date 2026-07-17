import { MainLayout } from "@/components/layout/MainLayout";
import SecurityBanner from "@/components/common/SecurityBanner";
import OperationalMap from "@/components/command/OperationalMap";
import CommanderMorningBrief from "@/components/command/CommanderMorningBrief";
import MissionCapabilityPanel from "@/components/command/MissionCapabilityPanel";
import CommanderDecisionV2Panel from "@/components/command/CommanderDecisionV2Panel";
import FleetSnapshot from "@/components/command/FleetSnapshot";

export default function CommandCenterPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-[1900px] space-y-6">
        <SecurityBanner />

        <CommanderMorningBrief />

        <MissionCapabilityPanel />

        <CommanderDecisionV2Panel />

        <FleetSnapshot />

        <OperationalMap />
      </div>
    </MainLayout>
  );
}
