import { MainLayout } from "@/components/layout/MainLayout";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

import SecurityBanner from "@/components/common/SecurityBanner";
import OperationalMap from "@/components/command/OperationalMap";
import CommanderCOPPanel from "@/components/command/CommanderCOPPanel";

import CommanderStatusBar from "@/components/command/cards/CommanderStatusBar";
import CommanderExecutiveBrief from "@/components/command/cards/CommanderExecutiveBrief";
import CommanderBrief from "@/components/command/cards/CommanderBrief";

import CommandGrid from "@/components/command/layout/CommandGrid";

export default function CommandCenterPage() {
  const { average, total } = useCommanderSnapshot();

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1800px] space-y-6">

        {/* ส่วนแสดงข้อมูลระบบ */}
        <SecurityBanner />

        {/* ส่วนหัว */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 p-6">

          <div className="flex flex-col justify-between gap-6 lg:flex-row">

            <div>

              <p className="text-sm font-semibold tracking-widest text-sky-400">
                CRIS
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                ภาพรวมสถานการณ์กองเรือสำหรับผู้บังคับบัญชา
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                ข้อมูลเรือ 40 ลำ เพื่อสนับสนุนการตัดสินใจด้านความพร้อมรบ
                และการสาธิตภาพรวมกองเรือยามฝั่ง
              </p>

            </div>

            <div className="rounded-xl border border-sky-900 bg-slate-950/60 p-5">

              <p className="text-xs uppercase tracking-widest text-slate-500">
                ภาพรวมความพร้อมรบ
              </p>

              <div className="mt-2 flex items-end gap-3">

                <span className="text-5xl font-bold text-emerald-400">
                  {average.toFixed(1)}%
                </span>

                <span className="pb-2 text-slate-400">
                  ระดับความพร้อม · {total} ลำ
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ภาพรวมสถานการณ์ร่วม */}
        <CommanderCOPPanel />

        {/* แผนที่ */}
        <OperationalMap />

        {/* สถานะกองเรือ */}
        <CommanderStatusBar />

        {/* สรุปผู้บังคับบัญชา */}
        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <CommanderExecutiveBrief />
          </div>

          <CommanderBrief />

        </div>

        {/* ส่วนรายละเอียด */}
        <CommandGrid />

      </div>
    </MainLayout>
  );
}