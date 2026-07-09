export interface EngineStatus {
  name: string;
  status: 'Operational' | 'Limited' | 'Not Ready';
  hours: number;
}

export const engine: EngineStatus = {
  name: 'Main Engine',
  status: 'Operational',
  hours: 12450,
};
