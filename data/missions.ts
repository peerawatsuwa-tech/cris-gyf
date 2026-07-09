export interface Mission {
  id: string;
  title: string;
  status: 'planned' | 'ongoing' | 'completed' | 'at-risk';
  priority: 'high' | 'medium' | 'low';
  assignedShipId: string;
  region: string;
  progress: number;
}

export const missions: Mission[] = [
  {
    id: 'mission-001',
    title: 'ภารกิจลาดตระเวนชายแดน',
    status: 'ongoing',
    priority: 'high',
    assignedShipId: 'ship-001',
    region: 'อ่าวไทย',
    progress: 72,
  },
  {
    id: 'mission-002',
    title: 'การสนับสนุนเสบียง',
    status: 'planned',
    priority: 'medium',
    assignedShipId: 'ship-002',
    region: 'อันดามัน',
    progress: 34,
  },
  {
    id: 'mission-003',
    title: 'ตรวจสอบอุปกรณ์',
    status: 'at-risk',
    priority: 'high',
    assignedShipId: 'ship-003',
    region: 'ท่าเรือกรุงเทพ',
    progress: 18,
  },
];
