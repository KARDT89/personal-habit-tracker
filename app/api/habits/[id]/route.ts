import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const habit = await db
      .select()
      .from(habits)
      .where(eq(habits.id, id))
      .limit(1);

    if (habit.length === 0) {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: habit[0] });
  } catch (error) {
    console.error("[GET /api/habits/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habit" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, color, frequency } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Habit name is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(habits)
      .set({
        name: name.trim(),
        description: description?.trim() || null,
        color: color || "#1D9E75",
        frequency: frequency || "daily",
        updatedAt: new Date(),
      })
      .where(eq(habits.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[PUT /api/habits/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const deleted = await db
      .update(habits)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(habits.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Habit archived successfully" },
    });
  } catch (error) {
    console.error("[DELETE /api/habits/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}