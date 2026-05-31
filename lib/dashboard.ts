import { db } from "@/db";
import { habits, completions } from "@/db/schema";
import { eq, gte, and, inArray } from "drizzle-orm";
import { getTodayString, getDateString } from "./streak";
import type { HabitWithCompletions } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDashboardData(): Promise<{
  habitsWithCompletions: HabitWithCompletions[];
  todayString: string;
  completedToday: number;
  totalHabits: number;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  const todayString = getTodayString();

  // Fetch all active habits
  const allHabits = await db
    .select()
    .from(habits)
    .where(and(
      eq(habits.isArchived, false),
      eq(habits.userId, session.user.id)
    ))
    .orderBy(habits.createdAt);

  // Fetch last 7 days of completions for all habits in one query
  const sevenDaysAgo = getDateString(-6);

  const habitIds = allHabits.map((h) => h.id);

  const recentCompletions = habitIds.length === 0 ? [] : await db
  .select()
  .from(completions)
  .where(and(
    gte(completions.date, sevenDaysAgo),
    inArray(completions.habitId, habitIds)
  ));

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