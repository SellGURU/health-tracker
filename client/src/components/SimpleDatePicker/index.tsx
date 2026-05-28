import { useState, useEffect, useRef } from "react";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  placeholder?: string;
  isAddClient?: boolean;
  inValid?: boolean;
  errorMessage?: string;
  ClassName?: string;
  textStyle?: boolean;
  onManualOpen?: () => void;
  validation?: boolean;
  isUploadFile?: boolean;
}

export default function SimpleDatePicker({
  date,
  setDate,
  placeholder,
  isAddClient,
  inValid,
  errorMessage,
  ClassName,
  textStyle,
  validation,
  onManualOpen,
  isUploadFile,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selectedDay = date
    ? {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
    : null;

  return (
    <div className="relative inline-block w-full h-[40px]" ref={calendarRef}>
      <button
        onClick={() => {
          setOpen(!open);
          onManualOpen?.();
        }}
        type="button"
        className={`
         px-2 py-1 bg-green-200 flex items-center justify-between ${
           textStyle
             ? " text-[10px] md:text-xs text-[#383838]"
             : "text-[10px] text-[#38383899]"
         }  ${
          validation
            ? "!border-red-500 border"
            : inValid
            ? "border-red-500"
            : !isAddClient && "border border-gray-500"
        } w-full h-full rounded-lg ${ClassName}`}
      >
        {date ? (
          <span className="text-xs md:text-sm">
            {date.toLocaleDateString()}
          </span>
        ) : (
          <div className="text-muted-foreground text-sm font-medium">
            {placeholder}
          </div>
        )}
        <img src="/icons/calendar-3.svg" alt="Calendar" />
      </button>

      {open && (
        <div
          className={`absolute w-full bottom-full mb-2 ${
            isUploadFile ? "right-[70px]" : "right-0"
          }  z-[999] `}
        >
          <Calendar
            value={selectedDay}
            onChange={(newDate) => {
              if (newDate) {
                setDate(new Date(newDate.year, newDate.month - 1, newDate.day));
              }
              setOpen(false);
            }}
            shouldHighlightWeekends
          />
        </div>
      )}

      {inValid && errorMessage && (
        <span className="text-red-500 text-[10px] relative top-[0px]">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
