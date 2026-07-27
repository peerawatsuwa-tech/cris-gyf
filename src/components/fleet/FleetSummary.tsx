import { fleet } from "@/data/excelFleet";
import { summarizeFleet } from "@/lib/readinessV027";

export default function FleetSummary() {
  const { counts } = summarizeFleet(fleet);

  return (
    <div className="mb-8 grid grid-cols-4 gap-4">
      <div className="rounded-xl bg-blue-600 p-4 text-white">
        <h2>เรือทั้งหมด</h2>
        <h1 className="text-4xl">{fleet.length}</h1>
      </div>

      <div className="rounded-xl bg-green-600 p-4 text-white">
        <h2>พร้อม</h2>
        <h1 className="text-4xl">{counts.Y}</h1>
      </div>

      <div className="rounded-xl bg-yellow-500 p-4">
        <h2>มีข้อจำกัด</h2>
        <h1 className="text-4xl">{counts.Q}</h1>
      </div>

      <div className="rounded-xl bg-red-600 p-4 text-white">
        <h2>ไม่พร้อม</h2>
        <h1 className="text-4xl">{counts.N}</h1>
      </div>
    </div>
  );
}
