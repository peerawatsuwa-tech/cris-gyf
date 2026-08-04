import { ACTIVE_MISSIONS, type ActiveMissionId } from "@/constants/missions";
import type {
  CurrentEquipmentStatus,
  ReadinessLevel,
  Ship,
  ShipCurrentReadiness,
} from "@/types/ship";

export type ReadinessStatus = ReadinessLevel | "U";
export type CurrentSystemKey =
  | "propulsion"
  | "radar"
  | "communication"
  | "navigation"
  | "weapon"
  | "rhib"
  | "eoir";

export type MissionReadinessResult = {
  missionId: ActiveMissionId;
  missionName: string;
  status: ReadinessStatus;
  missing: string[];
  reasons: string[];
};

const SYSTEM_LABELS: Record<CurrentSystemKey, string> = {
  propulsion: "ระบบขับเคลื่อน",
  radar: "Radar",
  communication: "Communication",
  navigation: "Navigation",
  weapon: "Weapon",
  rhib: "RHIB",
  eoir: "EO/IR",
};

export const REQUIRED_SYSTEMS: Record<ActiveMissionId, CurrentSystemKey[]> = {
  M1: ["propulsion", "radar", "communication", "navigation"],
  M2: ["propulsion", "communication", "navigation", "rhib"],
  M4: ["propulsion", "radar", "communication", "navigation", "rhib"],
};

const EMPTY_MISSION_LIMITATION_VALUES = new Set([
  "-",
  "--",
  "—",
  "N/A",
  "NA",
  "NONE",
  "ไม่มี",
]);

export function normalizeMissionLimitation(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();
  if (
    !normalized ||
    EMPTY_MISSION_LIMITATION_VALUES.has(normalized.toUpperCase())
  ) {
    return null;
  }
  return normalized;
}

export function evaluateMission(
  ship: Ship,
  missionId: ActiveMissionId,
): MissionReadinessResult {
  const mission = ACTIVE_MISSIONS.find((item) => item.id === missionId)!;
  const missing: string[] = [];
  const current = ship.currentReadiness;
  const missionLimitation = normalizeMissionLimitation(
    current.missionLimitations,
  );

  if (current.crew === null) missing.push("กำลังพลปัจจุบัน");
  if (!Number.isFinite(ship.authorizedCrew) || ship.authorizedCrew <= 0) {
    missing.push("กำลังพลตามอัตรา");
  }

  const requiredSystems = REQUIRED_SYSTEMS[missionId];
  for (const key of requiredSystems) {
    if (current[key] === null) missing.push(SYSTEM_LABELS[key]);
    if (current[key] === "Not Installed") {
      missing.push(`${SYSTEM_LABELS[key]} (ไม่ได้ติดตั้ง)`);
    }
  }

  if (missing.length > 0) {
    return {
      missionId,
      missionName: mission.name,
      status: "U",
      missing,
      reasons: ["ข้อมูลขั้นต่ำของภารกิจยังไม่ครบ"],
    };
  }

  const crewRatio = current.crew! / ship.authorizedCrew;
  const requiredStatuses = requiredSystems.map(
    (key) => current[key] as Exclude<CurrentEquipmentStatus, null | "Not Installed">,
  );
  const limitedCount = requiredStatuses.filter(
    (status) => status === "Limited",
  ).length;
  const notReadySystems = requiredSystems.filter(
    (key) => current[key] === "Not Ready",
  );

  if (crewRatio < 0.75) {
    return result(missionId, mission.name, "N", [
      "กำลังพลปัจจุบันต่ำกว่า 75% ของอัตรา",
    ]);
  }
  if (current.propulsion === "Not Ready") {
    return result(missionId, mission.name, "N", [
      "ระบบขับเคลื่อนไม่พร้อม",
    ]);
  }
  if (notReadySystems.length > 0) {
    return result(
      missionId,
      mission.name,
      "N",
      notReadySystems.map((key) => `${SYSTEM_LABELS[key]} ไม่พร้อมและไม่มีข้อมูลวิธีทดแทน`),
    );
  }
  if (
    crewRatio < 0.9 ||
    limitedCount > 1 ||
    missionLimitation !== null
  ) {
    const reasons = [];
    if (crewRatio < 0.9) reasons.push("กำลังพลปัจจุบันอยู่ระหว่าง 75–89%");
    if (limitedCount > 1) reasons.push("ระบบสำคัญเป็น Limited มากกว่า 1 รายการ");
    if (missionLimitation !== null) {
      reasons.push("มีข้อจำกัดในการปฏิบัติภารกิจ");
    }
    return result(missionId, mission.name, "Q", reasons);
  }

  return result(missionId, mission.name, "Y", [
    "ข้อมูลขั้นต่ำครบและผ่านเกณฑ์พร้อม",
  ]);
}

function result(
  missionId: ActiveMissionId,
  missionName: string,
  status: ReadinessLevel,
  reasons: string[],
): MissionReadinessResult {
  return { missionId, missionName, status, missing: [], reasons };
}

export function evaluateShip(ship: Ship) {
  const missions = ACTIVE_MISSIONS.map((mission) =>
    evaluateMission(ship, mission.id),
  );
  const statuses = missions.map((mission) => mission.status);
  const status: ReadinessStatus = statuses.includes("U")
    ? "U"
    : statuses.includes("N")
      ? "N"
      : statuses.includes("Q")
        ? "Q"
        : "Y";
  return { status, missions };
}

export function summarizeFleet(fleet: Ship[]) {
  const shipResults = fleet.map((ship) => ({
    ship,
    ...evaluateShip(ship),
  }));
  const counts = {
    Y: shipResults.filter((item) => item.status === "Y").length,
    Q: shipResults.filter((item) => item.status === "Q").length,
    N: shipResults.filter((item) => item.status === "N").length,
    U: shipResults.filter((item) => item.status === "U").length,
  };
  const missions = ACTIVE_MISSIONS.map((mission) => {
    const results = fleet.map((ship) => ({
      ship,
      result: evaluateMission(ship, mission.id),
    }));
    const distribution = {
      Y: results.filter(({ result }) => result.status === "Y").length,
      Q: results.filter(({ result }) => result.status === "Q").length,
      N: results.filter(({ result }) => result.status === "N").length,
      U: results.filter(({ result }) => result.status === "U").length,
    };
    return {
      ...mission,
      distribution,
      status: distribution.U > 0
        ? ("U" as const)
        : distribution.N > 0
          ? ("N" as const)
          : distribution.Q > 0
            ? ("Q" as const)
            : ("Y" as const),
      results,
    };
  });
  return { counts, missions, shipResults };
}

export function missingCurrentFields(current: ShipCurrentReadiness) {
  const fields: Array<[keyof ShipCurrentReadiness, string]> = [
    ["crew", "กำลังพลปัจจุบัน"],
    ["propulsion", "ระบบขับเคลื่อน"],
    ["radar", "Radar"],
    ["communication", "Communication"],
    ["navigation", "Navigation"],
    ["weapon", "Weapon"],
    ["rhib", "RHIB"],
    ["eoir", "EO/IR"],
    ["updatedAt", "วันที่ปรับปรุงข้อมูล"],
  ];
  return fields
    .filter(([key]) => current[key] === null)
    .map(([, label]) => label);
}

export function statusLabel(status: ReadinessStatus) {
  return {
    Y: "พร้อม",
    Q: "พร้อมแบบมีข้อจำกัด",
    N: "ไม่พร้อม",
    U: "รอการประเมิน",
  }[status];
}
