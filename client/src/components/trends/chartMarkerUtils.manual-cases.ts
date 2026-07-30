import {
  findSegmentForValue,
  findSegmentIndexForValue,
  resolveMarkerPosition,
  sortChartBounds,
  type ChartBound,
} from './chartMarkerUtils';

const neutrophilsBounds: ChartBound[] = [
  { low: null, high: 30, label: 'Disease', status: 'DiseaseRange' },
  { low: 30, high: 40, label: 'Borderline', status: 'BorderlineRange' },
  { low: 40, high: 48, label: 'Optimal', status: 'OptimalRange' },
  { low: 48, high: 65, label: 'Healthy', status: 'HealthyRange' },
  { low: 65, high: 75, label: 'Borderline', status: 'BorderlineRange' },
  { low: 75, high: null, label: 'Infection', status: 'DiseaseRange' },
];

export const chartMarkerManualCases = [
  {
    name: 'Neutrophils 56% in Healthy segment',
    bounds: neutrophilsBounds,
    value: 56,
    expectedSegment: { low: 48, high: 65, status: 'HealthyRange' },
    expectedIndex: 3,
    expectedPositionRange: [50, 70] as [number, number],
  },
  {
    name: 'Boundary value 48 in Healthy segment',
    bounds: neutrophilsBounds,
    value: 48,
    expectedSegment: { low: 48, high: 65, status: 'HealthyRange' },
    expectedIndex: 3,
  },
  {
    name: 'Open-ended low: value 8 in Disease segment',
    bounds: neutrophilsBounds,
    value: 8,
    expectedSegment: { low: null, high: 30, status: 'DiseaseRange' },
    expectedIndex: 0,
  },
  {
    name: 'Open-ended high: value 80 in Infection segment',
    bounds: neutrophilsBounds,
    value: 80,
    expectedSegment: { low: 75, high: null, status: 'DiseaseRange' },
    expectedIndex: 5,
  },
  {
    name: 'Below minimum clamps to first segment',
    bounds: neutrophilsBounds,
    value: -5,
    expectedIndex: 0,
  },
  {
    name: 'Single-segment biomarker',
    bounds: [{ low: 10, high: 50, label: 'Optimal', status: 'OptimalRange' }],
    value: 20.8,
    expectedIndex: 0,
  },
];

export function runChartMarkerManualCases(): void {
  for (const testCase of chartMarkerManualCases) {
    const sorted = sortChartBounds(testCase.bounds);
    const segment = findSegmentForValue(sorted, testCase.value as number);
    const index = findSegmentIndexForValue(testCase.bounds, testCase.value);
    const position = resolveMarkerPosition(testCase.bounds, testCase.value);

    console.log(`[${testCase.name}]`, {
      segment: segment
        ? { low: segment.low, high: segment.high, status: segment.status }
        : null,
      index,
      position,
      expectedIndex: testCase.expectedIndex,
    });
  }
}
