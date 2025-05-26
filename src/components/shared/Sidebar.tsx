// src/components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiyawLogo } from "@/components/icons/HiyawLogo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Presentation,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  LifeBuoy,
  Palette,
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/trainings", label: "Training Sessions", icon: Presentation },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
];

const secondaryNavItems = [
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    // CORRECTED: Using Tailwind utility class bg-sidebar
    <aside className="hidden md:flex flex-col w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg">
      <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
        <HiyawLogo />
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", isActive ? "text-sidebar-primary scale-110" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground")} />
              <span className={cn(isActive && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
        {secondaryNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
           return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform duration-200 ease-in-out", isActive ? "text-sidebar-primary scale-110" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground")} />
              <span className={cn(isActive && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
        <button
          className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
        >
          <Palette className="h-5 w-5 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground" />
          Toggle Theme
        </button>
        <button
          className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
        >
          <LogOut className="h-5 w-5 text-sidebar-foreground/60 group-hover:text-destructive" />
          Logout
        </button>
      </div>
    </aside>
  );
}