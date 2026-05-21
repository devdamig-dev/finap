"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-card/40 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-tight">HogarIA</p>
          <p className="text-xs text-muted-foreground">Copiloto del hogar</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t">
        <div className="rounded-xl bg-accent/60 p-3">
          <p className="text-xs font-semibold text-accent-foreground">Plan Gratis</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Probá HogarIA Plus para sumar IA real y notificaciones.
          </p>
        </div>
      </div>
    </aside>
  );
}
