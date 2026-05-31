"use server";

import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createHabit(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const frequency = formData.get("frequency") as string;

  if (!name || name.trim() === "") {
    throw new Error("Habit name is required");
  }

  await db.insert(habits).values({
    name: name.trim(),
    description: description?.trim() || null,
    color: color || "#1D9E75",
    frequency: frequency || "daily",
  });

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function deleteHabit(id: string): Promise<void> {
  await db
    .update(habits)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(eq(habits.id, id));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function updateHabit(
  id: string,
  formData: FormData
): Promise<void> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const frequency = formData.get("frequency") as string;

  if (!name || name.trim() === "") {
    throw new Error("Habit name is required");
  }

  await db
    .update(habits)
    .set({
      name: name.trim(),
      description: description?.trim() || null,
      color: color || "#1D9E75",
      frequency: frequency || "daily",
      updatedAt: new Date(),
    })
    .where(eq(habits.id, id));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}