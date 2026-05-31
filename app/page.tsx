import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, BarChart2, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "Track daily habits",
    description: "Check off habits every day and build consistency over time.",
  },
  {
    icon: Flame,
    title: "Build streaks",
    description: "See your current streak per habit and keep the momentum going.",
  },
  {
    icon: BarChart2,
    title: "Measure progress",
    description: "Weekly and monthly stats show you exactly how consistent you are.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Flame size={12} />
          Build habits that stick
        </div>

        <h1 className="font-syne font-bold text-5xl tracking-tight text-foreground mb-4 max-w-xl">
          Small habits.<br />
          <span className="text-primary">Big results.</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Track your daily habits, watch your streaks grow, and become
          the person you want to be — one day at a time.
        </p>

        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Go to dashboard <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/habits">View habits</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <feature.icon size={18} />
              </div>
              <h3 className="font-syne font-semibold text-sm text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}