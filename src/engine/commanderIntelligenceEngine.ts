import type {
  EquipmentStatus,
  ReadinessLevel,
  Ship,
} from "@/types/ship";

export type MissionId =
  | "M1"
  | "M2"
  | "M3"
  | "M4"
  | "M5"
  | "M6"
  | "M7"
  | "M8";

type EquipmentKey = keyof Ship["equipment"];

export interface MissionImpactResult {
  id: MissionId;
  title: string;
  shortTitle: string;
  score: number;
  status: ReadinessLevel;
  affectedShips: string[];
  causes: string[];
  recoveryPotential: number;
}

export interface FleetRiskItem {
  shipId: string;
  hullNumber: string;
  squadron: string;
  readiness: ReadinessLevel;
  riskScore: number;
  riskLevel: "วิกฤต" | "สูง" | "ปานกลาง";
  primaryIssue: string;
  missionImpact: MissionId[];
  crewPercent: number;
}

export interface RecoveryAction {
  id: string;
  title: string;
  affectedShips: number;
  fleetGain: number;
  missionGains: Array<{
    mission: MissionId;
    gain: number;
  }>;
  reason: string;
}

export interface CommanderIntelligenceSnapshot {
  missions: MissionImpactResult[];
  fleetRisks: FleetRiskItem[];
  recoveryActions: RecoveryAction[];
  overallRiskScore: number;
  overallRiskLevel: "สูง" | "ปานกลาง" | "ต่ำ";
  executiveAssessment: string;
}

interface MissionDefinition {
  id: MissionId;
  title: string;
  shortTitle: string;
  equipment: EquipmentKey[];
  crewWeight: number;
}

const missionDefinitions: MissionDefinition[] = [
  {
    id: "M1",
    title: "การแสดงกำลังทางทะเล",
    shortTitle: "Maritime Presence",
    equipment: ["communication", "navigation"],
    crewWeight: 0.35,
  },
  {
    id: "M2",
    title: "การบังคับใช้กฎหมายทางทะเล",
    shortTitle: "Maritime Law Enforcement",
    equipment: ["radar", "communication", "rhib"],
    crewWeight: 0.3,
  },
  {
    id: "M3",
    title: "การรักษาความมั่นคงทางทะเล",
    shortTitle: "Maritime Security",
    equipment: ["radar", "communication", "weapon", "eoir"],
    crewWeight: 0.25,
  },
  {
    id: "M4",
    title: "การค้นหาและช่วยเหลือ",
    shortTitle: "Search and Rescue",
    equipment: ["navigation", "communication", "rhib"],
    crewWeight: 0.3,
  },
  {
    id: "M5",
    title: "การตระหนักรู้สถานการณ์ทางทะเล",
    shortTitle: "Maritime Domain Awareness",
    equipment: ["radar", "communication", "eoir"],
    crewWeight: 0.2,
  },
  {
    id: "M6",
    title: "การคุ้มกันและป้องกัน",
    shortTitle: "Maritime Escort",
    equipment: ["weapon", "radar", "communication", "navigation"],
    crewWeight: 0.25,
  },
  {
    id: "M7",
    title: "การตรวจค้นและยึดเรือ",
    shortTitle: "VBSS",
    equipment: ["rhib", "communication", "weapon"],
    crewWeight: 0.4,
  },
  {
    id: "M8",
    title: "การป้องกันและการรบทางทะเล",
    shortTitle: "Maritime Defense",
    equipment: ["weapon", "radar", "communication", "eoir", "navigation"],
    crewWeight: 0.25,
  },
];

const equipmentScore: Record<EquipmentStatus, number> = {
  Operational: 100,
  Limited: 68,
  "Not Ready": 18,
};

const equipmentLabel: Record<EquipmentKey, string> = {
  radar: "ระบบเรดาร์",
  communication: "ระบบสื่อสาร",
  weapon: "ระบบอาวุธ",
  navigation: "ระบบเดินเรือ",
  eoir: "ระบบ EO/IR",
  rhib: "RHIB",
};

const dependencyMap: Record<EquipmentKey, MissionId[]> = {
  radar: ["M2", "M3", "M5", "M6", "M8"],
  communication: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"],
  weapon: ["M3", "M6", "M7", "M8"],
  navigation: ["M1", "M4", "M6", "M8"],
  eoir: ["M3", "M5", "M8"],
  rhib: ["M2", "M4", "M7"],
};

function readinessModifier(level: ReadinessLevel) {
  if (level === "Y") return 1;
  if (level === "Q") return 0.88;
  return 0.62;
}

function statusFromScore(score: number): ReadinessLevel {
  if (score >= 85) return "Y";
  if (score >= 60) return "Q";
  return "N";
}

function calculateShipMissionScore(
  ship: Ship,
  mission: MissionDefinition,
): number {
  const crewPercent =
    ship.authorizedCrew > 0
      ? Math.min(100, (ship.crew / ship.authorizedCrew) * 100)
      : 0;

  const equipmentAverage =
    mission.equipment.reduce(
      (sum, key) => sum + equipmentScore[ship.equipment[key]],
      0,
    ) / mission.equipment.length;

  return (
    (crewPercent * mission.crewWeight +
      equipmentAverage * (1 - mission.crewWeight)) *
    readinessModifier(ship.readiness)
  );
}

function calculateMissionImpact(
  fleet: Ship[],
  mission: MissionDefinition,
): MissionImpactResult {
  const shipScores = fleet.map((ship) => ({
    ship,
    score: calculateShipMissionScore(ship, mission),
  }));

  const score =
    shipScores.length > 0
      ? shipScores.reduce((sum, item) => sum + item.score, 0) /
        shipScores.length
      : 0;

  const affected = shipScores
    .filter((item) => item.score < 75)
    .sort((a, b) => a.score - b.score);

  const causeCounter = new Map<string, number>();

  affected.forEach(({ ship }) => {
    mission.equipment.forEach((key) => {
      const status = ship.equipment[key];

      if (status !== "Operational") {
        const label = `${equipmentLabel[key]}${
          status === "Not Ready" ? "ไม่พร้อมใช้งาน" : "พร้อมแบบมีข้อจำกัด"
        }`;

        causeCounter.set(label, (causeCounter.get(label) ?? 0) + 1);
      }
    });

    const crewPercent =
      ship.authorizedCrew > 0
        ? (ship.crew / ship.authorizedCrew) * 100
        : 0;

    if (crewPercent < 90) {
      causeCounter.set(
        "กำลังพลต่ำกว่าร้อยละ 90",
        (causeCounter.get("กำลังพลต่ำกว่าร้อยละ 90") ?? 0) + 1,
      );
    }
  });

  const causes = [...causeCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => `${label} ${count} ลำ`);

  return {
    id: mission.id,
    title: mission.title,
    shortTitle: mission.shortTitle,
    score: Math.round(score),
    status: statusFromScore(score),
    affectedShips: affected.slice(0, 5).map((item) => item.ship.hullNumber),
    causes,
    recoveryPotential: Math.max(0, Math.min(15, Math.round((100 - score) * 0.35))),
  };
}

function calculateFleetRisk(ship: Ship): FleetRiskItem {
  const crewPercent =
    ship.authorizedCrew > 0
      ? Math.round((ship.crew / ship.authorizedCrew) * 100)
      : 0;

  let riskScore =
    ship.readiness === "N" ? 45 : ship.readiness === "Q" ? 22 : 0;

  if (crewPercent < 80) riskScore += 30;
  else if (crewPercent < 90) riskScore += 16;
  else if (crewPercent < 95) riskScore += 7;

  const issues: Array<{
    key: EquipmentKey;
    label: string;
    penalty: number;
  }> = [];

  (
    Object.entries(ship.equipment) as Array<
      [EquipmentKey, EquipmentStatus]
    >
  ).forEach(([key, status]) => {
    if (status === "Not Ready") {
      riskScore += 32;
      issues.push({
        key,
        label: `${equipmentLabel[key]}ไม่พร้อมใช้งาน`,
        penalty: 32,
      });
    } else if (status === "Limited") {
      riskScore += 14;
      issues.push({
        key,
        label: `${equipmentLabel[key]}พร้อมแบบมีข้อจำกัด`,
        penalty: 14,
      });
    }
  });

  const primaryIssue =
    issues.sort((a, b) => b.penalty - a.penalty)[0]?.label ??
    (crewPercent < 90
      ? "กำลังพลต่ำกว่าเกณฑ์"
      : "ติดตามสถานะความพร้อมต่อเนื่อง");

  const missionImpact = [
    ...new Set(
      issues.flatMap((issue) => dependencyMap[issue.key]),
    ),
  ];

  const boundedRisk = Math.min(100, Math.round(riskScore));

  return {
    shipId: ship.id,
    hullNumber: ship.hullNumber,
    squadron: ship.squadron,
    readiness: ship.readiness,
    riskScore: boundedRisk,
    riskLevel:
      boundedRisk >= 75 ? "วิกฤต" : boundedRisk >= 45 ? "สูง" : "ปานกลาง",
    primaryIssue,
    missionImpact,
    crewPercent,
  };
}

function buildRecoveryActions(
  fleet: Ship[],
  missions: MissionImpactResult[],
): RecoveryAction[] {
  const equipmentIssues = new Map<
    EquipmentKey,
    {
      count: number;
      notReady: number;
      limited: number;
    }
  >();

  (
    [
      "radar",
      "communication",
      "weapon",
      "navigation",
      "eoir",
      "rhib",
    ] as EquipmentKey[]
  ).forEach((key) => {
    equipmentIssues.set(key, {
      count: 0,
      notReady: 0,
      limited: 0,
    });
  });

  fleet.forEach((ship) => {
    (
      Object.entries(ship.equipment) as Array<
        [EquipmentKey, EquipmentStatus]
      >
    ).forEach(([key, status]) => {
      if (status === "Operational") return;

      const current = equipmentIssues.get(key)!;
      current.count += 1;

      if (status === "Not Ready") current.notReady += 1;
      if (status === "Limited") current.limited += 1;
    });
  });

  const actions: RecoveryAction[] = [];

  equipmentIssues.forEach((issue, key) => {
    if (issue.count === 0) return;

    const impactedMissions = dependencyMap[key];

    const missionGains = impactedMissions
      .map((missionId) => {
        const mission = missions.find((item) => item.id === missionId);
        const baseGain =
          issue.notReady * 2.2 + issue.limited * 0.8;

        return {
          mission: missionId,
          gain: Math.max(
            1,
            Math.min(
              12,
              Math.round(
                baseGain *
                  (mission ? Math.max(0.5, (100 - mission.score) / 20) : 1),
              ),
            ),
          ),
        };
      })
      .sort((a, b) => b.gain - a.gain)
      .slice(0, 3);

    actions.push({
      id: key,
      title: `เร่งแก้ไข${equipmentLabel[key]}`,
      affectedShips: issue.count,
      fleetGain: Math.max(
        1,
        Math.min(8, Math.round(issue.notReady * 1.4 + issue.limited * 0.45)),
      ),
      missionGains,
      reason: `${equipmentLabel[key]}กระทบภารกิจ ${impactedMissions.join(
        ", ",
      )} รวม ${issue.count} ลำ`,
    });
  });

  const lowCrewShips = fleet.filter((ship) => {
    const percent =
      ship.authorizedCrew > 0
        ? (ship.crew / ship.authorizedCrew) * 100
        : 0;

    return percent < 90;
  });

  if (lowCrewShips.length > 0) {
    actions.push({
      id: "crew",
      title: "จัดกำลังพลให้ไม่น้อยกว่าร้อยละ 90 ของอัตรา",
      affectedShips: lowCrewShips.length,
      fleetGain: Math.max(1, Math.min(8, Math.round(lowCrewShips.length * 0.25))),
      missionGains: [
        { mission: "M2", gain: Math.min(10, Math.max(2, Math.round(lowCrewShips.length * 0.35))) },
        { mission: "M7", gain: Math.min(10, Math.max(2, Math.round(lowCrewShips.length * 0.4))) },
        { mission: "M4", gain: Math.min(8, Math.max(1, Math.round(lowCrewShips.length * 0.25))) },
      ],
      reason: `มีเรือ ${lowCrewShips.length} ลำที่กำลังพลต่ำกว่าร้อยละ 90`,
    });
  }

  return actions
    .sort(
      (a, b) =>
        b.fleetGain +
        b.missionGains.reduce((sum, item) => sum + item.gain, 0) -
        (a.fleetGain +
          a.missionGains.reduce((sum, item) => sum + item.gain, 0)),
    )
    .slice(0, 5);
}

export function buildCommanderIntelligence(
  fleet: Ship[],
): CommanderIntelligenceSnapshot {
  const missions = missionDefinitions.map((mission) =>
    calculateMissionImpact(fleet, mission),
  );

  const fleetRisks = fleet
    .map(calculateFleetRisk)
    .filter((item) => item.riskScore > 0)
    .sort((a, b) => b.riskScore - a.riskScore);

  const recoveryActions = buildRecoveryActions(fleet, missions);

  const overallRiskScore =
    fleetRisks.length > 0
      ? Math.round(
          fleetRisks
            .slice(0, 10)
            .reduce((sum, item) => sum + item.riskScore, 0) /
            Math.min(10, fleetRisks.length),
        )
      : 0;

  const overallRiskLevel =
    overallRiskScore >= 65
      ? "สูง"
      : overallRiskScore >= 35
        ? "ปานกลาง"
        : "ต่ำ";

  const atRiskMissions = missions.filter(
    (mission) => mission.status !== "Y",
  );

  const executiveAssessment =
    atRiskMissions.length > 0
      ? `ควรเร่งแก้ไข ${recoveryActions[0]?.title ?? "ประเด็นความพร้อมสำคัญ"} เนื่องจากส่งผลต่อ ${atRiskMissions
          .slice(0, 3)
          .map((mission) => mission.id)
          .join(", ")} และเรือความเสี่ยงสูง ${
          fleetRisks.filter((item) => item.riskLevel !== "ปานกลาง").length
        } ลำ`
      : `กองเรือยังคงขีดความสามารถตามภารกิจในระดับพร้อม แต่ควรดำเนินการ ${recoveryActions[0]?.title ?? "ติดตามความพร้อม"} เพื่อเพิ่มความทนทานของกำลังรบ`;

  return {
    missions,
    fleetRisks,
    recoveryActions,
    overallRiskScore,
    overallRiskLevel,
    executiveAssessment,
  };
}
