import type { HabitWithCompletions } from "@/types";
import { Flame } from "lucide-react";

type Props = {
  habit: HabitWithCompletions;
  streak: number;
  totalCompletions: number;
  completionRate: number;
};

export function HabitDetailHeader({
  habit,
  streak,
  totalCompletions,
  completionRate,
}: Props) {
  return (
    <div className="flex-1">
      {/* Title row */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: habit.color }}
        />
        <h1 className="text-3xl font-bold tracking-tight">{habit.name}</h1>
      </div>

      {habit.description && (
        <p className="text-muted-foreground text-sm ml-6 mb-4">
          {habit.description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 ml-6 mt-4">
        <div className="rounded-lg border bg-card px-4 py-3 text-center min-w-20">
          <p className="text-2xl font-bold flex items-center justify-center gap-1">
            {streak}
            <Flame size={18} className="text-amber-500" />
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Current streak
          </p>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 text-center min-w-20">
          <p className="text-2xl font-bold">{totalCompletions}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total done
          </p>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 text-center min-w-20">
          <p className="text-2xl font-bold">{completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last 30 days
          </p>
        </div>

        <div className="rounded-lg border bg-card px-4 py-3 text-center min-w-20">
          <p className="text-sm font-medium capitalize">{habit.frequency}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Frequency</p>
        </div>
      </div>
    </div>
  );
}