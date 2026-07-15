import type { EquipmentStatus, Ship } from "@/types/ship";

export type MissionId =
  | "M1_MARITIME_PRESENCE"
  | "M2_MARITIME_LAW_ENFORCEMENT"
  | "M4_SEARCH_AND_RESCUE";

export type MissionRequirement =
  | {
      kind: "crew";
      minimumRatio: number;
      penalty: number;
      reason: string;
      impact: string;
      recommendation: string;
    }
  | {
      kind: "equipment";
      equipment: keyof Ship["equipment"];
      requiredStatus: EquipmentStatus;
      penalty: number;
      reason: string;
      impact: string;
      recommendation: string;
    };

export interface MissionCapabilityDefinition {
  id: MissionId;
  name: string;
  requirements: readonly MissionRequirement[];
}

export const missionCapabilityFramework: readonly MissionCapabilityDefinition[] = [
  {
    id: "M1_MARITIME_PRESENCE",
    name: "การแสดงกำลังทางทะเล",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.9,
        penalty: 20,
        reason: "กำลังพลประจำเรือต่ำกว่าร้อยละ 90",
        impact: "ขีดความสามารถในการจัดยามและปฏิบัติการต่อเนื่องลดลง",
        recommendation: "จัดกำลังพลให้ไม่น้อยกว่าร้อยละ 90 ของอัตรา",
      },
      {
        kind: "equipment",
        equipment: "radar",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "เรดาร์ไม่พร้อมใช้งาน",
        impact: "ขีดความสามารถในการตรวจการณ์และตรวจจับเป้าผิวน้ำลดลง",
        recommendation: "เร่งซ่อมระบบเรดาร์ให้พร้อมใช้งาน",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "ระบบสื่อสารไม่พร้อมใช้งาน",
        impact: "ขีดความสามารถในการบังคับบัญชาและประสานการปฏิบัติลดลง",
        recommendation: "เร่งซ่อมระบบสื่อสารให้พร้อมใช้งาน",
      },
    ],
  },
  {
    id: "M2_MARITIME_LAW_ENFORCEMENT",
    name: "การบังคับใช้กฎหมายทางทะเล",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.9,
        penalty: 20,
        reason: "กำลังพลประจำเรือต่ำกว่าร้อยละ 90",
        impact: "ขีดความสามารถในการจัดยามและปฏิบัติการต่อเนื่องลดลง",
        recommendation: "จัดกำลังพลให้ไม่น้อยกว่าร้อยละ 90 ของอัตรา",
      },
      {
        kind: "equipment",
        equipment: "weapon",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "ระบบอาวุธไม่พร้อมใช้งาน",
        impact: "ขีดความสามารถในการสกัดกั้นและป้องกันกำลังลดลง",
        recommendation: "เร่งซ่อมระบบอาวุธให้พร้อมใช้งาน",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "เรือ RHIB ไม่พร้อมใช้งาน",
        impact: "การตรวจค้น การถ่ายโอนกำลังพล หรือการช่วยเหลือมีข้อจำกัด",
        recommendation: "เร่งซ่อมเรือ RHIB ให้พร้อมใช้งาน",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "ระบบสื่อสารไม่พร้อมใช้งาน",
        impact: "ขีดความสามารถในการบังคับบัญชาและประสานการปฏิบัติลดลง",
        recommendation: "เร่งซ่อมระบบสื่อสารให้พร้อมใช้งาน",
      },
    ],
  },
  {
    id: "M4_SEARCH_AND_RESCUE",
    name: "การค้นหาและช่วยเหลือ",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.8,
        penalty: 20,
        reason: "กำลังพลประจำเรือต่ำกว่าร้อยละ 80",
        impact: "ความต่อเนื่องและขีดความสามารถในการตอบสนองของชุดช่วยเหลือลดลง",
        recommendation: "จัดกำลังพลให้ไม่น้อยกว่าร้อยละ 80 ของอัตรา",
      },
      {
        kind: "equipment",
        equipment: "navigation",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "ระบบเดินเรือไม่พร้อมใช้งาน",
        impact: "ความปลอดภัยในการเดินเรือและการปฏิบัติตามรูปแบบการค้นหาลดลง",
        recommendation: "เร่งซ่อมระบบเดินเรือให้พร้อมใช้งาน",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "ระบบสื่อสารไม่พร้อมใช้งาน",
        impact: "ขีดความสามารถในการบังคับบัญชาและประสานการปฏิบัติลดลง",
        recommendation: "เร่งซ่อมระบบสื่อสารให้พร้อมใช้งาน",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "เรือ RHIB ไม่พร้อมใช้งาน",
        impact: "การตรวจค้น การถ่ายโอนกำลังพล หรือการช่วยเหลือมีข้อจำกัด",
        recommendation: "เร่งซ่อมเรือ RHIB ให้พร้อมใช้งาน",
      },
    ],
  },
] as const;

function crewRatio(ship: Ship): number {
  if (ship.authorizedCrew <= 0) return 0;
  return ship.crew / ship.authorizedCrew;
}

export function isRequirementMet(
  ship: Ship,
  requirement: MissionRequirement,
): boolean {
  if (requirement.kind === "crew") {
    return crewRatio(ship) >= requirement.minimumRatio;
  }

  return ship.equipment[requirement.equipment] === requirement.requiredStatus;
}
