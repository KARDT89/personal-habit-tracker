import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Habit } from "@/db/schema";

export async function getHabits(): Promise<Habit[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return db
    .select()
    .from(habits)
    .where(and(
      eq(habits.isArchived, false),
      eq(habits.userId, session.user.id)
    ))
    .orderBy(habits.createdAt);
}