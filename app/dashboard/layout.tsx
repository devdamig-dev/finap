import { AppShell } from "@/components/app/app-shell";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { ActionProvider } from "@/components/forms/action-context";
import { ActionModalRoot } from "@/components/forms/action-modal";
import { AppStoreProvider } from "@/lib/store/app-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <ActionProvider>
          <AppShell>{children}</AppShell>
          <ActionModalRoot />
        </ActionProvider>
      </ToastProvider>
    </AppStoreProvider>
  );
}
