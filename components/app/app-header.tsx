"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { household } from "@/lib/mock/household";
import { currentMonthLabel } from "@/lib/utils";

export function AppHeader() {
  const month = currentMonthLabel();
  const admin = household.members[0];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2 min-w-0">
        <div className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          H
        </div>
        <div className="min-w-0">
          <button className="flex items-center gap-1 text-sm font-semibold truncate">
            {household.name}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <p className="text-xs text-muted-foreground capitalize truncate">{month}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notificaciones" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning" />
        </Button>
        <Avatar className="h-9 w-9 border">
          <AvatarFallback
            style={{ backgroundColor: admin.avatarColor, color: "white" }}
          >
            {admin.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
