import { format } from "date-fns";

type Props = {
  completedToday: number;
  totalHabits: number;
  todayString: string;
};

export function DashboardHeader({ completedToday, totalHabits, todayString }: Props) {
  const date = new Date(todayString + "T00:00:00");
  const formatted = format(date, "EEEE, d MMMM");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-normal tracking-tight">
        {greeting()} 👋
      </h1>
      <p className="text-muted-foreground mt-1.5 text-sm">
        {formatted} · {completedToday} of {totalHabits} habits done today
      </p>
    </div>
  );
}