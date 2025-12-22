import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          // Give nav hover a distinct background so it differs from selected range
          "h-7 w-7 p-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 hover:bg-transparent hover:text-cyan-700 dark:hover:text-cyan-300"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: 
          "h-9 w-9  text-center text-sm p-0 relative " +
          // All selected cells: primary background
          "[&:has([aria-selected])]:bg-primary " +
          // Middle range cells: override with lower opacity using !important to force it
          "[&:has([aria-selected].day-range-middle)]:!bg-primary/20 " +
          // Rounded corners for range
          "[&:has([aria-selected].day-range-end)]:rounded-r-md " +
          "first:[&:has([aria-selected])]:rounded-l-md " +
          "last:[&:has([aria-selected])]:rounded-r-md " +
          // Outside days
          "[&:has([aria-selected].day-outside)]:bg-accent/50 " +
          "focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 m-0 font-normal !rounded-none aria-selected:opacity-100 hover:bg-transparent hover:text-foreground"
        ),
        day_range_end: "day-range-end",
        // Remove button background so cell background shows through seamlessly
        day_selected:
          "bg-transparent text-primary-foreground hover:bg-transparent hover:text-primary-foreground focus:bg-transparent focus:text-primary-foreground",
        day_today: "border border-cyan-400/60 text-cyan-700 dark:text-cyan-300 bg-transparent ",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        // Middle range: remove button background so cell background (with lower opacity) shows through
        // Use !important to override day_selected background
        day_range_middle: 
          "!bg-blue-200 !text-gray-500 ",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
