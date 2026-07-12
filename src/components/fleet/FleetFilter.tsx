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
        ทุกสถานะ
      </option>

      <option value="Y">
        พร้อมปฏิบัติ
      </option>

      <option value="Q">
        พร้อมบางส่วน
      </option>

      <option value="N">
        ไม่พร้อม
      </option>

    </select>

  );

}