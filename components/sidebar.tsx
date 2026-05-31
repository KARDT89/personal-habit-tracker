import Link from "next/link";
import { SidebarNav } from "./sidebar-nav-item";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-background flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <Link href="/">
          <span className="font-bold text-xl tracking-tight">
            streak<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      {/* Nav — client component handles active state */}
      <SidebarNav />

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Single user mode</p>
        <ThemeToggle />
    </div>

    </aside>
  );
}