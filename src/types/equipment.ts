export type EquipmentStatus = 'Operational' | 'Limited' | 'Not Ready';

export interface Equipment {
  radar: EquipmentStatus;
  communication: EquipmentStatus;
  weapon: EquipmentStatus;
  navigation: EquipmentStatus;
  eoir: EquipmentStatus;
  rhib: EquipmentStatus;
  engine: EquipmentStatus;
}
