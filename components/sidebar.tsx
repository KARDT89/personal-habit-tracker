"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, BarChart2, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits",    label: "Habits",    icon: ListChecks   },
  { href: "/stats",     label: "Stats",     icon: BarChart2    },
];

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNav}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith(href)
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNav }: { onNav?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <Link href="/" onClick={onNav}>
          <span className="font-serif text-xl tracking-tight">
            streak<span className="text-orange-500">.</span>
          </span>
        </Link>
      </div>
      <NavLinks onNav={onNav} />
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Single user</p>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Desktop — fixed sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 border-r border-border bg-background flex-col z-20">
        <SidebarInner />
      </aside>

      {/* Mobile — top bar + Sheet drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-background border-b border-border flex items-center justify-between px-4 h-14">
        <Link href="/">
          <span className="font-serif text-xl tracking-tight">
            streak<span className="text-orange-500">.</span>
          </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarInner />
          </SheetContent>
        </Sheet>
      </div>

      {/* Push content down on mobile (topbar height) */}
      <div className="md:hidden h-14" />
    </>
  );
}