export const ASSIGNMENT_OPTIONS = {
  "ทรภ.1": ["กปก.", "มชด."],
  "ทรภ.2": ["สน.เรือสมุย", "ฐท.สข."],
  "ทรภ.3": ["ระนอง", "ฐท.พง.", "ภูเก็ต"],
  "มรภ.ฐท.สส.": [],
  "พร้อมที่ตั้งปกติ": ["ทลท.กทส.ฐท.สส."],
  "ซ่อมทำ": ["กรง.ฐท.สส.", "อจปร."],
} as const;

export type AssignmentGroup = keyof typeof ASSIGNMENT_OPTIONS;
export type AssignmentLocation = (typeof ASSIGNMENT_OPTIONS)[AssignmentGroup][number];
export type AssignmentGroupFilter = AssignmentGroup | "unspecified" | "all";

export const ASSIGNMENT_GROUPS = Object.keys(ASSIGNMENT_OPTIONS) as AssignmentGroup[];

export function assignmentLocations(group: AssignmentGroup | null) {
  return group ? [...ASSIGNMENT_OPTIONS[group]] as AssignmentLocation[] : [];
}

export function automaticAssignmentLocation(group: AssignmentGroup | null) {
  if (group === "พร้อมที่ตั้งปกติ") return "ทลท.กทส.ฐท.สส." as const;
  return null;
}

export function assignmentLabel(group: AssignmentGroup | null, location: AssignmentLocation | null) {
  if (!group) return "ยังไม่ระบุพื้นที่ปฏิบัติราชการ";
  return location ? `${group} / ${location}` : group;
}

export function assignmentGroupLabel(group: AssignmentGroup | "unspecified") {
  if (group === "unspecified") return "ยังไม่ระบุ (Not Specified)";
  if (group === "พร้อมที่ตั้งปกติ") return "พร้อมที่ตั้งปกติ (Home Station)";
  if (group === "ซ่อมทำ") return "ซ่อมทำ (Maintenance)";
  return group;
}
