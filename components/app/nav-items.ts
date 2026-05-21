import {
  Calendar,
  Home,
  Settings,
  Sparkles,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  shortLabel?: string;
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Finanzas", href: "/dashboard/finanzas", icon: Wallet },
  { label: "Hogar", href: "/dashboard/hogar", icon: Wrench },
  { label: "Calendario", href: "/dashboard/calendario", icon: Calendar },
  { label: "IA", href: "/dashboard/ia", icon: Sparkles },
  { label: "Ajustes", href: "/dashboard/configuracion", icon: Settings, shortLabel: "Ajustes" },
];
