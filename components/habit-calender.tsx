"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  completedDates: Set<string>;
  todayString: string;
  habitColor: string;
};

export function HabitCalendar({
  completedDates,
  todayString,
  habitColor,
}: Props) {
  // Build last 84 days (12 weeks)
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: dateStr,
      isCompleted: completedDates.has(dateStr),
      isToday: dateStr === todayString,
      label: format(d, "MMM d, yyyy"),
    };
  });

  // Split into weeks
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Day labels */}
      <div className="flex gap-1 mb-1">
        <div className="w-8" /> {/* spacer */}
        {dayLabels.map((d) => (
          <div
            key={d}
            className="w-8 text-center text-[10px] text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex items-center gap-1">
            {/* Week label — show month on first week of month */}
            <div className="w-8 text-[10px] text-muted-foreground text-right pr-1">
              {week[0].date.slice(5, 7) !== weeks[wi > 0 ? wi - 1 : 0][0].date.slice(5, 7) || wi === 0
                ? format(new Date(week[0].date + "T00:00:00"), "MMM")
                : ""}
            </div>

            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.label}${day.isCompleted ? " ✓" : ""}`}
                className={cn(
                  "w-8 h-8 rounded-md transition-all",
                  day.isToday && !day.isCompleted &&
                    "ring-2 ring-offset-1 ring-primary/50",
                  !day.isCompleted && "bg-muted"
                )}
                style={
                  day.isCompleted
                    ? { background: habitColor }
                    : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs text-muted-foreground">Less</span>
        {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
          <div
            key={o}
            className="w-4 h-4 rounded-sm"
            style={{ background: habitColor, opacity: o }}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}