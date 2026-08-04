interface FleetFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function FleetFilter({
  value,
  onChange,
}: FleetFilterProps) {

  return (

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}

      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/70
        px-4
        py-3
        text-white
        outline-none
        transition
        focus:border-sky-500
      "
    >

      <option value="all">
        ทั้งหมด (All)
      </option>

      <option value="Y">
        {UI.status.Y}
      </option>

      <option value="Q">
        {UI.status.Q}
      </option>

      <option value="N">
        {UI.status.N}
      </option>

      <option value="U">
        {UI.status.U}
      </option>

    </select>

  );

}
import { UI } from "@/constants/uiText";
