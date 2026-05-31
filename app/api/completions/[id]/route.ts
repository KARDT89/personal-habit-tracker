import { db } from "@/db";
import { completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id: habitId } = await params;
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json(
        { success: false, error: "date is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const newCompletion = await db
      .insert(completions)
      .values({ habitId, date })
      .returning();

    return NextResponse.json(
      { success: true, data: newCompletion[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/completions/:habitId]", error);
    return NextResponse.json(
      { success: false, error: "Failed to log completion" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(completions)
      .where(eq(completions.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Completion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Completion removed" },
    });
  } catch (error) {
    console.error("[DELETE /api/completions/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove completion" },
      { status: 500 }
    );
  }
}