import { MainLayout } from "@/components/layout/MainLayout";
import SecurityBanner from "@/components/common/SecurityBanner";
import OperationalMap from "@/components/command/OperationalMap";
import CommanderSituationOverview from "@/components/command/CommanderSituationOverview";
import CommanderProblemActionPanel from "@/components/command/CommanderProblemActionPanel";
import CommanderMorningBrief from "@/components/command/CommanderMorningBrief";
import MissionCapabilityPanel from "@/components/command/MissionCapabilityPanel";
import DecisionTodayPanel from "@/components/command/DecisionTodayPanel";

export default function CommandCenterPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-[1900px] space-y-6">
        <SecurityBanner />

        <CommanderMorningBrief />

        <CommanderSituationOverview />

        <OperationalMap />

        <MissionCapabilityPanel />

        <DecisionTodayPanel />

        <CommanderProblemActionPanel />
      </div>
    </MainLayout>
  );
}
