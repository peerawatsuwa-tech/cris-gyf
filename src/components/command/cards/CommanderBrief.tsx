import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function CommanderBrief() {
  const { ready, limited, notReady, average } = useCommanderSnapshot();

  return (

    <div className="rounded-2xl border border-sky-700 bg-sky-950/30 p-6">

      <h2 className="text-xl font-bold text-white">
        สรุปสำหรับผู้บังคับบัญชา
      </h2>

      <p className="mt-4 leading-8 text-slate-300">

        ปัจจุบันกองเรือมีเรือ
        <span className="font-bold text-emerald-400">
          {" "}พร้อมปฏิบัติ {ready} ลำ
        </span>

        {" "}พร้อมบางส่วน
        <span className="font-bold text-yellow-400">
          {" "}{limited} ลำ
        </span>

        {" "}และไม่พร้อมปฏิบัติ
        <span className="font-bold text-red-400">
          {" "}{notReady} ลำ
        </span>

        โดยมีคะแนนความพร้อมเฉลี่ย

        <span className="font-bold text-sky-400">
          {" "}{average.toFixed(1)}%
        </span>

      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">

        <p className="font-semibold text-white">

          ประเด็นที่ควรติดตาม

        </p>

        <ul className="mt-3 space-y-2 text-sm text-slate-300">

          <li>• เร่งแก้ไขเรือที่มีสถานะ "ไม่พร้อมปฏิบัติ"</li>

          <li>• ติดตามการซ่อมระบบสำคัญ เช่น Radar, RHIB และระบบสื่อสาร</li>

          <li>• พิจารณาเสริมกำลังพลในเรือที่มีอัตรากำลังต่ำกว่าเกณฑ์</li>

        </ul>

      </div>

    </div>

  );

}