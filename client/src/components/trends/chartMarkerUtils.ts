export type ChartBound = {
  low: string | number | null;
  high: string | number | null;
  label?: string;
  status: string;
  color?: string | null;
};

export function sortChartBounds(bounds: ChartBound[]): ChartBound[] {
  return [...bounds].sort((a, b) => {
    const lowA = parseFloat(String(a.low ?? ''));
    const lowB = parseFloat(String(b.low ?? ''));

    const aLow = Number.isNaN(lowA) ? -Infinity : lowA;
    const bLow = Number.isNaN(lowB) ? -Infinity : lowB;

    if (aLow !== bLow) return aLow - bLow;

    const highA = parseFloat(String(a.high ?? ''));
    const highB = parseFloat(String(b.high ?? ''));

    const aHigh = Number.isNaN(highA) ? Infinity : highA;
    const bHigh = Number.isNaN(highB) ? Infinity : highB;

    return aHigh - bHigh;
  });
}

export function parseNumericValue(value: unknown): number | null {
  if (value == null || value === '') return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

export function isValueInSegment(segment: ChartBound, value: number): boolean {
  const low =
    segment.low == null || segment.low === ''
      ? -Infinity
      : Number(segment.low);
  const high =
    segment.high == null || segment.high === ''
      ? Infinity
      : Number(segment.high);
  return value >= low && value <= high;
}

export function findSegmentForValue(
  bounds: ChartBound[],
  value: number,
): ChartBound | null {
  const sorted = sortChartBounds(bounds);
  return sorted.find((segment) => isValueInSegment(segment, value)) ?? null;
}

export function findNearestSegment(
  bounds: ChartBound[],
  value: number,
): ChartBound {
  const sorted = sortChartBounds(bounds);
  if (sorted.length === 0) {
    throw new Error('No chart bounds provided');
  }

  const first = sorted[0];
  const firstLow =
    first.low == null || first.low === '' ? -Infinity : Number(first.low);
  if (value < firstLow) return first;

  const last = sorted[sorted.length - 1];
  const lastHigh =
    last.high == null || last.high === '' ? Infinity : Number(last.high);
  if (value > lastHigh) return last;

  return first;
}

export function resolvePercentWithinSegment(
  segment: ChartBound,
  value: number,
): number {
  if (segment.low == null && segment.high != null) {
    if (value <= Number(segment.high)) return 5;
    return 95;
  }

  if (segment.high == null && segment.low != null) {
    if (value >= Number(segment.low)) return 90;
    return 5;
  }

  if (segment.low != null && segment.high != null) {
    const low = Number(segment.low);
    const high = Number(segment.high);
    if (high === low) return 50;
    const percent = ((value - low) / (high - low)) * 100 - 3;
    if (percent <= 10) return 10;
    if (percent > 90) return 90;
    return percent;
  }

  return 50;
}

export function resolveMarkerPosition(
  bounds: ChartBound[],
  value: unknown,
): number | null {
  const numValue = parseNumericValue(value);
  if (numValue === null || bounds.length === 0) return null;

  const sorted = sortChartBounds(bounds);
  const segment =
    findSegmentForValue(sorted, numValue) ??
    findNearestSegment(sorted, numValue);
  const idx = sorted.indexOf(segment);
  const segWidth = 100 / sorted.length;
  const within = resolvePercentWithinSegment(segment, numValue);
  return idx * segWidth + (within / 100) * segWidth;
}

export function findSegmentIndexForValue(
  bounds: ChartBound[],
  value: unknown,
  reverse = false,
): number | null {
  const numValue = parseNumericValue(value);
  if (numValue === null || bounds.length === 0) return null;

  const sorted = sortChartBounds(bounds);
  const segment =
    findSegmentForValue(sorted, numValue) ??
    findNearestSegment(sorted, numValue);
  const sortedIndex = sorted.indexOf(segment);
  if (sortedIndex === -1) return null;

  return reverse ? sorted.length - 1 - sortedIndex : sortedIndex;
}

export function isMarkerOnSegment(
  bounds: ChartBound[],
  segmentIndex: number,
  value: unknown,
  reverse = false,
): boolean {
  const targetIndex = findSegmentIndexForValue(bounds, value, reverse);
  if (targetIndex === null) return false;
  return targetIndex === segmentIndex;
}
