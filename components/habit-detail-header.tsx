import type { HabitWithCompletions } from "@/types";
import { Flame } from "lucide-react";

type Props = {
  habit: HabitWithCompletions;
  streak: number;
  totalCompletions: number;
  completionRate: number;
};

export function HabitDetailHeader({ habit, streak, totalCompletions, completionRate }: Props) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
          style={{ background: habit.color }}
        />
        <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-tight leading-tight">
          {habit.name}
        </h1>
      </div>

      {habit.description && (
        <p className="text-muted-foreground text-sm ml-5 mb-1">{habit.description}</p>
      )}

      {/* 2×2 stat grid — works on all screen sizes */}
      <div className="grid grid-cols-2 gap-2 mt-5">
        <div className="rounded-xl border px-4 py-3 bg-foreground text-background">
          <p className="text-xs font-medium uppercase tracking-widest opacity-50 mb-1">
            Current streak
          </p>
          <p className="text-2xl font-serif font-normal flex items-center gap-1.5">
            {streak}
            <Flame size={18} className="text-orange-400" />
          </p>
          <p className="text-xs opacity-50 mt-0.5">days in a row</p>
        </div>

        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Last 30 days
          </p>
          <p className="text-2xl font-serif font-normal">{completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">completion rate</p>
        </div>

        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Total done
          </p>
          <p className="text-2xl font-serif font-normal">{totalCompletions}</p>
          <p className="text-xs text-muted-foreground mt-0.5">all time</p>
        </div>

        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Frequency
          </p>
          <p className="text-lg font-medium capitalize">{habit.frequency}</p>
          <p className="text-xs text-muted-foreground mt-0.5">schedule</p>
        </div>
      </div>
    </div>
  );
}