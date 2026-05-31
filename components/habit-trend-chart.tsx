"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useTheme } from "next-themes";

type WeekData = { week: string; completed: number; total: number };
type Props = { data: WeekData[]; habitColor: string };

export function HabitTrendChart({ data, habitColor }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const mutedColor = isDark ? "#57534e" : "#d6d3d1";
  const textColor = isDark ? "#78716c" : "#a8a29e";

  return (
    <div className="rounded-xl border bg-card p-4">
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={18} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={false}
            tickLine={false}
            domain={[0, 7]}
            ticks={[0, 3, 7]}
          />
          <Tooltip
            cursor={{ fill: isDark ? "#292524" : "#f5f5f4", radius: 4 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as WeekData;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="font-medium">{d.week}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {d.completed} / {d.total} days
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.completed > 0 ? habitColor : mutedColor}
                opacity={entry.completed === 0 ? 0.4 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}