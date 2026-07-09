import { fleet } from '../../data/fleet';

export default function FleetSummary() {
  const ready = fleet.filter((x) => x.readiness === 'Y').length;
  const limited = fleet.filter((x) => x.readiness === 'Q').length;
  const notReady = fleet.filter((x) => x.readiness === 'N').length;

  return (
    <div className="mb-8 grid grid-cols-4 gap-4">
      <div className="rounded-xl bg-blue-600 p-4 text-white">
        <h2>เรือทั้งหมด</h2>
        <h1 className="text-4xl">{fleet.length}</h1>
      </div>

      <div className="rounded-xl bg-green-600 p-4 text-white">
        <h2>พร้อม</h2>
        <h1 className="text-4xl">{ready}</h1>
      </div>

      <div className="rounded-xl bg-yellow-500 p-4">
        <h2>มีข้อจำกัด</h2>
        <h1 className="text-4xl">{limited}</h1>
      </div>

      <div className="rounded-xl bg-red-600 p-4 text-white">
        <h2>ไม่พร้อม</h2>
        <h1 className="text-4xl">{notReady}</h1>
      </div>
    </div>
  );
}
