import type { ActiveMissionId } from "@/constants/missions";
import {
  evaluateMission,
  evaluateShip,
  missingCurrentFields,
  normalizeMissionLimitation,
  REQUIRED_SYSTEMS,
  type CurrentSystemKey,
  type ReadinessStatus,
} from "@/lib/readinessV027";
import type { Ship } from "@/types/ship";

export type DeficiencyKey = "crew" | "rhib" | "radar" | "critical";

export const SYSTEM_LABELS: Record<CurrentSystemKey, string> = {
  propulsion: "ระบบขับเคลื่อน (Propulsion)",
  radar: "เรดาร์ (Radar)",
  communication: "ระบบสื่อสาร (Communication)",
  navigation: "ระบบเดินเรือ (Navigation)",
  weapon: "ระบบอาวุธ (Weapon)",
  rhib: "RHIB",
  eoir: "EO/IR",
};

export const SYSTEM_KEYS = Object.keys(SYSTEM_LABELS) as CurrentSystemKey[];

export function shipReasons(ship: Ship, missionId?: ActiveMissionId) {
  const result = missionId ? evaluateMission(ship, missionId) : evaluateShip(ship);
  if ("reasons" in result) {
    return result.status === "U" ? result.missing : result.reasons;
  }
  if (result.status === "Y") {
    return ["ข้อมูลขั้นต่ำครบ กำลังพลและระบบที่จำเป็นพร้อมใช้งาน"];
  }
  return [...new Set(result.missions.flatMap((mission) =>
    mission.status === result.status
      ? (mission.status === "U" ? mission.missing : mission.reasons)
      : [],
  ))];
}

export function affectedSystems(ship: Ship, missionId?: ActiveMissionId) {
  const keys = missionId ? REQUIRED_SYSTEMS[missionId] : SYSTEM_KEYS;
  return keys
    .filter((key) => ship.currentReadiness[key] !== "Operational")
    .map((key) => ({ key, label: SYSTEM_LABELS[key], status: ship.currentReadiness[key] }));
}

export function matchesDeficiency(ship: Ship, key: DeficiencyKey) {
  const current = ship.currentReadiness;
  if (key === "crew") {
    return current.crew !== null && current.crew / ship.authorizedCrew < 0.9;
  }
  if (key === "rhib" || key === "radar") {
    return current[key] === "Limited" || current[key] === "Not Ready";
  }
  return SYSTEM_KEYS.some((system) => current[system] === "Not Ready");
}

export function deficiencyValue(ship: Ship, key: DeficiencyKey) {
  if (key === "crew") {
    const crew = ship.currentReadiness.crew;
    const ratio = crew === null ? null : (crew / ship.authorizedCrew) * 100;
    return `${crew ?? "—"}/${ship.authorizedCrew} (${ratio === null ? "—" : ratio.toFixed(1)}%)`;
  }
  if (key === "rhib" || key === "radar") {
    return `${SYSTEM_LABELS[key]}: ${ship.currentReadiness[key] ?? "รอการประเมิน"}`;
  }
  return affectedSystems(ship)
    .filter((item) => item.status === "Not Ready")
    .map((item) => item.label)
    .join(", ");
}

export function deficiencySeverity(ship: Ship, key: DeficiencyKey) {
  if (key === "crew") {
    const ratio = (ship.currentReadiness.crew ?? 0) / ship.authorizedCrew;
    return ratio < 0.75 ? "สูง (High)" : "ปานกลาง (Moderate)";
  }
  const systems = key === "critical" ? affectedSystems(ship) : affectedSystems(ship).filter((item) => item.key === key);
  return systems.some((item) => item.status === "Not Ready") ? "สูง (High)" : "ปานกลาง (Moderate)";
}

export function impactedMissions(ship: Ship) {
  return evaluateShip(ship).missions
    .filter((mission) => mission.status !== "Y")
    .map((mission) => mission.missionName);
}

export function pendingFields(ship: Ship) {
  return missingCurrentFields(ship.currentReadiness);
}

export function missionLimitation(ship: Ship) {
  return normalizeMissionLimitation(ship.currentReadiness.missionLimitations);
}

export function meaningfulDetail(value: string | null | undefined) {
  const normalized = value?.trim();
  if (!normalized || ["-", "--", "—", "N/A", "NA", "NONE", "ไม่มี"].includes(normalized.toUpperCase())) {
    return null;
  }
  return normalized;
}

export function insightText(counts: Record<ReadinessStatus, number>, total: number) {
  const yPercent = total ? (counts.Y / total) * 100 : 0;
  const usablePercent = total ? ((counts.Y + counts.Q) / total) * 100 : 0;
  const parts = [
    yPercent >= 80
      ? "กองเรือส่วนใหญ่พร้อมปฏิบัติภารกิจ"
      : usablePercent >= 80
        ? "กองเรือยังสามารถปฏิบัติภารกิจได้โดยมีข้อจำกัด"
        : "ความสามารถในการจัดกำลังมีข้อจำกัด ต้องพิจารณาเร่งด่วน",
  ];
  if (counts.U > 0) parts.push(`ยังมีเรือรอการประเมินจำนวน ${counts.U} ลำ`);
  if (counts.N > 0) parts.push(`ควรเร่งแก้ไขเรือไม่พร้อมจำนวน ${counts.N} ลำ`);
  return `${parts.join(" · ")} — พร้อมปฏิบัติภารกิจ ${counts.Y} จาก ${total} ลำ (${yPercent.toFixed(1)}%)`;
}

export function latestUpdate(ships: Ship[]) {
  const dates = ships
    .map((ship) => ship.currentReadiness.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort();
  return dates.at(-1) ?? null;
}
