import { db } from "@/db";
import { completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");

    if (!habitId) {
      return NextResponse.json(
        { success: false, error: "habitId is required" },
        { status: 400 }
      );
    }

    const allCompletions = await db
      .select()
      .from(completions)
      .where(eq(completions.habitId, habitId))
      .orderBy(completions.date);

    return NextResponse.json({ success: true, data: allCompletions });
  } catch (error) {
    console.error("[GET /api/completions]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch completions" },
      { status: 500 }
    );
  }
}