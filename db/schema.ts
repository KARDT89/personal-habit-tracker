import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const habits = pgTable("habits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#1D9E75"),
  frequency: text("frequency").notNull().default("daily"),
  userId: text("user_id"),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const completions = pgTable("completions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  habitId: text("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inferred types — use these across your whole app
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type Completion = typeof completions.$inferSelect;
export type NewCompletion = typeof completions.$inferInsert;