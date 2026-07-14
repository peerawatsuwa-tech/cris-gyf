import { ShieldCheck, Clock3, UserCircle2 } from "lucide-react";

type SecurityBannerProps = {
  classification?: string;
  user?: string;
  version?: string;
};

export default function SecurityBanner({
  classification = "ข้อมูลสาธิต",
  user = "ผู้ดูแลระบบ",
  version = "CRIS v1.0",
}: SecurityBannerProps) {

  const now = new Date();

  const date = now.toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-sky-900 bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-800 bg-sky-950 px-5 py-3">

        <div>

          <h2 className="text-sm font-bold tracking-wider text-sky-300">
            CRIS
          </h2>

          <p className="text-xs text-slate-300">
            ระบบสารสนเทศเพื่อสนับสนุนการตัดสินใจด้านความพร้อมรบ
          </p>

        </div>

        <div className="rounded-lg border border-sky-700 bg-sky-900/30 px-3 py-1 text-xs font-semibold text-sky-300">

          รุ่นสาธิตสำหรับผู้บังคับบัญชา

        </div>

      </div>

      <div className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-4">

        <div className="flex items-center gap-2">

          <ShieldCheck className="h-4 w-4 text-emerald-400" />

          <div>

            <p className="text-xs text-slate-400">
              ระดับข้อมูล
            </p>

            <p className="text-sm font-semibold text-white">
              {classification}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <UserCircle2 className="h-4 w-4 text-sky-400" />

          <div>

            <p className="text-xs text-slate-400">
              ผู้ใช้งาน
            </p>

            <p className="text-sm font-semibold text-white">
              {user}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <Clock3 className="h-4 w-4 text-amber-400" />

          <div>

            <p className="text-xs text-slate-400">
              วันและเวลา
            </p>

            <p className="text-sm font-semibold text-white">
              {date}
            </p>

          </div>

        </div>

        <div>

          <p className="text-xs text-slate-400">
            เวอร์ชันระบบ
          </p>

          <p className="text-sm font-semibold text-emerald-400">
            {version}
          </p>

        </div>

      </div>

    </div>
  );

}