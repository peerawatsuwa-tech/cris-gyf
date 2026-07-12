import { MainLayout } from "@/components/layout/MainLayout";
import CommandGrid from "@/components/command/layout/CommandGrid";
import CommanderStatusBar from "@/components/command/cards/CommanderStatusBar";

export default function CommandCenterPage() {
  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Hero */}

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8">

          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
            Combat Readiness Information System
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            ระบบประเมินความพร้อมรบ
          </h1>

          <p className="mt-2 text-lg text-slate-300">
            กองเรือยามฝั่ง
            <span className="text-slate-500">
              {" "}
              (Coast Guard Squadron)
            </span>
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Operational Picture
              </p>

              <p className="mt-1 text-white">
                ภาพรวมความพร้อมรบของทั้งกองเรือ
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Last Update
              </p>

              <p className="mt-1 text-white">
                วันนี้ 09:45 น.
              </p>

            </div>

          </div>

        </section>

        <CommanderStatusBar />

        <CommandGrid />

      </div>
    </MainLayout>
  );
}