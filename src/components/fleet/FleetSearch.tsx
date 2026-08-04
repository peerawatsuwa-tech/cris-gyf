import { Search } from "lucide-react";
import { UI } from "@/constants/uiText";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FleetSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative w-full">

      <Search
        className="
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-slate-500
        "
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={UI.labels.searchShip}
        placeholder="ค้นหาหมายเลขเรือหรือชื่อเรือ (Search Ship)"

        className="
          w-full
          rounded-xl
          border
          border-slate-800
          bg-slate-950/70
          py-3
          pl-12
          pr-4
          text-white
          placeholder:text-slate-500
          outline-none
          transition
          focus:border-sky-500
        "
      />

    </div>
  );
}
