import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateHabitDialog } from "@/components/create-habit-dialog";
import { HabitListItem } from "@/components/habit-list-item";

export const metadata = {
  title: "Habits — streak.",
};

export default async function HabitsPage() {
  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.isArchived, false))
    .orderBy(habits.createdAt);

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {allHabits.length} active habit{allHabits.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateHabitDialog />
      </div>

      {/* List */}
      {allHabits.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-xl">
          <p className="text-sm">No habits yet.</p>
          <p className="text-sm mt-1">
            Click the button above to create your first habit.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allHabits.map((habit) => (
            <HabitListItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}