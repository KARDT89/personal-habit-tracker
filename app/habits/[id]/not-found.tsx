import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HabitNotFound() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold mb-2">Habit not found</h1>
      <p className="text-muted-foreground text-sm mb-6">
        This habit may have been deleted or never existed.
      </p>
      <Button asChild variant="outline">
        <Link href="/habits">Back to habits</Link>
      </Button>
    </div>
  );
}