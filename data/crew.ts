export interface CrewMember {
  id: string;
  name: string;
  role: string;
  shipId: string;
  status: 'ready' | 'off-duty' | 'training' | 'assigned';
}

export const crewMembers: CrewMember[] = [
  {
    id: 'crew-001',
    name: 'นาวาเอก สมชาย ใจดี',
    role: 'ผู้บังคับการ',
    shipId: 'ship-001',
    status: 'ready',
  },
  {
    id: 'crew-002',
    name: 'นาวาโท ว่าที่ร้อยตรี อนุชิต',
    role: 'วิศวกรระบบ',
    shipId: 'ship-001',
    status: 'assigned',
  },
  {
    id: 'crew-003',
    name: 'เรือโท ชนินทร์ วงศ์พาณิชย์',
    role: 'หัวหน้ากลุ่มปฏิบัติการ',
    shipId: 'ship-002',
    status: 'ready',
  },
];
