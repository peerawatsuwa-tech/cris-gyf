import { MainLayout } from "@/components/layout/MainLayout";

import CommanderStatusBar from "@/components/command/cards/CommanderStatusBar";
import CommanderExecutiveBrief from "@/components/command/cards/CommanderExecutiveBrief";
import CommanderBrief from "@/components/command/cards/CommanderBrief";
import CommandGrid from "@/components/command/layout/CommandGrid";

export default function CommandCenterPage() {
  return (
    <MainLayout>

      <div className="space-y-6">

        <CommanderStatusBar />

        <CommanderExecutiveBrief />

        <CommanderBrief />

        <CommandGrid />

      </div>

    </MainLayout>
  );
}