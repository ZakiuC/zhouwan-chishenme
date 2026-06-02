"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface ResponsiveLayoutProps { children: ReactNode; }

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-ambient grain-overlay">
      <Sidebar />
      <main className="md:ml-60 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
