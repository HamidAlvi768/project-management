// Format large numbers to millions/thousands
export const formatYAxis = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Format tooltip values
export const formatTooltip = (value: number, name: string, prefix?: string) => {
  if (name.includes('Cost')) {
    return `${prefix || 'Rs.'} ${value.toLocaleString()}`;
  }
  return `${value} ${name.toLowerCase().includes('time') ? 'days' : ''}`;
};

export const CHART_COLORS = {
  blue: {
    estimated: "#93c5fd",
    actual: "#818cf8"
  },
  green: {
    estimated: "#86efac",
    actual: "#4ade80"
  },
  purple: {
    estimated: "#d8b4fe",
    actual: "#a855f7"
  },
  orange: {
    estimated: "#fdba74",
    actual: "#f97316"
  }
} as const; 