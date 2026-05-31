"use server";

import { db } from "@/db";
import { completions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleCompletion(
  habitId: string,
  date: string
): Promise<void> {
  // Check if already completed today
  const existing = await db
    .select()
    .from(completions)
    .where(
      and(eq(completions.habitId, habitId), eq(completions.date, date))
    )
    .limit(1);

  if (existing.length > 0) {
    // Already done — remove it (uncheck)
    await db
      .delete(completions)
      .where(eq(completions.id, existing[0].id));
  } else {
    // Not done — add it (check)
    await db.insert(completions).values({ habitId, date });
  }

  revalidatePath("/dashboard");
}