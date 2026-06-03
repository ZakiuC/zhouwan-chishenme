"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function ResponsiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <Sidebar />
      <main className="md:ml-60 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
