import {
  findSegmentIndexForValue,
  isMarkerOnSegment,
  sortChartBounds,
} from './chartMarkerUtils';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface HistoricalChartProps {
  statusBar: any;
  dataPoints: number[];
  labels: string[];
  dataStatus: Array<string>;
}

const HistoricalChart = ({
  statusBar,
  dataPoints,
  labels,
}: HistoricalChartProps) => {
  const resolveColor = (key: string, color?: string) => {
    if (color && color != '') {
      return color;
    }
    if (key == 'Needs Focus' || key == 'CriticalRange') {
      return '#B2302E';
    }
    if (key == 'DiseaseRange') {
      return '#BA5225';
    }
    if (key == 'Ok' || key == 'BorderlineRange') {
      return '#D8D800';
    }
    if (key == 'Good' || key == 'HealthyRange') {
      return '#72C13B';
    }
    if (key == 'Excellent' || key == 'OptimalRange') {
      return '#37B45E';
    }
    return '#FBAD37';
  };

  const sortedStatusBars = sortChartBounds(statusBar).reverse();

  const getStatusVerticalPosition = (value?: number) => {
    if (value === undefined) return 0;

    const segmentIndex = findSegmentIndexForValue(statusBar, value, true);
    if (segmentIndex === null) return 0;

    const rowHeight = 70 / sortedStatusBars.length;
    return segmentIndex * rowHeight + rowHeight / 2;
  };

  return (
    <>
      <div className="w-full h-full relative pr-4">
        <svg
          className="absolute w-full h-full top-0 left-3"
          style={{ zIndex: 0, overflow: 'visible' }}
        >
          <defs>
            <marker
              id="dot"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
            >
              <circle cx="5" cy="5" r="2" fill="#888888" />
            </marker>
          </defs>
          {dataPoints.map((_point, index) => {
            if (index === dataPoints.length - 1) return null;

            const currentValue = dataPoints[index];
            const nextValue = dataPoints[index + 1];

            const x1 = index * 43 + 10;
            const x2 = (index + 1) * 43 + 10;
            const y1 = getStatusVerticalPosition(currentValue);
            const y2 = getStatusVerticalPosition(nextValue);

            return (
              <line
                key={`line-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#888888"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}
        </svg>

        {sortedStatusBars.map((el: any, inde: number) => {
          return (
            <div
              key={`status-${inde}`}
              className="w-full relative"
              style={{
                height: 70 / sortedStatusBars.length + 'px',
              }}
            >
              <div
                className="w-full h-full opacity-15"
                style={{ backgroundColor: resolveColor(el.status, el.color) }}
              ></div>

              <div
                className="w-full h-full absolute border-r-[5px] pl-2 top-0 items-center flex justify-start"
                style={{ borderColor: resolveColor(el.status, el.color) }}
              >
                {dataPoints.map((point, index) => {
                  const showMarker = isMarkerOnSegment(
                    statusBar,
                    inde,
                    point,
                    true,
                  );
                  return (
                    <div
                      key={`point-${index}`}
                      className="w-[40px] ml-1 relative"
                    >
                      <div
                        style={{
                          backgroundColor: resolveColor(el.status, el.color),
                          opacity: showMarker ? 1 : 0,
                          visibility: showMarker ? 'visible' : 'hidden',
                        }}
                        className="w-2 h-2 border border-gray-50 rounded-full relative"
                      >
                        <div className="absolute -top-4 left-1/2 max-w-[40px] text-ellipsis overflow-hidden transform text-[8px] text-Text-Primary -translate-x-1/2 py-1 rounded whitespace-nowrap z-10">
                          {point}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {el.high ? (
                <div className="absolute right-[8px]  text-nowrap overflow-hidden text-[8px] bottom-[4px] opacity-35 text-center">
                  {el.high}
                </div>
              ) : (
                <div className="absolute right-[8px]  text-nowrap overflow-hidden text-[8px] bottom-[4px] opacity-35 text-center">
                  {el.low + '<'}
                </div>
              )}
            </div>
          );
        })}

        <div>
          <div className="flex justify-start items-center w-full ml-2 mt-1">
            {labels.map((label, index) => (
              <div key={index} className="text-[8px] w-[40px]">
                <div className="flex justify-start text-[#888888] font-medium  items-center">
                  <div>{label.split('-')[2]}.</div>
                  <div>{label.split('-')[1]}.</div>
                </div>
                <div className="text-[#B0B0B0] mt-[-2px] ml-[2px]">
                  {label.split('-')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoricalChart;
