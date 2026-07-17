CRIS Phase B — Decision Engine Part 01

ไฟล์ที่เพิ่ม
- src/types/commanderDecisionV2.ts
- src/engine/commanderDecisionEngineV2.ts
- src/hooks/useCommanderDecisionsV2.ts

ขอบเขต
- วิเคราะห์ข้อจำกัดด้านกำลังพลและยุทโธปกรณ์จาก Ship[] เดิม
- เชื่อมข้อจำกัดกับภารกิจ M1–M8 ผ่าน Engine ที่มีอยู่
- จัดลำดับข้อเสนอเพื่อการสั่งการพร้อมเหตุผลและหลักฐาน
- ประมาณการ Fleet/Mission recovery โดยไม่แก้ข้อมูลต้นฉบับ
- มี Hook พร้อมเชื่อม UI ใน Part ถัดไป

หมายเหตุ
- ไม่เปลี่ยน Domain Model
- ไม่เปลี่ยน UI เดิม
- ผลลัพธ์เป็นข้อมูลสาธิตเชิงวิเคราะห์ ไม่ใช่คำสั่งปฏิบัติการจริง
