import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, BarChart2, CheckCircle2, LayoutDashboard } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="font-serif text-xl tracking-tight">
          streak<span className="text-orange-500">.</span>
        </span>
        {session ? (
          <Button asChild size="sm">
            <Link href="/dashboard">
              <LayoutDashboard size={14} className="mr-2" />
              Dashboard
            </Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Flame size={12} />
          Build habits that stick
        </div>

        <h1 className="font-bold text-4xl sm:text-5xl tracking-tight text-foreground mb-4 max-w-xl leading-tight">
          Small habits.<br />
          <span className="text-primary">Big results.</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-md mb-8">
          Track your daily habits, watch your streaks grow, and become
          the person you want to be — one day at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {session ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                <LayoutDashboard size={16} className="mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/sign-up">
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <feature.icon size={18} />
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
  <p className="text-xs text-muted-foreground">
    Made with ♥ by DT89
  </p>
  <a
    href="https://github.com/KARDT89"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
  >
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
    KARDT89
  </a>
</footer>

    </div>
  );
}