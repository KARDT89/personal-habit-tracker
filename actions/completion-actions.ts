"use server";

import { db } from "@/db";
import { completions, habits } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleCompletion(habitId: string, date: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Verify the habit belongs to this user before toggling
  const habit = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)))
    .limit(1);

  if (habit.length === 0) throw new Error("Habit not found");

  const existing = await db
    .select()
    .from(completions)
    .where(and(eq(completions.habitId, habitId), eq(completions.date, date)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(completions).where(eq(completions.id, existing[0].id));
  } else {
    await db.insert(completions).values({ habitId, date });
  }

  revalidatePath("/dashboard");
}