import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
}

const getColor = (status: string) => {
  switch (status) {
    case "Operational":
      return "bg-emerald-500";
    case "Limited":
      return "bg-yellow-500";
    case "Not Ready":
      return "bg-red-500";
    default:
      return "bg-slate-500";
  }
};

export default function EquipmentCard({ ship }: Props) {
  const items = [
    ["Radar", ship.equipment.radar],
    ["Communication", ship.equipment.communication],
    ["Weapon", ship.equipment.weapon],
    ["Navigation", ship.equipment.navigation],
    ["EO / IR", ship.equipment.eoir],
    ["RHIB", ship.equipment.rhib],
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        Equipment
      </h3>

      <div className="mt-5 space-y-3">

        {items.map(([name, status]) => (

          <div
            key={name}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <div className={`h-3 w-3 rounded-full ${getColor(status)}`} />

              <span className="text-slate-300">
                {name}
              </span>

            </div>

            <span className="text-sm text-slate-400">
              {status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}