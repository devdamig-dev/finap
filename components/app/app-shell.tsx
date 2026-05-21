import { AppHeader } from "./app-header";
import { DesktopSidebar } from "./desktop-sidebar";
import { FloatingAddButton } from "./floating-add-button";
import { MobileBottomNav } from "./mobile-bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <AppHeader />
        <main className="flex-1 pb-24 lg:pb-10">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">{children}</div>
        </main>
        <FloatingAddButton />
        <MobileBottomNav />
      </div>
    </div>
  );
}
