import type { ReadinessStatus } from "@/lib/readinessV027";

export type MissionDistribution = Record<ReadinessStatus, number>;

export type MissionCapability = {
  status: ReadinessStatus;
  assessed: number;
  deployable: number;
  readyPercent: number;
  level: "HIGH" | "MODERATE" | "LOW" | "PENDING";
  recommendation: string;
};

export function aggregateMissionCapability(
  distribution: MissionDistribution,
): MissionCapability {
  const assessed = distribution.Y + distribution.Q + distribution.N;
  if (assessed === 0) {
    return {
      status: "U",
      assessed,
      deployable: 0,
      readyPercent: 0,
      level: "PENDING",
      recommendation: "ยังไม่มีข้อมูลที่ผ่านการประเมินเพียงพอ",
    };
  }

  const readyPercent = (distribution.Y / assessed) * 100;
  if (readyPercent >= 80) {
    return {
      status: "Y",
      assessed,
      deployable: distribution.Y,
      readyPercent,
      level: "HIGH",
      recommendation: "สามารถจัดกำลังปฏิบัติภารกิจได้ทันที",
    };
  }
  if (readyPercent >= 60) {
    return {
      status: "Q",
      assessed,
      deployable: distribution.Y,
      readyPercent,
      level: "MODERATE",
      recommendation: "สามารถปฏิบัติภารกิจได้ แต่มีข้อจำกัด",
    };
  }
  return {
    status: "N",
    assessed,
    deployable: distribution.Y,
    readyPercent,
    level: "LOW",
    recommendation: "ไม่สามารถจัดกำลังให้เพียงพอ ควรเร่งแก้ไข",
  };
}
