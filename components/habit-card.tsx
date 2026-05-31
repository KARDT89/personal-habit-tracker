"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleCompletion } from "@/actions/completion-actions";
import { calculateStreak, getLastNDates } from "@/lib/streak";
import type { HabitWithCompletions } from "@/types";
import { Flame } from "lucide-react";

type Props = {
  habit: HabitWithCompletions;
  todayString: string;
};

export function HabitCard({ habit, todayString }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const completedDates = new Set(habit.completions.map((c) => c.date));
  const isDoneToday = completedDates.has(todayString);
  const streak = calculateStreak(habit.completions);
  const last7 = getLastNDates(7);

  function handleToggle() {
    startTransition(async () => {
      await toggleCompletion(habit.id, todayString);
      router.refresh(); // re-fetch server component data
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 transition-opacity",
        isPending && "opacity-50",
        isDoneToday ? "border-border" : "border-dashed border-border"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={isDoneToday ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          isDoneToday
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground hover:border-primary"
        )}
      >
        {isDoneToday && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            isDoneToday && "line-through text-muted-foreground"
          )}
        >
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground capitalize">
            {habit.frequency}
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              <Flame size={10} />
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Last 7 days dots */}
      <div className="flex gap-1">
        {last7.map((date) => (
          <div
            key={date}
            title={date}
            className={cn(
              "w-2 h-2 rounded-sm",
              date === todayString
                ? isDoneToday
                  ? "bg-primary"
                  : "bg-muted-foreground/30 ring-1 ring-primary"
                : completedDates.has(date)
                ? "bg-primary/70"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Color dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: habit.color }}
      />
    </div>
  );
}