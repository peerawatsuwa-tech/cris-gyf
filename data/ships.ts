export interface Ship {
  id: string;
  name: string;
  className: string;
  hullNumber: string;
  homePort: string;
  status: 'active' | 'maintenance' | 'deployed' | 'standby';
  readiness: number;
  crewCount: number;
}

export const ships: Ship[] = [
  {
    id: 'ship-001',
    name: 'เรือ ต.991',
    className: 'เรือยกพล',
    hullNumber: 'T-991',
    homePort: 'ท่าเรือกรุงเทพ',
    status: 'active',
    readiness: 92,
    crewCount: 42,
  },
  {
    id: 'ship-002',
    name: 'เรือ ต.992',
    className: 'เรือลาดตระเวน',
    hullNumber: 'T-992',
    homePort: 'ท่าเรือภูเก็ต',
    status: 'deployed',
    readiness: 88,
    crewCount: 38,
  },
  {
    id: 'ship-003',
    name: 'เรือ ต.993',
    className: 'เรือสนับสนุน',
    hullNumber: 'T-993',
    homePort: 'ท่าเรือกรุงเทพ',
    status: 'maintenance',
    readiness: 61,
    crewCount: 24,
  },
];
