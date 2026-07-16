import { MainLayout } from "@/components/layout/MainLayout";
import SecurityBanner from "@/components/common/SecurityBanner";
import OperationalMap from "@/components/command/OperationalMap";
import CommanderSituationOverview from "@/components/command/CommanderSituationOverview";
import CommanderProblemActionPanel from "@/components/command/CommanderProblemActionPanel";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

export default function CommandCenterPage() {
  const intelligence = useFleetIntelligence();

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1900px] space-y-6">
        <SecurityBanner />

        <header className="overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#07182f] via-slate-900 to-[#0a2540] shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-5 px-7 py-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.28em] text-sky-400">COAST GUARD READINESS INFORMATION SYSTEM</p>
              <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">ภาพรวมสถานการณ์กองเรือยามฝั่ง</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
                จออำนวยการสำหรับสรุปความพร้อม พื้นที่การปฏิบัติการ ปัญหาสำคัญ และข้อเสนอเพื่อการสั่งการในหน้าจอเดียว
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-5 py-4 text-sm text-amber-200">
              <p className="font-bold">รุ่นสาธิตสำหรับผู้บังคับบัญชา</p>
              <p className="mt-1 text-xs text-amber-300/70">ใช้ชุดข้อมูลสาธิตเชิงปฏิบัติการ ไม่ใช่ข้อมูลทางราชการ</p>
            </div>
          </div>

          <div className="border-t border-slate-700/70 bg-slate-950/35 px-7 py-4">
            <p className="text-sm leading-6 text-slate-200">
              <span className="font-bold text-sky-300">สรุปสถานการณ์:</span>{" "}
              {intelligence.headline} โดยระบบจัดลำดับประเด็นสำคัญและข้อเสนอเพื่อการสั่งการไว้ด้านล่าง
            </p>
          </div>
        </header>

        <CommanderSituationOverview />
        <OperationalMap />
        <CommanderProblemActionPanel />
      </div>
    </MainLayout>
  );
}
