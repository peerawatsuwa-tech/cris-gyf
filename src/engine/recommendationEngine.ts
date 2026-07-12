import type { Ship } from "@/types/ship";
import type { Recommendation } from "@/types/recommendation";

export function calculateRecommendation(
  ship: Ship
): Recommendation[] {

  const list: Recommendation[] = [];

  // -----------------------------
  // กำลังพล
  // -----------------------------

  if (ship.crew < ship.authorizedCrew) {

    list.push({

      priority: "HIGH",

      title: "เพิ่มกำลังพลให้ครบอัตรา",

      impact:
        "เพิ่มความพร้อมรบโดยรวม และลดความเสี่ยงต่อทุกภารกิจ",

    });

  }

  // -----------------------------
  // Radar
  // -----------------------------

  if (ship.equipment.radar !== "Operational") {

    list.push({

      priority: "HIGH",

      title: "เร่งซ่อมระบบเรดาร์",

      impact:
        "ส่งผลกระทบต่อการตรวจการณ์และการแสดงกำลังทางเรือ",

    });

  }

  // -----------------------------
  // Communication
  // -----------------------------

  if (ship.equipment.communication !== "Operational") {

    list.push({

      priority: "HIGH",

      title: "ซ่อมระบบสื่อสาร",

      impact:
        "ส่งผลกระทบต่อทุกภารกิจและการควบคุมบังคับบัญชา",

    });

  }

  // -----------------------------
  // Weapon
  // -----------------------------

  if (ship.equipment.weapon !== "Operational") {

    list.push({

      priority: "HIGH",

      title: "ซ่อมระบบอาวุธ",

      impact:
        "ลดขีดความสามารถในการบังคับใช้กฎหมายทางทะเล",

    });

  }

  // -----------------------------
  // RHIB
  // -----------------------------

  if (ship.equipment.rhib !== "Operational") {

    list.push({

      priority: "MEDIUM",

      title: "ซ่อมเรือ RHIB",

      impact:
        "กระทบต่อภารกิจตรวจค้น จับกุม และค้นหาและช่วยเหลือ",

    });

  }

  // -----------------------------
  // EO/IR
  // -----------------------------

  if (ship.equipment.eoir !== "Operational") {

    list.push({

      priority: "MEDIUM",

      title: "ซ่อมระบบ EO / IR",

      impact:
        "ลดประสิทธิภาพการตรวจการณ์และการปฏิบัติกลางคืน",

    });

  }

  // -----------------------------
  // Navigation
  // -----------------------------

  if (ship.equipment.navigation !== "Operational") {

    list.push({

      priority: "MEDIUM",

      title: "ซ่อมระบบเดินเรือ",

      impact:
        "ส่งผลต่อความปลอดภัยในการเดินเรือและภารกิจ SAR",

    });

  }

  // -----------------------------
  // Ready
  // -----------------------------

  if (list.length === 0) {

    list.push({

      priority: "LOW",

      title: "เรืออยู่ในสภาพพร้อมปฏิบัติ",

      impact:
        "คงสภาพความพร้อมและดำเนินการบำรุงรักษาตามแผน",

    });

  }

  // เรียงลำดับความสำคัญ

  const order = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  return list.sort(
    (a, b) => order[a.priority] - order[b.priority]
  );

}