import { db } from "@/db";
import { habits, completions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { HabitWithCompletions } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getHabitDetail(
  id: string
): Promise<HabitWithCompletions | null> {
  
  try {
  
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("session:", session);
  if (!session) throw new Error("Unauthorized");


  const habit = await db
    .select()
    .from(habits)
    .where(and(
      eq(habits.id, id),
      eq(habits.userId, session.user.id)  // prevents viewing other users' habits
    ))
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
  } catch (e) {
    console.error("getHabitDetail error:", e);
    throw e;
  }
}