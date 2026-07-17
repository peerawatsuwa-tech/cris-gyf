CRIS Phase B — Decision Engine Part 02

ไฟล์ที่เพิ่ม
- src/components/command/CommanderDecisionV2Panel.tsx

ไฟล์ที่แก้ไข
- src/pages/CommandCenter/CommandCenterPage.tsx
- src/components/command/CommanderMorningBrief.tsx

ผลลัพธ์
- เชื่อม useCommanderDecisionsV2 เข้าหน้า Executive Command Dashboard
- Morning Brief ใช้ข้อเสนออันดับแรกและค่าฟื้นคืนจาก Engine V2
- แทน Panel ข้อเสนอเดิมด้วย Decision V2 Panel เพียงชุดเดียว
- แสดงลำดับ ความเร่งด่วน ความเชื่อมั่น ผลกระทบต่อภารกิจ และหลักฐาน
- ไม่เปลี่ยน Domain Model และไม่แก้แผนที่

หมายเหตุ
- ข้อมูลทั้งหมดเป็นข้อมูลสาธิตเพื่อสนับสนุนการพิจารณา
- ปุ่มสั่งการเดิมยังเป็น UI สาธิตและไม่มีการบันทึกคำสั่งจริง
