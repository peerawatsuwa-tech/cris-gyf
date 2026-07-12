import { useEffect, useState } from "react";

import type {
  Ship,
  EquipmentStatus,
} from "@/types/ship";

interface Props {
  ship: Ship;
  onEquipmentChange?: (
    equipment: Ship["equipment"]
  ) => void;
}

const STATUS_OPTIONS: EquipmentStatus[] = [
  "Operational",
  "Limited",
  "Not Ready",
];

const getColor = (status: EquipmentStatus) => {
  switch (status) {
    case "Operational":
      return "text-emerald-400";

    case "Limited":
      return "text-yellow-400";

    case "Not Ready":
      return "text-red-400";

    default:
      return "text-slate-400";
  }
};

export default function EquipmentCard({
  ship,
  onEquipmentChange,
}: Props) {

  const [equipment, setEquipment] =
  useState<Ship["equipment"]>(ship.equipment);

  useEffect(() => {
    setEquipment(ship.equipment);
  }, [ship]);

  function updateEquipment(
    key: keyof Ship["equipment"],
    value: EquipmentStatus
  ) {

    const updated = {
      ...equipment,
      [key]: value,
    };

    setEquipment(updated);

    onEquipmentChange?.(updated);

  }

  const rows: {
  label: string;
  key: keyof Ship["equipment"];
}[] = [
    {
      label: "Radar",
      key: "radar",
    },
    {
      label: "Communication",
      key: "communication",
    },
    {
      label: "Weapon",
      key: "weapon",
    },
    {
      label: "Navigation",
      key: "navigation",
    },
    {
      label: "EO / IR",
      key: "eoir",
    },
    {
      label: "RHIB",
      key: "rhib",
    },
  ];

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">

        อุปกรณ์หลัก (Equipment)

      </h3>

      <div className="mt-6 space-y-4">

        {rows.map((row) => (

          <div
            key={row.key}
            className="flex items-center justify-between gap-4"
          >

            <span className="w-36 text-slate-300">

              {row.label}

            </span>

            <select

              value={equipment[row.key]}

              onChange={(e) =>
                updateEquipment(
                  row.key,
                  e.target.value as EquipmentStatus
                )
              }

              className={`w-44 rounded-lg border border-slate-700 bg-slate-900 p-2 font-medium ${getColor(
                equipment[row.key]
              )}`}

            >

              {STATUS_OPTIONS.map((status) => (

                <option
                  key={status}
                  value={status}
                >

                  {status}

                </option>

              ))}

            </select>

          </div>

        ))}

      </div>

    </div>

  );

}