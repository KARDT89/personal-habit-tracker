import type { HabitStat } from "@/lib/stats";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Flame } from "lucide-react";

type Props = { stat: HabitStat };

export function HabitStatCard({ stat }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3 mb-3">
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: stat.color }}
        />

        {/* Name */}
        <p className="text-sm font-medium flex-1 truncate">{stat.name}</p>

        {/* Streak badge */}
        {stat.streak > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
            <Flame size={10} />
            {stat.streak}d
          </span>
        )}

        {/* Link to detail */}
        <Link
          href={`/app/(application)/habits/${stat.id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`View ${stat.name}`}
        >
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Last 7 days dots */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs text-muted-foreground w-16">Last 7d</p>
        <div className="flex gap-1">
          {stat.last7.map((done, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-md",
                done ? "" : "bg-muted"
              )}
              style={done ? { background: stat.color } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Completion rate bar */}
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground w-16">30d rate</p>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${stat.last30Rate}%`,
              background: stat.color,
            }}
          />
        </div>
        <p className="text-xs font-medium w-8 text-right">
          {stat.last30Rate}%
        </p>
      </div>
    </div>
  );
}