export function formatScore(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusLabel(value: number): string {
  if (value >= 90) return 'Excellent';
  if (value >= 75) return 'Good';
  return 'Needs Attention';
}

export function equipmentScore(status: string): number {
  switch (status) {
    case 'Operational':
      return 100;
    case 'Limited':
      return 60;
    case 'Not Ready':
      return 0;
    default:
      return 0;
  }
}
