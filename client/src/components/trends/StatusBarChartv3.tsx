import TooltipText from "../TooltipText";
import {
  findSegmentIndexForValue,
  resolveMarkerPosition,
  sortChartBounds,
} from "./chartMarkerUtils";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface StatusBarChartv3Props {
  data: any;
  isCustom?: boolean;
  values?: Array<any>;
  unit?: string;
  status?: Array<any>;
}

const StatusBarChartv3: React.FC<StatusBarChartv3Props> = ({
  data,
  isCustom,
  values,
  unit,
}) => {
  const sortedBounds = sortChartBounds(data);
  const markerPosition = values?.[0] != null
    ? resolveMarkerPosition(data, values[0])
    : null;
  const markerSegmentIndex =
    values?.[0] != null ? findSegmentIndexForValue(data, values[0]) : null;

  const resolveColor = (key: string) => {
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

  const isValidBarColor = (color?: string | null) => {
    if (!color || color.trim() === '') return false;
    const normalized = color.trim().toLowerCase();
    if (
      normalized === 'transparent' ||
      normalized === 'none' ||
      normalized === 'inherit' ||
      normalized === 'currentcolor' ||
      normalized === 'white' ||
      normalized === '#fff' ||
      normalized === '#ffffff'
    ) {
      return false;
    }
    return (
      /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(normalized) ||
      /^(rgb|rgba|hsl|hsla)\(/.test(normalized)
    );
  };

  const resolveSegmentColor = (status: string, color?: string | null) => {
    if (isValidBarColor(color)) {
      return color!.trim();
    }
    return resolveColor(status);
  };

  const createGradient = (bounds: any[], index: number) => {
    const currentItem = bounds[index];
    const nextItem = bounds[index + 1];

    const currentColor = resolveSegmentColor(
      currentItem.status,
      currentItem.color,
    );

    if (!nextItem) {
      return currentColor;
    }

    const nextColor = resolveSegmentColor(nextItem.status, nextItem.color);

    return `linear-gradient(to right, ${currentColor} 80%, ${nextColor} 100%)`;
  };

  const getRangeString = (el: {
    low: string | number | null;
    high: string | number | null;
  }): string => {
    const normalize = (val: string | number | null): string | null => {
      if (val == null || val === '') return null;
      return String(val).trim();
    };

    const isNumeric = (val: string | number | null): boolean => {
      if (val == null || val === '') return false;
      return !isNaN(Number(val));
    };

    const formatNumber = (val: string | number): string => {
      const num = Number(val);
      return Number.isNaN(num) ? String(val) : String(num);
    };

    const low = normalize(el.low);
    const high = normalize(el.high);

    if (low && high) {
      if (isNumeric(low) && isNumeric(high)) {
        if (Number(low) === Number(high)) {
          return formatNumber(low);
        }
      } else if (low.toLowerCase() === high.toLowerCase()) {
        return low;
      }
    }

    if (!low && high) return `< ${high}`;
    if (!high && low) return `> ${low}`;
    if (low && high) return `${low} - ${high}`;

    return '';
  };

  return (
    <div className="w-full relative flex select-none">
      {sortedBounds.map((el: any, index: number) => {
        return (
          <div
            key={`segment-${index}-${el.status}-${el.low}-${el.high}`}
            className={` relative  h-[8px] ${index == sortedBounds.length - 1 && 'rounded-r-[8px] '} ${index == 0 && 'rounded-l-[8px]'}`}
            style={{
              width: 100 / sortedBounds.length + '%',
              background: createGradient(sortedBounds, index),
            }}
          >
            <div
              className={`absolute w-full px-[1px] ${isCustom ? 'text-[#888888]' : 'text-[#005f73]'}  flex justify-center left-[-4px] top-[-35px] opacity-90 leading-tight text-[8px] min-[360px]:text-[9px] sm:text-[10px]`}
            >
              <TooltipText tooltipValue={el.label}>{el.label}</TooltipText>
            </div>
            <div
              className={`absolute w-full px-[1px] ${isCustom ? 'text-[#B0B0B0]' : 'text-[#005f73]'}  flex justify-center items-center flex-nowrap left-[-4px] top-[-20px] opacity-90 leading-tight text-[8px] min-[360px]:text-[9px] sm:text-[10px]`}
            >
              {el.label != '' && <span className="shrink-0">(</span>}
              <TooltipText tooltipValue={getRangeString(el)}>
                <>{getRangeString(el)}</>
              </TooltipText>
              {el.label != '' && <span className="shrink-0">)</span>}
            </div>
          </div>
        );
      })}
      {markerPosition != null && (
        <div
          className="absolute top-[2px] z-[8]"
          style={{
            left: `${markerPosition}%`,
          }}
        >
          <div className="w-1 h-1 rotate-45 bg-[#005f73]"></div>
          <div className="w-[2px] h-[9px] ml-[1.3px] bg-[#005f73]"></div>
          <div
            className="text-[10px] w-max flex justify-center ml-[0px] items-center gap-[2px] text-[#005f73]"
            style={{
              marginLeft:
                markerSegmentIndex === 0
                  ? '0px'
                  : '-' +
                    ((String(values?.[0] ?? '').length || 0) +
                      (unit?.length || 0)) *
                      6.3 +
                    'px',
            }}
          >
            <span className="opacity-40">You: </span>
            {values && values[0]}{' '}
            <span className="opacity-70">{unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBarChartv3;
