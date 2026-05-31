import { calculateStreak } from "@/lib/streak";
import type { HabitWithCompletions } from "@/types";

type Props = {
  completedToday: number;
  totalHabits: number;
  completionPercent: number;
  habitsWithCompletions: HabitWithCompletions[];
};

export function StatsRow({
  completedToday,
  totalHabits,
  completionPercent,
  habitsWithCompletions,
}: Props) {
  // Find the best streak across all habits
  const bestStreak = Math.max(
    0,
    ...habitsWithCompletions.map((h) => calculateStreak(h.completions))
  );

  // Find which habit has the best streak
  const bestHabit = habitsWithCompletions.find(
    (h) => calculateStreak(h.completions) === bestStreak
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Best streak */}
      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-xs font-medium uppercase tracking-widest opacity-70">
          Best streak
        </p>
        <p className="text-3xl font-bold mt-2">
          {bestStreak} 🔥
        </p>
        <p className="text-xs opacity-70 mt-1 truncate">
          {bestHabit?.name ?? "No habits yet"}
        </p>
      </div>

      {/* Today's completion */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Today
        </p>
        <p className="text-2xl font-bold mt-2">{completionPercent}%</p>
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {completedToday} of {totalHabits} done
        </p>
      </div>

      {/* Total habits */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Total habits
        </p>
        <p className="text-3xl font-bold mt-2">{totalHabits}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {totalHabits === 0 ? "Add your first habit" : "Active habits"}
        </p>
      </div>
    </div>
  );
}