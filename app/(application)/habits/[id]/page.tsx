import { notFound } from "next/navigation";
import { getHabitDetail } from "@/lib/habit-detail";
import { HabitDetailHeader } from "@/components/habit-detail-header";
import { HabitCalendar } from "@/components/habit-calender";
import { HabitTrendChart } from "@/components/habit-trend-chart";
import { EditHabitDialog } from "@/components/edit-habit-dialog";
import { calculateStreak, getTodayString } from "@/lib/streak";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

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
  console.log(id)

  const streak = calculateStreak(habit.completions);
  const todayString = getTodayString();
  const completedDates = new Set(habit.completions.map((c) => c.date));
  const totalCompletions = habit.completions.length;

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
  const last30Completed = last30Days.filter((d) => completedDates.has(d)).length;
  const completionRate = Math.round((last30Completed / 30) * 100);

  // Build 12-week data for the trend chart
  const weeklyData = Array.from({ length: 12 }, (_, wi) => {
    const weekDays = Array.from({ length: 7 }, (_, di) => {
      const d = new Date();
      d.setDate(d.getDate() - (11 - wi) * 7 - (6 - di));
      return d.toISOString().split("T")[0];
    });
    const completed = weekDays.filter((d) => completedDates.has(d)).length;
    const label = new Date(weekDays[0] + "T00:00:00").toLocaleDateString("en", {
      month: "short", day: "numeric",
    });
    return { week: label, completed, total: 7 };
  });

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/habits"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Habits
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <HabitDetailHeader
          habit={habit}
          streak={streak}
          totalCompletions={totalCompletions}
          completionRate={completionRate}
        />
      </div>
      <div className="absolute top-18 right-6 md:left-220">
          <EditHabitDialog habit={habit} />
      </div>

      {/* Trend chart */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
          Weekly completions — last 12 weeks
        </p>
        <HabitTrendChart data={weeklyData} habitColor={habit.color} />
      </div>

      {/* Calendar */}
      <div>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
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