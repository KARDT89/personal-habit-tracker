import type { StatsData } from "@/lib/stats";
import { Flame, CheckCircle2, BarChart2, ListChecks } from "lucide-react";

type Props = { stats: StatsData };

export function StatsOverview({ stats }: Props) {
  const cards = [
    {
      label: "Total habits",
      value: stats.totalHabits,
      sub: "active habits",
      icon: ListChecks,
      accent: false,
    },
    {
      label: "Total completions",
      value: stats.totalCompletions,
      sub: "all time",
      icon: CheckCircle2,
      accent: false,
    },
    {
      label: "Best streak",
      value: `${stats.bestStreak} 🔥`,
      sub: stats.bestStreakHabit,
      icon: Flame,
      accent: true,
    },
    {
      label: "Avg completion",
      value: `${stats.avgCompletionRate}%`,
      sub: "last 30 days",
      icon: BarChart2,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={
            card.accent
              ? "rounded-xl bg-primary p-5 text-primary-foreground"
              : "rounded-xl border bg-card p-5"
          }
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-xs font-medium uppercase tracking-widest ${
                card.accent ? "opacity-70" : "text-muted-foreground"
              }`}
            >
              {card.label}
            </p>
            <card.icon
              size={16}
              className={card.accent ? "opacity-70" : "text-muted-foreground"}
            />
          </div>
          <p className="text-3xl font-bold">{card.value}</p>
          <p
            className={`text-xs mt-1 truncate ${
              card.accent ? "opacity-70" : "text-muted-foreground"
            }`}
          >
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}