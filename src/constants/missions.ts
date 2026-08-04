export const ACTIVE_MISSIONS = [
  { id: "M1", name: "ลาดตระเวน (Patrol)", shortName: "Patrol" },
  { id: "M2", name: "ตรวจค้น (Boarding)", shortName: "Boarding" },
  { id: "M4", name: "ค้นหาและช่วยเหลือผู้ประสบภัย (Search and Rescue)", shortName: "Search and Rescue (SAR)" },
] as const;

export type ActiveMissionId = (typeof ACTIVE_MISSIONS)[number]["id"];

export const ACTIVE_MISSION_IDS = new Set<string>(
  ACTIVE_MISSIONS.map((mission) => mission.id),
);

export function getMissionDisplayName(id: string, fallback: string) {
  return ACTIVE_MISSIONS.find((mission) => mission.id === id)?.name ?? fallback;
}

export function getMissionShortName(id: string, fallback: string) {
  return ACTIVE_MISSIONS.find((mission) => mission.id === id)?.shortName ?? fallback;
}

const engineMissionNameMap: Record<string, string> = {
  "การแสดงกำลังทางทะเล": "ลาดตระเวน",
  "การบังคับใช้กฎหมายทางทะเล": "ตรวจค้น",
  "การค้นหาและช่วยเหลือ": "ค้นหาและช่วยเหลือผู้ประสบภัย",
};

export function normalizeEngineMissionName(name: string) {
  return engineMissionNameMap[name] ?? name;
}
