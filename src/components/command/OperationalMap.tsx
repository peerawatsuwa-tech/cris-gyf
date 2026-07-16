import { useMemo, useState } from "react";
import {
  Anchor,
  Building2,
  MapPinned,
  Navigation,
  Package,
  ShipWheel,
  Wrench,
  X,
} from "lucide-react";
import { useFleet } from "@/context/FleetContext";
import type { ReadinessLevel, Ship } from "@/types/ship";

type LocationType =
  | "ฐานหลัก"
  | "ท่าจอดเรือ"
  | "จุดจอดชั่วคราว"
  | "อู่เรือ"
  | "หน่วยสนับสนุน"
  | "ฐานส่งกำลังบำรุง";

interface OperationalLocation {
  id: string;
  command: "ทรภ.1" | "ทรภ.2" | "ทรภ.3";
  name: string;
  province: string;
  sea: string;
  type: LocationType;

  // ตำแหน่งจริงเชิงแผนภาพบนแผนที่ประเทศไทย
  x: number;
  y: number;

  // ตำแหน่งป้ายข้อความ เพื่อไม่ให้ชื่อทับกัน
  labelX: number;
  labelY: number;
  labelAlign: "start" | "end";
  count: number;
}

interface LocationWithShips extends OperationalLocation {
  ships: Ship[];
}

const locations: OperationalLocation[] = [
  // ทรภ.1 — พื้นที่อ่าวไทยตอนบนและภาคตะวันออก
  {
    id: "ajpr",
    command: "ทรภ.1",
    name: "อจปร.",
    province: "สมุทรปราการ",
    sea: "อ่าวไทยตอนบน",
    type: "อู่เรือ",
    x: 39,
    y: 41,
    labelX: 67,
    labelY: 31,
    labelAlign: "start",
    count: 2,
  },
  {
    id: "bali-hai",
    command: "ทรภ.1",
    name: "แหลมบาลีฮาย",
    province: "ชลบุรี",
    sea: "อ่าวไทยตอนบน",
    type: "ท่าจอดเรือ",
    x: 43,
    y: 47,
    labelX: 70,
    labelY: 38,
    labelAlign: "start",
    count: 2,
  },
  {
    id: "sattahip",
    command: "ทรภ.1",
    name: "สัตหีบ",
    province: "ชลบุรี",
    sea: "อ่าวไทยตอนบน",
    type: "ฐานหลัก",
    x: 47,
    y: 50,
    labelX: 73,
    labelY: 45,
    labelAlign: "start",
    count: 8,
  },
  {
    id: "mrb-sattahip",
    command: "ทรภ.1",
    name: "มรภ.ฐท.สส.",
    province: "ชลบุรี",
    sea: "อ่าวไทยตอนบน",
    type: "หน่วยสนับสนุน",
    x: 40,
    y: 47,
    labelX: 23,
    labelY: 39,
    labelAlign: "end",
    count: 2,
  },
  {
    id: "thapon",
    command: "ทรภ.1",
    name: "ถปน.",
    province: "ชลบุรี",
    sea: "อ่าวไทยตอนบน",
    type: "หน่วยสนับสนุน",
    x: 43,
    y: 51,
    labelX: 23,
    labelY: 48,
    labelAlign: "end",
    count: 2,
  },
  {
    id: "marine-7",
    command: "ทรภ.1",
    name: "พัน ร.7",
    province: "ระยอง",
    sea: "อ่าวไทยตะวันออก",
    type: "หน่วยสนับสนุน",
    x: 52,
    y: 52,
    labelX: 76,
    labelY: 53,
    labelAlign: "start",
    count: 2,
  },
  {
    id: "trat",
    command: "ทรภ.1",
    name: "ฐตร.",
    province: "ตราด",
    sea: "อ่าวไทยตะวันออก",
    type: "ฐานส่งกำลังบำรุง",
    x: 59,
    y: 55,
    labelX: 82,
    labelY: 61,
    labelAlign: "start",
    count: 2,
  },
  {
    id: "bang-saphan",
    command: "ทรภ.1",
    name: "บางสะพาน",
    province: "ประจวบคีรีขันธ์",
    sea: "อ่าวไทยตอนบน",
    type: "จุดจอดชั่วคราว",
    x: 38,
    y: 57,
    labelX: 19,
    labelY: 56,
    labelAlign: "end",
    count: 2,
  },

  // ทรภ.2 — อ่าวไทยตอนกลางและตอนล่าง
  {
    id: "samui",
    command: "ทรภ.2",
    name: "สมุย",
    province: "สุราษฎร์ธานี",
    sea: "อ่าวไทยตอนกลาง",
    type: "ท่าจอดเรือ",
    x: 49,
    y: 68,
    labelX: 76,
    labelY: 68,
    labelAlign: "start",
    count: 4,
  },
  {
    id: "songkhla",
    command: "ทรภ.2",
    name: "สงขลา",
    province: "สงขลา",
    sea: "อ่าวไทยตอนล่าง",
    type: "ฐานหลัก",
    x: 46,
    y: 86,
    labelX: 75,
    labelY: 87,
    labelAlign: "start",
    count: 5,
  },

  // ทรภ.3 — ฝั่งทะเลอันดามัน
  {
    id: "phangnga",
    command: "ทรภ.3",
    name: "พังงา",
    province: "พังงา",
    sea: "ทะเลอันดามัน",
    type: "ฐานหลัก",
    x: 25,
    y: 66,
    labelX: 12,
    labelY: 63,
    labelAlign: "end",
    count: 3,
  },
  {
    id: "phuket",
    command: "ทรภ.3",
    name: "ท่าจอดเรือภูเก็ต",
    province: "ภูเก็ต",
    sea: "ทะเลอันดามัน",
    type: "ท่าจอดเรือ",
    x: 24,
    y: 72,
    labelX: 10,
    labelY: 73,
    labelAlign: "end",
    count: 4,
  },
  {
    id: "langu",
    command: "ทรภ.3",
    name: "ละงู",
    province: "สตูล",
    sea: "ทะเลอันดามันตอนล่าง",
    type: "ท่าจอดเรือ",
    x: 33,
    y: 88,
    labelX: 17,
    labelY: 90,
    labelAlign: "end",
    count: 2,
  },
];

const statusColor: Record<ReadinessLevel, string> = {
  Y: "#34d399",
  Q: "#fbbf24",
  N: "#f43f5e",
};

const statusText: Record<ReadinessLevel, string> = {
  Y: "พร้อม",
  Q: "มีข้อจำกัด",
  N: "ไม่พร้อม",
};

const equipmentText = {
  Operational: "พร้อม",
  Limited: "มีข้อจำกัด",
  "Not Ready": "ไม่พร้อม",
} as const;

const locationIcon = {
  ฐานหลัก: Building2,
  ท่าจอดเรือ: Anchor,
  จุดจอดชั่วคราว: Navigation,
  อู่เรือ: Wrench,
  หน่วยสนับสนุน: ShipWheel,
  ฐานส่งกำลังบำรุง: Package,
};

function assignShips(fleet: Ship[]): LocationWithShips[] {
  let cursor = 0;

  return locations.map((location) => {
    const ships = fleet.slice(cursor, cursor + location.count);
    cursor += location.count;

    return {
      ...location,
      ships,
    };
  });
}

function statusCount(ships: Ship[], level: ReadinessLevel) {
  return ships.filter((ship) => ship.readiness === level).length;
}

function locationDominantStatus(ships: Ship[]): ReadinessLevel {
  if (ships.some((ship) => ship.readiness === "N")) return "N";
  if (ships.some((ship) => ship.readiness === "Q")) return "Q";
  return "Y";
}

function readinessPercent(ship: Ship) {
  const equipmentValues = Object.values(ship.equipment).map((status) =>
    status === "Operational" ? 100 : status === "Limited" ? 70 : 25,
  );

  const crew =
    ship.authorizedCrew > 0
      ? Math.min(100, (ship.crew / ship.authorizedCrew) * 100)
      : 0;

  return Math.round(
    (crew + equipmentValues.reduce((sum, value) => sum + value, 0)) /
      (equipmentValues.length + 1),
  );
}

export default function OperationalMap() {
  const { fleet } = useFleet();

  const operationalLocations = useMemo(() => assignShips(fleet), [fleet]);

  const [selectedLocationId, setSelectedLocationId] = useState(
    operationalLocations[0]?.id ?? "",
  );
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);

  const selectedLocation =
    operationalLocations.find((item) => item.id === selectedLocationId) ??
    operationalLocations[0];

  const selectedShip =
    fleet.find((ship) => ship.id === selectedShipId) ?? null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/30">
      <header className="flex flex-col gap-3 border-b border-slate-800 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
            <MapPinned className="h-4 w-4" />
            ภาพพื้นที่การปฏิบัติการของกองเรือยามฝั่ง
          </div>

          <h2 className="mt-2 text-xl font-bold text-white">
            ภาพรวมการวางกำลังทั้งฝั่งอ่าวไทยและทะเลอันดามัน
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            ปรับตำแหน่งตามภาพรายงานประจำวัน และเยื้องจุดที่อยู่ใกล้กันเพื่อให้อ่านง่าย
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          {(["Y", "Q", "N"] as ReadinessLevel[]).map((level) => (
            <span
              key={level}
              className="flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-slate-300"
            >
              <i
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColor[level] }}
              />
              {statusText[level]} ({level})
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-6 p-6 2xl:grid-cols-[minmax(0,1.75fr),minmax(380px,1fr)]">
        <div className="relative min-h-[820px] overflow-hidden rounded-2xl border border-sky-900/60 bg-[radial-gradient(circle_at_55%_35%,rgba(14,116,144,0.18),transparent_45%),linear-gradient(145deg,#020617,#061426_55%,#020617)]">
          <div className="absolute left-5 top-5 z-10 rounded-xl border border-sky-900/70 bg-slate-950/88 px-4 py-3 backdrop-blur">
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400">
              COMMON OPERATIONAL PICTURE
            </p>
            <p className="mt-1 text-sm text-slate-300">
              คลิกจุดปฏิบัติการเพื่อดูเรือในพื้นที่
            </p>
          </div>

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="แผนที่ประเทศไทยและพื้นที่ปฏิบัติการสาธิต"
          >
            <defs>
              <filter id="map-marker-glow">
                <feGaussianBlur stdDeviation="0.75" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* แผนที่จริงแบบออฟไลน์ ไม่เรียกใช้บริการภายนอก */}
            {/*
              Crop แผนที่ให้เหลือเฉพาะแนวพื้นที่ปฏิบัติการ:
              ขอบบนเริ่มบริเวณสมุทรปราการ (อจปร.)
              ขอบล่างสิ้นสุดบริเวณสตูล (ละงู)
            */}
            <image
              href="/operational-map-thailand.svg"
              x="-23"
              y="-38"
              width="146"
              height="174"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.97"
            />

            <text
              x="82"
              y="13"
              fill="#38bdf8"
              fontSize="3.3"
              fontWeight="800"
            >
              อ่าวไทย
            </text>

            <text
              x="5"
              y="52"
              fill="#38bdf8"
              fontSize="3.3"
              fontWeight="800"
            >
              ทะเลอันดามัน
            </text>

            {operationalLocations.map((location) => {
              const selected = location.id === selectedLocation?.id;
              const dominantStatus = locationDominantStatus(location.ships);
              const lineEndX =
                location.labelAlign === "start"
                  ? location.labelX - 1.2
                  : location.labelX + 1.2;

              return (
                <g key={location.id}>
                  <line
                    x1={location.x}
                    y1={location.y}
                    x2={lineEndX}
                    y2={location.labelY - 0.4}
                    stroke={selected ? "#e0f2fe" : "#64748b"}
                    strokeWidth={selected ? "0.48" : "0.28"}
                    strokeDasharray={selected ? "0" : "1 1"}
                    opacity={selected ? "0.95" : "0.76"}
                  />

                  <g
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedLocationId(location.id);
                      setSelectedShipId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedLocationId(location.id);
                        setSelectedShipId(null);
                      }
                    }}
                  >
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r={selected ? "2.25" : "1.62"}
                      fill="#061426"
                      stroke={selected ? "#ffffff" : "#7dd3fc"}
                      strokeWidth={selected ? "0.62" : "0.38"}
                      filter="url(#map-marker-glow)"
                    />

                    <circle
                      cx={location.x}
                      cy={location.y}
                      r="0.70"
                      fill={statusColor[dominantStatus]}
                      stroke="#020617"
                      strokeWidth="0.25"
                    />

                    <circle
                      cx={location.x + 1.48}
                      cy={location.y - 1.40}
                      r="0.94"
                      fill="#071426"
                      stroke="#7dd3fc"
                      strokeWidth="0.28"
                    />

                    <text
                      x={location.x + 1.48}
                      y={location.y - 1.08}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="1.02"
                      fontWeight="900"
                    >
                      {location.ships.length}
                    </text>

                    <title>
                      {`${location.name} · ${location.command} · ${location.ships.length} ลำ`}
                    </title>
                  </g>

                  <text
                    x={location.labelX}
                    y={location.labelY}
                    textAnchor={location.labelAlign}
                    fill={selected ? "#ffffff" : "#e2e8f0"}
                    fontSize={selected ? "1.95" : "1.68"}
                    fontWeight="900"
                  >
                    {location.name}
                  </text>

                  <text
                    x={location.labelX}
                    y={location.labelY + 2.25}
                    textAnchor={location.labelAlign}
                    fill="#7dd3fc"
                    fontSize="1.25"
                  >
                    {location.command} · {location.ships.length} ลำ
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs text-slate-400">
            <Navigation className="h-3.5 w-3.5 text-sky-400" />
            จุดแสดงผลเป็นข้อมูลสาธิต ไม่ใช่พิกัดปฏิบัติการจริง
          </div>
        </div>

        <aside className="space-y-4">
          {selectedShip ? (
            <article className="rounded-2xl border border-sky-800 bg-slate-950/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-sky-400">
                    ข้อมูลเรือสรุป
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    {selectedShip.hullNumber}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedShip.shipClass} · {selectedLocation?.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedShipId(null)}
                  className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="ปิดข้อมูลเรือ"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">สถานะ</p>
                  <p
                    className="mt-2 text-xl font-black"
                    style={{ color: statusColor[selectedShip.readiness] }}
                  >
                    {statusText[selectedShip.readiness]} (
                    {selectedShip.readiness})
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">
                    ความพร้อมโดยประมาณ
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {readinessPercent(selectedShip)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm font-bold text-white">กำลังพล</p>
                <p className="mt-2 text-sm text-slate-300">
                  บรรจุ {selectedShip.crew} / {selectedShip.authorizedCrew} นาย
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedShip.equipment).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2"
                  >
                    <span className="text-slate-400">{key.toUpperCase()}</span>
                    <span
                      className={
                        value === "Operational"
                          ? "text-emerald-300"
                          : value === "Limited"
                            ? "text-amber-300"
                            : "text-rose-300"
                      }
                    >
                      {equipmentText[value]}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ) : selectedLocation ? (
            <article className="rounded-2xl border border-slate-800 bg-slate-950/75 p-5">
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = locationIcon[selectedLocation.type];

                  return (
                    <div className="rounded-xl bg-sky-950 p-3 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  );
                })()}

                <div>
                  <p className="text-xs font-semibold text-sky-400">
                    {selectedLocation.command}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    {selectedLocation.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedLocation.province} · {selectedLocation.type}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {(["Y", "Q", "N"] as ReadinessLevel[]).map((level) => (
                  <div
                    key={level}
                    className="rounded-xl bg-slate-900 p-3 text-center"
                  >
                    <p
                      className="text-xl font-black"
                      style={{ color: statusColor[level] }}
                    >
                      {statusCount(selectedLocation.ships, level)}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {statusText[level]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 max-h-[440px] space-y-2 overflow-y-auto pr-1">
                {selectedLocation.ships.map((ship) => (
                  <button
                    key={ship.id}
                    type="button"
                    onClick={() => setSelectedShipId(ship.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left transition hover:border-sky-700 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: statusColor[ship.readiness] }}
                      />

                      <div>
                        <p className="font-bold text-white">
                          {ship.hullNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ship.shipClass}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-xs font-semibold"
                      style={{ color: statusColor[ship.readiness] }}
                    >
                      {statusText[ship.readiness]}
                    </span>
                  </button>
                ))}
              </div>
            </article>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3 2xl:grid-cols-1">
            {(["ทรภ.1", "ทรภ.2", "ทรภ.3"] as const).map((command) => {
              const commandShips = operationalLocations
                .filter((item) => item.command === command)
                .flatMap((item) => item.ships);

              return (
                <div
                  key={command}
                  className="rounded-xl border border-slate-800 bg-slate-950/65 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{command}</p>
                    <p className="text-xl font-black text-sky-300">
                      {commandShips.length} ลำ
                    </p>
                  </div>

                  <div className="mt-3 flex gap-3 text-xs">
                    <span className="text-emerald-300">
                      Y {statusCount(commandShips, "Y")}
                    </span>
                    <span className="text-amber-300">
                      Q {statusCount(commandShips, "Q")}
                    </span>
                    <span className="text-rose-300">
                      N {statusCount(commandShips, "N")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800 bg-slate-950/50 px-6 py-3 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-sky-500" />
          ฐานหลัก
        </span>

        <span className="flex items-center gap-2">
          <Anchor className="h-3.5 w-3.5 text-sky-500" />
          ท่าจอดเรือ
        </span>

        <span className="flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5 text-sky-500" />
          จุดจอดชั่วคราว
        </span>

        <span className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 text-sky-500" />
          อู่เรือ
        </span>

        <span className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-sky-500" />
          ฐานส่งกำลังบำรุง
        </span>
      </footer>
    </section>
  );
}
