import { MainLayout } from "@/components/layout/MainLayout";
import CommandGrid from "@/components/command/layout/CommandGrid";
import CommanderStatusBar from "@/components/command/cards/CommanderStatusBar";

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
        <CommanderStatusBar />  
<CommandGrid />
        </div>

      </div>
    </MainLayout>
  );
}