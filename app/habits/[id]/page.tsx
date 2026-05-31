import { notFound } from "next/navigation";
import { getHabitDetail } from "@/lib/habit-detail";
import { HabitDetailHeader } from "@/components/habit-detail-header";
import { HabitCalendar } from "@/components/habit-calender";
import { EditHabitDialog } from "@/components/edit-habit-dialog";
import { calculateStreak, getTodayString } from "@/lib/streak";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const habit = await getHabitDetail(id);
  if (!habit) return { title: "Habit not found" };
  return { title: `${habit.name} — streak.` };
}

export default async function HabitDetailPage({ params }: Props) {
  const { id } = await params;
  const habit = await getHabitDetail(id);

  if (!habit) notFound();

  const streak = calculateStreak(habit.completions);
  const todayString = getTodayString();
  const completedDates = new Set(habit.completions.map((c) => c.date));
  const totalCompletions = habit.completions.length;

  // Completion rate over last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
  const last30Completed = last30Days.filter((d) =>
    completedDates.has(d)
  ).length;
  const completionRate = Math.round((last30Completed / 30) * 100);

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <HabitDetailHeader
          habit={habit}
          streak={streak}
          totalCompletions={totalCompletions}
          completionRate={completionRate}
        />
        <EditHabitDialog habit={habit} />
      </div>

      {/* Calendar */}
      <div>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
          Completion history
        </p>
        <HabitCalendar
          completedDates={completedDates}
          todayString={todayString}
          habitColor={habit.color}
        />
      </div>
    </div>
  );
}