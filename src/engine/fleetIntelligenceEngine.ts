import type { FleetReadinessSummary } from "./fleetReadinessEngine";
import type { OperationalReadinessAssessment } from "./operationalReadinessAssessmentEngine";
import type { Ship } from "@/types/ship";
import type {
  FleetIntelligenceAction,
  FleetIntelligenceIssue,
  FleetIntelligenceSummary,
  FleetMissionImpact,
  IntelligenceSeverity,
} from "@/types/intelligence";

export interface FleetOperationalAssessmentItem {
  ship: Ship;
  assessment: OperationalReadinessAssessment;
}

interface AggregateItem {
  ships: Set<string>;
  missions: Set<string>;
  notReady: number;
  limited: number;
}

function severityOf(item: AggregateItem): IntelligenceSeverity {
  if (item.notReady >= 3 || item.ships.size >= 5) return "วิกฤต";
  if (item.notReady > 0 || item.ships.size >= 3) return "สูง";
  return "ปานกลาง";
}

function createHeadline(summary: FleetReadinessSummary): string {
  if (summary.notReady > 0) {
    return `กองเรือมีเรือไม่พร้อมปฏิบัติ ${summary.notReady} ลำ ต้องเร่งแก้ไขข้อขัดข้องที่กระทบภารกิจสำคัญ`;
  }

  if (summary.limited > 0) {
    return `กองเรือพร้อมปฏิบัติภารกิจโดยรวม แต่มีเรือพร้อมแบบมีข้อจำกัด ${summary.limited} ลำ`;
  }

  return "กองเรือพร้อมปฏิบัติภารกิจตามที่ได้รับมอบหมาย";
}

function aggregateIssues(
  assessments: FleetOperationalAssessmentItem[],
): FleetIntelligenceIssue[] {
  const aggregate = new Map<string, AggregateItem>();

  assessments.forEach(({ ship, assessment }) => {
    assessment.reasons.forEach((reason) => {
      const item = aggregate.get(reason) ?? {
        ships: new Set<string>(),
        missions: new Set<string>(),
        notReady: 0,
        limited: 0,
      };

      item.ships.add(ship.id);
      item.missions.add(assessment.missionId);
      if (assessment.readiness === "N") item.notReady += 1;
      if (assessment.readiness === "Q") item.limited += 1;
      aggregate.set(reason, item);
    });
  });

  return Array.from(aggregate.entries())
    .map(([title, item]) => ({
      title,
      severity: severityOf(item),
      affectedShips: item.ships.size,
      affectedMissions: item.missions.size,
    }))
    .sort((a, b) => {
      const rank = { วิกฤต: 3, สูง: 2, ปานกลาง: 1 } as const;
      return rank[b.severity] - rank[a.severity] || b.affectedShips - a.affectedShips;
    })
    .slice(0, 5);
}

function aggregateActions(
  assessments: FleetOperationalAssessmentItem[],
): FleetIntelligenceAction[] {
  const aggregate = new Map<string, Set<string>>();

  assessments.forEach(({ ship, assessment }) => {
    assessment.recommendations.forEach((recommendation) => {
      const ships = aggregate.get(recommendation) ?? new Set<string>();
      ships.add(ship.id);
      aggregate.set(recommendation, ships);
    });
  });

  return Array.from(aggregate.entries())
    .map(([title, ships]) => ({ title, affectedShips: ships.size }))
    .sort((a, b) => b.affectedShips - a.affectedShips)
    .slice(0, 5)
    .map((action, index) => ({ ...action, priority: index + 1 }));
}

function aggregateImpacts(
  assessments: FleetOperationalAssessmentItem[],
): FleetMissionImpact[] {
  const aggregate = new Map<string, Set<string>>();

  assessments.forEach(({ ship, assessment }) => {
    assessment.impacts.forEach((impact) => {
      const ships = aggregate.get(impact) ?? new Set<string>();
      ships.add(ship.id);
      aggregate.set(impact, ships);
    });
  });

  return Array.from(aggregate.entries())
    .map(([title, ships]) => ({ title, affectedShips: ships.size }))
    .sort((a, b) => b.affectedShips - a.affectedShips)
    .slice(0, 5);
}

export function buildFleetIntelligence(
  readiness: FleetReadinessSummary,
  operationalAssessments: FleetOperationalAssessmentItem[],
): FleetIntelligenceSummary {
  return {
    fleetReadiness: readiness.fleetReadiness,
    averageReadiness: readiness.average,
    headline: createHeadline(readiness),
    issues: aggregateIssues(operationalAssessments),
    actions: aggregateActions(operationalAssessments),
    missionImpacts: aggregateImpacts(operationalAssessments),
  };
}
