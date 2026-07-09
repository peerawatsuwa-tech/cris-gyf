interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FleetSearch({ value, onChange }: Props) {
  return (
    <input
      className="mb-6 w-full rounded-lg border p-3"
      placeholder="ค้นหาเรือ..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
