import type { FleetIntelligenceSummary } from "@/types/intelligence";
import type {
  CommanderDecision,
  CommanderDecisionSummary,
  DecisionUrgency,
} from "@/types/decision";

function urgencyOf(priority: number, affectedShips: number): DecisionUrgency {
  if (priority === 1 || affectedShips >= 5) return "เร่งด่วน";
  if (priority <= 3 || affectedShips >= 3) return "สูง";
  return "ตามแผน";
}

function estimatedGain(affectedShips: number, fleetSize: number): number {
  if (fleetSize <= 0) return 0;
  return Math.min(12, Math.max(1, Math.round((affectedShips / fleetSize) * 10)));
}

function relatedIssue(
  intelligence: FleetIntelligenceSummary,
  actionTitle: string,
) {
  const normalizedAction = actionTitle.replace(/เร่ง|ซ่อม|จัด|ให้พร้อมใช้งาน/g, "");

  return intelligence.issues.find((issue) => {
    const normalizedIssue = issue.title.replace(/ไม่พร้อมใช้งาน|ต่ำกว่า|ขาด/g, "");
    return (
      normalizedAction.includes(normalizedIssue.trim()) ||
      normalizedIssue.includes(normalizedAction.trim())
    );
  });
}

export function buildCommanderDecisions(
  intelligence: FleetIntelligenceSummary,
  fleetSize: number,
): CommanderDecisionSummary {
  const decisions: CommanderDecision[] = intelligence.actions.map((action) => {
    const issue = relatedIssue(intelligence, action.title);
    const affectedMissions = issue?.affectedMissions ?? 1;
    const gain = estimatedGain(action.affectedShips, fleetSize);

    return {
      priority: action.priority,
      title: action.title,
      reason:
        issue?.title ??
        `ข้อขัดข้องนี้เกี่ยวข้องกับเรือ ${action.affectedShips} ลำ และอาจกระทบความต่อเนื่องของภารกิจ`,
      urgency: urgencyOf(action.priority, action.affectedShips),
      affectedShips: action.affectedShips,
      affectedMissions,
      estimatedReadinessGain: gain,
      expectedOutcome: `คาดว่าจะลดข้อจำกัดของเรือ ${action.affectedShips} ลำ และเพิ่มความพร้อมเฉลี่ยประมาณ ${gain}%`,
    };
  });

  return {
    headline:
      decisions.length > 0
        ? `ควรพิจารณาดำเนินการ ${decisions.length} รายการ โดยให้ความสำคัญกับรายการลำดับแรกก่อน`
        : "ยังไม่มีข้อเสนอแนะเร่งด่วน ให้รักษาระดับความพร้อมและติดตามสถานการณ์อย่างต่อเนื่อง",
    decisions,
  };
}
