import type { CurrentEquipmentStatus } from "@/types/ship";

export const EQUIPMENT_SYSTEMS = [
  {
    id: "weapon",
    label: "ระบบอาวุธปืนและเครื่องควบคุมการยิง",
    sourceSheet: "อาวุธปืน,คคย.",
    items: ["ปืนหัว", "ปืนท้าย", "เครื่องควบคุมการยิง", "ปืนกราบซ้าย", "ปืนกราบขวา"],
  },
  {
    id: "hull",
    label: "ระบบตัวเรือ",
    sourceSheet: "ตัวเรือ",
    items: ["ระบบหางเสือ", "เข็มทิศไยโร", "เข็มทิศแม่เหล็ก"],
  },
  {
    id: "propulsion",
    label: "ระบบขับเคลื่อนและผลิตไฟฟ้า",
    sourceSheet: "ระบบขับเคลื่อน",
    items: ["เครื่องจักรใหญ่", "เครื่องขับเครื่องกำเนิดไฟฟ้า", "เครื่องกำเนิดไฟฟ้า"],
  },
  {
    id: "auxiliary",
    label: "ระบบเครื่องจักรช่วย",
    sourceSheet: "ระบบเครื่องจักรช่วย",
    items: ["เครื่องปรับอากาศ", "เครื่องทำความเย็น", "เครื่องอัดลม", "เครื่องสูบน้ำเคลื่อนที่", "ไฟร์เมน", "กว้านสมอ"],
  },
  {
    id: "radar",
    label: "ระบบเรดาร์",
    sourceSheet: "เรดาห์",
    items: ["เรดาร์ FURUNO ชุดที่ 1", "เรดาร์ FURUNO ชุดที่ 2", "เรดาร์ SPERRY"],
  },
  {
    id: "communication",
    label: "ระบบสื่อสาร",
    sourceSheet: "อุปกรณ์สื่อสาร",
    items: ["HF/CB", "VLF-HF", "HF/SSB", "VHF/FM", "VHF DSC", "VHF-UHF", "EPIRB", "SART", "COLLINS"],
  },
  {
    id: "radio",
    label: "อุปกรณ์เครื่องวิทยุ",
    sourceSheet: "อุปกร์เครื่องวิทยุ",
    items: [
      "VLF HF",
      "VHF/UHF",
      "HF/SSB (0.5-1 KW)",
      "HF/SSB (100-150 W)",
      "HF/SSB HOPPING",
      "HF/CB",
      "VHF/FM Lowband",
      "VHF/FM Lowband Manpack",
      "VHF/FM Highband Mobile",
      "VHF/FM Highband H/T",
      "UHF AM/FM",
    ],
  },
] as const;

export type EquipmentSystemId = (typeof EQUIPMENT_SYSTEMS)[number]["id"];
export type EquipmentDetailStatuses = Record<string, CurrentEquipmentStatus>;

export function equipmentItemKey(systemId: EquipmentSystemId, item: string) {
  return `${systemId}:${item}`;
}

export function systemEquipmentStatuses(
  statuses: EquipmentDetailStatuses | null | undefined,
  systemId: EquipmentSystemId,
) {
  return Object.entries(statuses ?? {})
    .filter(([key]) => key.startsWith(`${systemId}:`))
    .map(([, status]) => status);
}

export function systemDeficiencyCounts(
  statuses: EquipmentDetailStatuses | null | undefined,
  systemId: EquipmentSystemId,
) {
  const values = systemEquipmentStatuses(statuses, systemId);
  return {
    limited: values.filter((status) => status === "Limited").length,
    critical: values.filter((status) => status === "Not Ready").length,
    assessed: values.filter((status) => status !== null && status !== "Not Installed").length,
    recorded: values.filter((status) => status !== null).length,
  };
}
