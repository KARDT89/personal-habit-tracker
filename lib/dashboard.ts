import { db } from "@/db";
import { habits, completions } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { getTodayString, getDateString } from "./streak";
import type { HabitWithCompletions } from "@/types";

export async function getDashboardData(): Promise<{
  habitsWithCompletions: HabitWithCompletions[];
  todayString: string;
  completedToday: number;
  totalHabits: number;
}> {
  const todayString = getTodayString();

  // Fetch all active habits
  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.isArchived, false))
    .orderBy(habits.createdAt);

  // Fetch last 7 days of completions for all habits in one query
  const sevenDaysAgo = getDateString(-6);
  const recentCompletions = await db
    .select()
    .from(completions)
    .where(gte(completions.date, sevenDaysAgo));

  // Attach completions to each habit
  const habitsWithCompletions: HabitWithCompletions[] = allHabits.map(
    (habit) => ({
      ...habit,
      completions: recentCompletions.filter((c) => c.habitId === habit.id),
    })
  );

  const completedToday = habitsWithCompletions.filter((h) =>
    h.completions.some((c) => c.date === todayString)
  ).length;

  return {
    habitsWithCompletions,
    todayString,
    completedToday,
    totalHabits: allHabits.length,
  };
}