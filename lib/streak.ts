import type { Completion } from "@/db/schema";

// Calculate current streak for a habit
export function calculateStreak(completions: Completion[]): number {
  if (completions.length === 0) return 0;

  // Get unique dates and sort descending
  const dates = completions
    .map((c) => c.date)
    .sort((a, b) => b.localeCompare(a));

  const today = getTodayString();
  const yesterday = getDateString(-1);

  // Streak must start from today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const expected = getDateString(
      -(streak + (dates[0] === yesterday ? 1 : 0))
    );
    if (dates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Get today's date as "YYYY-MM-DD"
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Get a date offset from today as "YYYY-MM-DD"
export function getDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// Get last N dates as "YYYY-MM-DD" strings (for the dot history row)
export function getLastNDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => getDateString(-(n - 1 - i)));
}