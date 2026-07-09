export const formatEngineValue = (value: number): string => `${value.toFixed(1)}%`;
export const getEngineStatusLabel = (value: number): string =>
  value >= 90 ? 'Excellent' : value >= 75 ? 'Good' : 'Needs Attention';
