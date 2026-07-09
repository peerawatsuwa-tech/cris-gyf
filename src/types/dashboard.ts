export type DashboardKpi = {
  title: string
  value: string
  subtitle: string
  color: string
}

export type FleetStatusItem = {
  label: string
  value: string
}

export type MissionCapabilityItem = {
  label: string
  level: 'High' | 'Medium' | 'Low'
}

export interface FleetSummary {
  totalShips: number
  ready: number
  limited: number
  notReady: number
}

export interface Mission {
  name: string
  readiness: number
  rating: 'Y' | 'Q' | 'N'
}