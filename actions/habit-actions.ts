"use server";

import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createHabit(formData: FormData): Promise<void> {
  const session = await getSession();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const frequency = formData.get("frequency") as string;

  if (!name?.trim()) throw new Error("Habit name is required");

  await db.insert(habits).values({
    name: name.trim(),
    description: description?.trim() || null,
    color: color || "#1D9E75",
    frequency: frequency || "daily",
    userId: session.user.id,
  });

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function updateHabit(id: string, formData: FormData): Promise<void> {
  const session = await getSession();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const frequency = formData.get("frequency") as string;

  if (!name?.trim()) throw new Error("Habit name is required");

  await db
    .update(habits)
    .set({
      name: name.trim(),
      description: description?.trim() || null,
      color: color || "#1D9E75",
      frequency: frequency || "daily",
      updatedAt: new Date(),
    })
    .where(and(
      eq(habits.id, id),
      eq(habits.userId, session.user.id)  // can't update another user's habit
    ));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function deleteHabit(id: string): Promise<void> {
  const session = await getSession();

  await db
    .update(habits)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(and(
      eq(habits.id, id),
      eq(habits.userId, session.user.id)
    ));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}