"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-ink-800 rounded-sm", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-ink-800/30 ring-1 ring-ink-800 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-1 pt-2">
        <Skeleton className="h-4 w-10" /><Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-48 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
