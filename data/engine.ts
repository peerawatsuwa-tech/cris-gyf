export interface EngineStatus {
  name: string;
  status: 'operational' | 'maintenance' | 'standby';
  hours: number;
}

export const engine: EngineStatus = {
  name: 'Main Engine',
  status: 'operational',
  hours: 12450,
};
