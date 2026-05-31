// import { db } from "@/db";
// import { habits } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

// // GET /api/habits — fetch all habits
// export async function GET() {
//   try {
//     const allHabits = await db
//       .select()
//       .from(habits)
//       .where(eq(habits.isArchived, false))
//       .orderBy(habits.createdAt);

//     return NextResponse.json({
//       success: true,
//       data: allHabits,
//     });
//   } catch (error) {
//     console.error("[GET /api/habits]", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch habits" },
//       { status: 500 }
//     );
//   }
// }

// // POST /api/habits — create a new habit
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, description, color, frequency } = body;

//     // Validation
//     if (!name || name.trim() === "") {
//       return NextResponse.json(
//         { success: false, error: "Habit name is required" },
//         { status: 400 }
//       );
//     }

//     const newHabit = await db
//       .insert(habits)
//       .values({
//         name: name.trim(),
//         description: description?.trim() || null,
//         color: color || "#1D9E75",
//         frequency: frequency || "daily",
//       })
//       .returning();

//     return NextResponse.json(
//       { success: true, data: newHabit[0] },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("[POST /api/habits]", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to create habit" },
//       { status: 500 }
//     );
//   }
// }