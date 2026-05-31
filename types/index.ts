import type { Habit, Completion } from "@/db/schema";

// Re-export db types
export type { Habit, Completion };

// Habit with its completions attached — used on dashboard and habit detail page
export type HabitWithCompletions = Habit & {
  completions: Completion[];
};

// API response shape — every API route returns this
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};