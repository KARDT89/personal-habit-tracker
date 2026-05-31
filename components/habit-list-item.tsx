"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteHabit } from "@/actions/habit-actions";
import type { Habit } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  habit: Habit;
};

export function HabitListItem({ habit }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Archive "${habit.name}"?`)) return;
    startTransition(async () => {
      await deleteHabit(habit.id);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 transition-opacity",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ background: habit.color }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{habit.name}</p>
        {habit.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {habit.description}
          </p>
        )}
      </div>

      {/* Frequency badge */}
      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md capitalize">
        {habit.frequency}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete habit"
        >
          <Trash2 size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/app/(application)/habits/${habit.id}`} aria-label="View habit">
            <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </div>
  );
}