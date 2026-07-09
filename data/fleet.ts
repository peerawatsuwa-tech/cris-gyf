export interface FleetAsset {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'standby' | 'deployed';
  region: string;
  missionReady: boolean;
  crewCount: number;
}

export const fleetAssets: FleetAsset[] = [
  {
    id: 'ship-001',
    name: 'เรือ ต.991',
    type: 'เรือยกพล',
    status: 'active',
    region: 'อ่าวไทย',
    missionReady: true,
    crewCount: 42,
  },
  {
    id: 'ship-002',
    name: 'เรือ ต.992',
    type: 'เรือลาดตระเวน',
    status: 'deployed',
    region: 'อันดามัน',
    missionReady: true,
    crewCount: 38,
  },
  {
    id: 'ship-003',
    name: 'เรือ ต.993',
    type: 'เรือสนับสนุน',
    status: 'maintenance',
    region: 'ท่าเรือกรุงเทพ',
    missionReady: false,
    crewCount: 24,
  },
];
