import { format } from "date-fns";

type Props = {
  completedToday: number;
  totalHabits: number;
  todayString: string;
};

export function DashboardHeader({
  completedToday,
  totalHabits,
  todayString,
}: Props) {
  const date = new Date(todayString + "T00:00:00");
  const formatted = format(date, "EEEE, d MMMM");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {formatted} · {completedToday} of {totalHabits} habits done today
        </p>
      </div>
    </div>
  );
}