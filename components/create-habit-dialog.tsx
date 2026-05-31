"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createHabit } from "@/actions/habit-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const COLOR_OPTIONS = [
  { label: "Green", value: "#1D9E75" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Orange", value: "#F97316" },
  { label: "Pink", value: "#EC4899" },
  { label: "Red", value: "#EF4444" },
];

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("#1D9E75");
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    // Manually append select values since shadcn Select
    // doesn't work with native FormData
    formData.set("color", selectedColor);
    formData.set("frequency", selectedFrequency);

    try {
      await createHabit(formData);
      setOpen(false);
      formRef.current?.reset();
      setSelectedColor("#1D9E75");
      setSelectedFrequency("daily");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          New habit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new habit</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Morning run"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. Run 5km every morning"
            />
          </div>

          {/* Frequency */}
          <div className="flex flex-col gap-1.5">
            <Label>Frequency</Label>
            <Select
              value={selectedFrequency}
              onValueChange={setSelectedFrequency}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{ background: c.value }}
                  aria-label={c.label}
                >
                  {selectedColor === c.value && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-full h-full p-1"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}