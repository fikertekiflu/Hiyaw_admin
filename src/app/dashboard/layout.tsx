// src/app/(dashboard)/layout.tsx
import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CORRECTED: Using Tailwind utility class bg-muted with opacity
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      
        {/* <Navbar /> */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      
    </div>
  );
}