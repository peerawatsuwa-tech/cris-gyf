export const UI = {
  organization: {
    navy: "กองทัพเรือ (Royal Thai Navy)",
    squadron: "กองเรือยามฝั่ง (Coast Guard Squadron)",
    systemName: "ระบบสารสนเทศความพร้อมกองเรือยามฝั่ง (Coast Guard Readiness Information System)",
  },
  navigation: {
    dashboard: "ภาพรวม (Dashboard)",
    fleet: "กองเรือ (Fleet)",
    assessment: "การประเมิน (Assessment)",
    shipEdit: "แก้ไขข้อมูลเรือ (Ship Edit)",
  },
  pages: {
    dashboard: "ภาพรวมความพร้อมกองเรือ (Fleet Readiness Overview)",
    fleet: "สถานะกองเรือ (Fleet Status)",
    shipSelection: "เลือกเรือที่ต้องการแก้ไข (Select Ship to Edit)",
    shipDetail: "รายละเอียดเรือ (Ship Detail)",
    assessment: "ความพร้อมตามภารกิจ (Mission Readiness)",
  },
  sections: {
    commanderSummary: "สรุปสำหรับผู้บังคับบัญชา (Commander Summary)",
    fleetReadiness: "ความพร้อมของกองเรือ (Fleet Readiness)",
    missionReadiness: "ความพร้อมตามภารกิจ (Mission Readiness)",
    majorDeficiencies: "ข้อขัดข้องสำคัญ (Major Deficiencies)",
    fleetStatus: "สถานะกองเรือ (Fleet Status)",
    currentReadiness: "ความพร้อมปัจจุบัน (Current Readiness)",
    personnel: "กำลังพล (Personnel)",
    missionImpact: "ผลกระทบต่อภารกิจ (Mission Impact)",
    missionLimitations: "ข้อจำกัดในการปฏิบัติภารกิจ (Mission Limitations)",
    equipment: "ยุทโธปกรณ์และระบบเรือ (Equipment)",
    shipEdit: "แก้ไขข้อมูลเรือ (Ship Edit)",
  },
  auth: {
    username: "ชื่อผู้ใช้ (Username)",
    password: "รหัสผ่าน (Password)",
    remember: "จดจำการเข้าสู่ระบบ (Remember Me)",
    login: "เข้าสู่ระบบ (Login)",
    signingIn: "กำลังเข้าสู่ระบบ (Signing In)",
    logout: "ออกจากระบบ (Logout)",
    failed: "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่านแล้วลองอีกครั้ง",
  },
  actions: {
    openShipDetail: "เปิดรายละเอียดเรือ (Open Ship Detail)",
    backToFleet: "กลับไปยังกองเรือ (Back to Fleet)",
    closeDetail: "ปิดรายละเอียด (Close Detail)",
  },
  labels: {
    searchShip: "ค้นหาเรือ (Search Ship)",
    version: "รุ่นระบบ (Version)",
    system: "ระบบ (System)",
    officialDemo: "ระบบสาธิตอย่างเป็นทางการ (Official Demonstration)",
    systemOnline: "ระบบพร้อมใช้งาน (System Online)",
    status: "สถานะ (Status)",
    allShips: "เรือทั้งหมด (All Ships)",
    assessed: "ประเมินแล้ว (Assessed)",
    currentCrew: "กำลังพลปัจจุบัน (Current Crew)",
    authorizedCrew: "อัตรากำลัง (Authorized Crew)",
    lastUpdated: "ปรับปรุงล่าสุด (Last Updated)",
    pendingItems: "รายการรอการประเมิน (Pending Items)",
    completeData: "ข้อมูลขั้นต่ำครบ (Required Data Complete)",
    noData: "ยังไม่มีข้อมูล (No Data)",
    cloudDataset: "ชุดข้อมูลบนระบบคลาวด์ (Cloud Dataset)",
    excelDataset: "ชุดข้อมูล Excel (Excel Dataset)",
  },
  save: {
    saving: "กำลังบันทึก (Saving)",
    saved: "บันทึกแล้ว (Saved)",
    failed: "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง (Save Failed)",
  },
  roles: {
    commander: "ผู้บังคับบัญชา (Commander)",
    admin: "ผู้ดูแลระบบ (Admin)",
    ship: "เจ้าหน้าที่เรือ (Ship User)",
  },
  equipment: {
    propulsion: "ระบบขับเคลื่อน (Propulsion)",
    radar: "เรดาร์ (Radar)",
    communication: "ระบบสื่อสาร (Communication)",
    navigation: "ระบบเดินเรือ (Navigation)",
    weapon: "ระบบอาวุธ (Weapon)",
    rhib: "RHIB",
    eoir: "EO/IR",
  },
  status: {
    Y: "พร้อมปฏิบัติภารกิจ (Y)",
    Q: "พร้อมปฏิบัติภารกิจแบบมีข้อจำกัด (Q)",
    N: "ไม่พร้อมปฏิบัติภารกิจ (N)",
    U: "รอการประเมิน (U)",
    operational: "พร้อมใช้งาน (Operational)",
    limited: "ใช้งานได้แบบมีข้อจำกัด (Limited)",
    notReady: "ไม่พร้อมใช้งาน (Not Ready)",
    notInstalled: "ไม่มีการติดตั้ง (Not Installed)",
    pending: "รอการประเมิน (Pending Assessment)",
  },
} as const;

export function readinessStatusText(status: "Y" | "Q" | "N" | "U") {
  return UI.status[status];
}

export function equipmentStatusText(
  status: "Operational" | "Limited" | "Not Ready" | "Not Installed" | null,
) {
  if (status === "Operational") return UI.status.operational;
  if (status === "Limited") return UI.status.limited;
  if (status === "Not Ready") return UI.status.notReady;
  if (status === "Not Installed") return UI.status.notInstalled;
  return UI.status.pending;
}

export function readinessDetailText(value: string) {
  return value
    .replaceAll("ระบบขับเคลื่อน", UI.equipment.propulsion)
    .replaceAll("Radar", UI.equipment.radar)
    .replaceAll("Communication", UI.equipment.communication)
    .replaceAll("Navigation", UI.equipment.navigation)
    .replaceAll("Weapon", UI.equipment.weapon);
}
