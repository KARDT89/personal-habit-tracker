import { db } from "@/db";
import { habits, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateStreak, getDateString } from "./streak";

export type HabitStat = {
  id: string;
  name: string;
  color: string;
  streak: number;
  totalCompletions: number;
  last30Rate: number;
  last7: boolean[]; // true = completed, false = missed
};

export type StatsData = {
  totalHabits: number;
  totalCompletions: number;
  bestStreak: number;
  bestStreakHabit: string;
  avgCompletionRate: number;
  habitStats: HabitStat[];
};

export async function getStatsData(): Promise<StatsData> {
  // Fetch all active habits
  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.isArchived, false));

  if (allHabits.length === 0) {
    return {
      totalHabits: 0,
      totalCompletions: 0,
      bestStreak: 0,
      bestStreakHabit: "None",
      avgCompletionRate: 0,
      habitStats: [],
    };
  }

  // Fetch all completions for all habits
  const allCompletions = await db.select().from(completions);

  // Build last 30 days array
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    getDateString(-(29 - i))
  );

  // Build last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    getDateString(-(6 - i))
  );

  const habitStats: HabitStat[] = allHabits.map((habit) => {
    const habitCompletions = allCompletions.filter(
      (c) => c.habitId === habit.id
    );
    const completedDates = new Set(habitCompletions.map((c) => c.date));

    const streak = calculateStreak(habitCompletions);

    const last30Completed = last30Days.filter((d) =>
      completedDates.has(d)
    ).length;
    const last30Rate = Math.round((last30Completed / 30) * 100);

    const last7 = last7Days.map((d) => completedDates.has(d));

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      streak,
      totalCompletions: habitCompletions.length,
      last30Rate,
      last7,
    };
  });

  // Aggregate stats
  const totalCompletions = allCompletions.length;
  const bestStreakStat = habitStats.reduce(
    (best, h) => (h.streak > best.streak ? h : best),
    habitStats[0]
  );
  const avgCompletionRate = Math.round(
    habitStats.reduce((sum, h) => sum + h.last30Rate, 0) / habitStats.length
  );

  return {
    totalHabits: allHabits.length,
    totalCompletions,
    bestStreak: bestStreakStat.streak,
    bestStreakHabit: bestStreakStat.name,
    avgCompletionRate,
    habitStats,
  };
}