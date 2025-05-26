// src/components/shared/Navbar.tsx
"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell, UserCircle, Search, LayoutDashboard, Presentation, FolderKanban } from "lucide-react";
import { HiyawLogo } from "../icons/HiyawLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const mobileNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/trainings", label: "Training Sessions", icon: Presentation },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 shadow-soft">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden rounded-lg">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        {/* CORRECTED: Mobile Sheet background uses bg-sidebar utility class */}
        <SheetContent side="left" className="sm:max-w-xs p-0 pt-4 bg-sidebar text-sidebar-foreground">
          <div className="px-4 mb-4">
            <HiyawLogo size="small"/>
          </div>
          <nav className="grid gap-2 text-base font-medium px-2">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return(
              <SheetClose asChild key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </SheetClose>
            )})}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
      </div>

      <div className="relative ml-auto hidden flex-1 md:flex md:grow-0 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-input pl-9 h-10 text-sm"
        />
      </div>

      <Button variant="ghost" size="icon" className="ml-2 rounded-full h-10 w-10">
        <Bell className="h-5 w-5 text-foreground/70" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
        <UserCircle className="h-6 w-6 text-foreground/70" />
        <span className="sr-only">User Menu</span>
      </Button>
    </header>
  );
}