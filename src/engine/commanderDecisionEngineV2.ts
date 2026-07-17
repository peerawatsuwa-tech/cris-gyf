import { buildCommanderIntelligence } from "@/engine/commanderIntelligenceEngine";
import { evaluateFleetReadiness } from "@/engine/fleetReadinessEngine";
import type {
  CommanderDecisionV2Snapshot,
  DecisionConstraint,
  DecisionPriority,
  RankedCommanderAction,
} from "@/types/commanderDecisionV2";
import type { EquipmentStatus, ReadinessLevel, Ship } from "@/types/ship";

type EquipmentKey = keyof Ship["equipment"];

const equipmentLabels: Record<EquipmentKey, string> = {
  radar: "ระบบเรดาร์",
  communication: "ระบบสื่อสาร",
  weapon: "ระบบอาวุธ",
  navigation: "ระบบเดินเรือ",
  eoir: "ระบบ EO/IR",
  rhib: "RHIB",
};

const missionNames: Record<string, string> = {
  M1: "การแสดงกำลังทางทะเล",
  M2: "การบังคับใช้กฎหมายทางทะเล",
  M3: "การรักษาความมั่นคงทางทะเล",
  M4: "การค้นหาและช่วยเหลือ",
  M5: "การตระหนักรู้สถานการณ์ทางทะเล",
  M6: "การคุ้มกันและป้องกัน",
  M7: "การตรวจค้นและยึดเรือ",
  M8: "การป้องกันและการรบทางทะเล",
};

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

function statusFromScore(score: number): ReadinessLevel {
  if (score >= 85) return "Y";
  if (score >= 60) return "Q";
  return "N";
}

function crewPercent(ship: Ship) {
  if (ship.authorizedCrew <= 0) return 0;
  return clamp(Math.round((ship.crew / ship.authorizedCrew) * 100));
}

function equipmentSeverity(status: EquipmentStatus) {
  if (status === "Not Ready") return 100;
  if (status === "Limited") return 55;
  return 0;
}

function buildConstraints(fleet: Ship[]): DecisionConstraint[] {
  const intelligence = buildCommanderIntelligence(fleet);
  const constraints: DecisionConstraint[] = [];

  (Object.keys(equipmentLabels) as EquipmentKey[]).forEach((key) => {
    const affected = fleet.filter(
      (ship) => ship.equipment[key] !== "Operational",
    );

    if (affected.length === 0) return;

    const severity = Math.round(
      affected.reduce(
        (total, ship) => total + equipmentSeverity(ship.equipment[key]),
        0,
      ) / affected.length,
    );

    const relatedAction = intelligence.recoveryActions.find(
      (action) => action.id === key,
    );

    constraints.push({
      id: `equipment:${key}`,
      category: "ยุทโธปกรณ์",
      title: `${equipmentLabels[key]}พร้อมใช้งานไม่ครบ`,
      affectedShipIds: affected.map((ship) => ship.id),
      affectedHullNumbers: affected.map((ship) => ship.hullNumber),
      affectedMissionIds:
        relatedAction?.missionGains.map((item) => item.mission) ?? [],
      severity,
      evidence: [
        `พบเรือ ${affected.length} ลำที่ ${equipmentLabels[key]} มีข้อจำกัดหรือไม่พร้อมใช้งาน`,
        ...affected.slice(0, 5).map(
          (ship) => `${ship.hullNumber}: ${ship.equipment[key]}`,
        ),
      ],
    });
  });

  const lowCrew = fleet.filter((ship) => crewPercent(ship) < 90);
  if (lowCrew.length > 0) {
    const averageShortfall = Math.round(
      lowCrew.reduce((total, ship) => total + (90 - crewPercent(ship)), 0) /
        lowCrew.length,
    );

    constraints.push({
      id: "crew:below-90",
      category: "กำลังพล",
      title: "กำลังพลต่ำกว่าร้อยละ 90 ของอัตรา",
      affectedShipIds: lowCrew.map((ship) => ship.id),
      affectedHullNumbers: lowCrew.map((ship) => ship.hullNumber),
      affectedMissionIds: ["M2", "M4", "M7"],
      severity: clamp(45 + averageShortfall * 3),
      evidence: [
        `พบเรือ ${lowCrew.length} ลำที่กำลังพลต่ำกว่าเกณฑ์`,
        ...lowCrew
          .slice(0, 5)
          .map((ship) => `${ship.hullNumber}: ${crewPercent(ship)}% ของอัตรา`),
      ],
    });
  }

  return constraints.sort(
    (a, b) =>
      b.severity * b.affectedShipIds.length -
      a.severity * a.affectedShipIds.length,
  );
}

function priorityFromScore(score: number): DecisionPriority {
  if (score >= 75) return "วิกฤต";
  if (score >= 45) return "เร่งด่วน";
  return "ตามแผน";
}

function buildActions(
  fleet: Ship[],
  constraints: DecisionConstraint[],
): RankedCommanderAction[] {
  const readiness = evaluateFleetReadiness(fleet);
  const intelligence = buildCommanderIntelligence(fleet);

  const actions = intelligence.recoveryActions.map((recovery) => {
    const constraintId =
      recovery.id === "crew"
        ? "crew:below-90"
        : `equipment:${recovery.id}`;
    const constraint = constraints.find((item) => item.id === constraintId);
    const estimatedFleetGain = clamp(
      recovery.fleetGain,
      0,
      Math.max(0, 100 - readiness.average),
    );
    const affectedShips = constraint?.affectedShipIds.length ?? 0;
    const decisionScore = clamp(
      (constraint?.severity ?? 30) * 0.55 +
        estimatedFleetGain * 3 +
        recovery.missionGains.length * 4,
    );

    const missionImpact = recovery.missionGains.map((gain) => {
      const current = intelligence.missions.find(
        (mission) => mission.id === gain.mission,
      );
      const currentScore = current?.score ?? 0;
      const projectedScore = clamp(currentScore + gain.gain);

      return {
        missionId: gain.mission,
        missionName: missionNames[gain.mission] ?? gain.mission,
        currentScore,
        currentStatus: statusFromScore(currentScore),
        projectedScore,
        projectedStatus: statusFromScore(projectedScore),
        estimatedGain: projectedScore - currentScore,
      };
    });

    return {
      id: recovery.id,
      rank: 0,
      priority: priorityFromScore(decisionScore),
      title: recovery.title,
      rationale: recovery.reason,
      constraintIds: constraint ? [constraint.id] : [],
      affectedShips,
      missionImpact,
      estimatedFleetGain,
      projectedFleetReadiness: clamp(
        Math.round(readiness.average + estimatedFleetGain),
      ),
      confidence: clamp(
        65 + Math.min(20, affectedShips * 2) + missionImpact.length * 3,
        0,
        95,
      ),
      evidence: constraint?.evidence ?? [recovery.reason],
      decisionScore,
    };
  });

  return actions
    .sort((a, b) => b.decisionScore - a.decisionScore)
    .map(({ decisionScore: _decisionScore, ...action }, index) => ({
      ...action,
      rank: index + 1,
    }));
}

export function evaluateCommanderDecisionsV2(
  fleet: Ship[],
): CommanderDecisionV2Snapshot {
  const readiness = evaluateFleetReadiness(fleet);
  const constraints = buildConstraints(fleet);
  const actions = buildActions(fleet, constraints);
  const topAction = actions[0] ?? null;

  return {
    generatedAt: new Date().toISOString(),
    fleetReadiness: readiness.average,
    fleetStatus: readiness.fleetReadiness,
    constraints,
    actions,
    topAction,
    executiveSummary: topAction
      ? `ข้อเสนออันดับแรกคือ ${topAction.title} เนื่องจากเกี่ยวข้องกับเรือ ${topAction.affectedShips} ลำ และคาดว่าจะเพิ่มความพร้อมกองเรือประมาณ ${topAction.estimatedFleetGain}%`
      : "ไม่พบข้อจำกัดที่ต้องเสนอเพื่อการสั่งการ ให้รักษาระดับความพร้อมและติดตามสถานการณ์ต่อเนื่อง",
  };
}
