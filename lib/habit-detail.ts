import { db } from "@/db";
import { habits, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { HabitWithCompletions } from "@/types";

export async function getHabitDetail(
  id: string
): Promise<HabitWithCompletions | null> {
  const habit = await db
    .select()
    .from(habits)
    .where(eq(habits.id, id))
    .limit(1);

  if (habit.length === 0) return null;

  const allCompletions = await db
    .select()
    .from(completions)
    .where(eq(completions.habitId, id))
    .orderBy(completions.date);

  return {
    ...habit[0],
    completions: allCompletions,
  };
}