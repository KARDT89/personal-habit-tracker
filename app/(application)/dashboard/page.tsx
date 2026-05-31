import { getDashboardData } from "@/lib/dashboard";
import { HabitCard } from "@/components/habit-card";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsRow } from "@/components/stats-row";

export const metadata = { title: "Dashboard — streak." };

export default async function DashboardPage() {
  const { habitsWithCompletions, todayString, completedToday, totalHabits } =
    await getDashboardData();

  const completionPercent =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <DashboardHeader
        completedToday={completedToday}
        totalHabits={totalHabits}
        todayString={todayString}
      />
      <StatsRow
        completedToday={completedToday}
        totalHabits={totalHabits}
        completionPercent={completionPercent}
        habitsWithCompletions={habitsWithCompletions}
      />
      <div className="mt-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
          Today's habits
        </p>
        {totalHabits === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl">
            <p className="text-sm">No habits yet.</p>
            <p className="text-sm mt-1">Add your first habit to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habitsWithCompletions.map((habit) => (
              <HabitCard key={habit.id} habit={habit} todayString={todayString} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}