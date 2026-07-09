import type { FleetShip } from '../../types/fleet';

interface Props {
  ship: FleetShip;
}

export default function FleetCard({ ship }: Props) {
  const color = {
    Y: 'bg-green-500',
    Q: 'bg-yellow-500',
    N: 'bg-red-500',
  }[ship.readiness];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full ${color}`} />
        <h2 className="text-xl font-bold">{ship.hullNumber}</h2>
      </div>

      <p className="mt-3">{ship.shipName}</p>
      <p>{ship.squadron}</p>
      <p>{ship.shipClass}</p>

      <div className="mt-4">
        <span className="font-semibold">{ship.status}</span>
      </div>
    </div>
  );
}
