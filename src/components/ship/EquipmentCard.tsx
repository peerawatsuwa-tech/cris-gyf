import type {
  CurrentEquipmentStatus,
  Ship,
  ShipCurrentReadiness,
} from "@/types/ship";

interface Props {
  ship: Ship;
  onEquipmentChange?: (
    patch: Partial<ShipCurrentReadiness>,
  ) => void;
}

const BASE_OPTIONS: Array<{
  value: Exclude<CurrentEquipmentStatus, "Not Installed">;
  label: string;
}> = [
  { value: null, label: "รอการประเมิน" },
  { value: "Operational", label: "Operational" },
  { value: "Limited", label: "Limited" },
  { value: "Not Ready", label: "Not Ready" },
];

const rows = [
  { label: "ระบบขับเคลื่อน", key: "propulsion", allowNotInstalled: false },
  { label: "Radar", key: "radar", allowNotInstalled: false },
  { label: "Communication", key: "communication", allowNotInstalled: false },
  { label: "Navigation", key: "navigation", allowNotInstalled: false },
  { label: "Weapon", key: "weapon", allowNotInstalled: false },
  { label: "RHIB", key: "rhib", allowNotInstalled: true },
  { label: "EO / IR", key: "eoir", allowNotInstalled: true },
] satisfies Array<{
  label: string;
  key: keyof Pick<
    ShipCurrentReadiness,
    | "propulsion"
    | "radar"
    | "communication"
    | "navigation"
    | "weapon"
    | "rhib"
    | "eoir"
  >;
  allowNotInstalled: boolean;
}>;

function tone(status: CurrentEquipmentStatus) {
  if (status === "Operational") return "text-emerald-400";
  if (status === "Limited") return "text-amber-400";
  if (status === "Not Ready") return "text-rose-400";
  if (status === "Not Installed") return "text-violet-300";
  return "text-slate-400";
}

export default function EquipmentCard({ ship, onEquipmentChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h3 className="text-lg font-semibold text-white">
        สถานะปัจจุบันของระบบ (Current Readiness)
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        คะแนน Communication จาก Excel เป็นข้อมูลอ้างอิงเท่านั้น:
        {" "}
        {ship.source.communicationReadinessReference === null
          ? "ไม่มีข้อมูล"
          : `${(ship.source.communicationReadinessReference * 100).toFixed(1)}%`}
      </p>

      <div className="mt-6 space-y-4">
        {rows.map((row) => {
          const status = ship.currentReadiness[row.key];
          const options = row.allowNotInstalled
            ? [
                ...BASE_OPTIONS,
                { value: "Not Installed" as const, label: "Not Installed" },
              ]
            : BASE_OPTIONS;
          return (
            <label
              key={row.key}
              className="flex items-center justify-between gap-4"
            >
              <span className="w-40 text-slate-300">{row.label}</span>
              <select
                aria-label={row.label}
                value={status ?? ""}
                onChange={(event) =>
                  onEquipmentChange?.({
                    [row.key]:
                      event.target.value === ""
                        ? null
                        : (event.target.value as CurrentEquipmentStatus),
                  })
                }
                className={`w-48 rounded-lg border border-slate-700 bg-slate-900 p-2 font-medium ${tone(status)}`}
              >
                {options.map((option) => (
                  <option key={option.label} value={option.value ?? ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </div>
  );
}
