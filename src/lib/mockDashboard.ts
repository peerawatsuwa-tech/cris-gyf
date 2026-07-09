import type { DashboardKpi, FleetStatusItem, MissionCapabilityItem, FleetSummary, Mission } from '@/types/dashboard'

export const mockKpis: DashboardKpi[] = [
  {
    title: 'CORE ASSESSMENT',
    value: 'Y',
    subtitle: 'Qualified Yes',
    color: '#34D399',
  },
  {
    title: 'OVERALL C-RATING',
    value: 'C2',
    subtitle: 'Moderate Ready',
    color: '#22C55E',
  },
  {
    title: 'MISSION EFFECTIVENESS',
    value: '90%',
    subtitle: 'Mission Capability',
    color: '#3B82F6',
  },
  {
    title: 'FLEET AVAILABILITY',
    value: '89%',
    subtitle: 'Operational Fleet',
    color: '#FACC15',
  },
]

export const mockFleetStatus: FleetStatusItem[] = [
  { label: 'Operational', value: '18' },
  { label: 'Maintenance', value: '4' },
  { label: 'Standby', value: '2' },
]

export const mockMissionCapabilities: MissionCapabilityItem[] = [
  { label: 'Search & Rescue', level: 'High' },
  { label: 'Patrol', level: 'Medium' },
  { label: 'Logistics', level: 'Medium' },
]

export const fleetSummary: FleetSummary = {
  totalShips: 49,
  ready: 43,
  limited: 5,
  notReady: 1,
}

export const missions: Mission[] = [
  { name: 'Maritime Security', readiness: 95, rating: 'Y' },
  { name: 'Coastal Patrol', readiness: 92, rating: 'Y' },
  { name: 'Maritime Surveillance', readiness: 90, rating: 'Y' },
  { name: 'SAR', readiness: 88, rating: 'Y' },
  { name: 'VBSS', readiness: 75, rating: 'Q' },
  { name: 'Night Operation', readiness: 70, rating: 'Q' },
]