export interface ShipRecord {
  id: number;
  hull: string;
  class: string;
  readiness: string;
  commander: string;
  mission: string;
}

export const shipRecord: ShipRecord = {
  id: 1,
  hull: 'ต.232',
  class: 'ชุด ต.232',
  readiness: 'Y',
  commander: 'ร.อ. ...',
  mission: 'ลาดตระเวน',
};
