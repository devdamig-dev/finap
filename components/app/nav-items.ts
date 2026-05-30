import {
  Calendar,
  Home,
  Settings,
  Sparkles,
  UserCircle2,
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
  { label: "Mis gastos", href: "/dashboard/mis-gastos", icon: UserCircle2, shortLabel: "Yo" },
  { label: "Hogar", href: "/dashboard/hogar", icon: Wrench },
  { label: "Calendario", href: "/dashboard/calendario", icon: Calendar, shortLabel: "Agenda" },
  { label: "IA", href: "/dashboard/ia", icon: Sparkles },
  { label: "Ajustes", href: "/dashboard/configuracion", icon: Settings, shortLabel: "Ajustes" },
];

/** Items visibles en el bottom nav de mobile (máx. 5 para que entren bien). */
export const mobileNavItems: NavItem[] = [
  navItems[0], // Inicio
  navItems[1], // Finanzas
  navItems[2], // Mis gastos
  navItems[3], // Hogar
  navItems[5], // IA
];
