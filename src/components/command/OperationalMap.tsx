import {
  ShipWheel,
  Anchor,
  MapPinned,
} from "lucide-react";

const ships = [
  {
    name: "ต.991",
    area: "อ่าวไทย",
    status: "พร้อม",
    color: "bg-emerald-500",
  },
  {
    name: "ต.228",
    area: "อ่าวไทย",
    status: "พร้อม",
    color: "bg-emerald-500",
  },
  {
    name: "ต.235",
    area: "อ่าวไทย",
    status: "พร้อมจำกัด",
    color: "bg-amber-500",
  },
  {
    name: "ต.113",
    area: "อ่าวไทย",
    status: "ซ่อมทำ",
    color: "bg-orange-500",
  },
  {
    name: "ต.992",
    area: "อ่าวไทย",
    status: "ระงับใช้",
    color: "bg-red-600",
  },
];

export default function OperationalMap() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

        <div>

          <h2 className="text-lg font-bold text-white">

            แผนที่สถานการณ์

          </h2>

          <p className="text-sm text-slate-400">

            ภาพรวมพื้นที่ปฏิบัติการของกองเรือยามฝั่ง

          </p>

        </div>

        <MapPinned className="h-6 w-6 text-sky-400" />

      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[2fr,1fr]">

        {/* Map */}

        <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950">

          <div className="text-center">

            <Anchor className="mx-auto mb-4 h-12 w-12 text-sky-500" />

            <h3 className="text-xl font-bold text-white">

              แผนที่ประเทศไทย

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Build ถัดไปจะแสดงแผนที่พร้อมตำแหน่งเรือจริง

            </p>

          </div>

        </div>

        {/* Fleet */}

        <div className="space-y-3">

          {ships.map((ship) => (

            <div
              key={ship.name}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-sky-700"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <ShipWheel className="h-5 w-5 text-sky-400" />

                  <div>

                    <p className="font-semibold text-white">

                      {ship.name}

                    </p>

                    <p className="text-xs text-slate-500">

                      {ship.area}

                    </p>

                  </div>

                </div>

                <span
                  className={`h-3 w-3 rounded-full ${ship.color}`}
                />

              </div>

              <div className="mt-3">

                <p className="text-xs text-slate-500">

                  สถานะ

                </p>

                <p className="font-semibold text-white">

                  {ship.status}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}