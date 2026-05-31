export const revalidate = 3600;

import { getStatsData } from "@/lib/stats";
import { StatsOverview } from "@/components/stats-overview";
import { HabitStatCard } from "@/components/habit-stat-card";

export const metadata = { title: "Stats — streak." };

export default async function StatsPage() {
  const stats = await getStatsData();

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal tracking-tight">Stats</h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Your habit performance overview · updates every hour
        </p>
      </div>

      <StatsOverview stats={stats} />

      {stats.habitStats.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-xl mt-8">
          <p className="text-sm">No habits to show stats for yet.</p>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
            Per habit breakdown
          </p>
          <div className="flex flex-col gap-3">
            {stats.habitStats
              .sort((a, b) => b.last30Rate - a.last30Rate)
              .map((stat) => (
                <HabitStatCard key={stat.id} stat={stat} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}