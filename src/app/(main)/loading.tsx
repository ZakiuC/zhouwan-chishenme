// 全局加载态
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div className="space-y-2"><div className="h-7 w-40 bg-base-600 rounded-lg animate-shimmer" /><div className="h-4 w-48 bg-base-600 rounded-lg animate-shimmer" /></div><div className="w-14 h-14 bg-base-600 rounded-full animate-shimmer" /></div>
    <div className="grid grid-cols-2 gap-3"><div className="h-24 bg-base-600 rounded-2xl animate-shimmer" /><div className="h-24 bg-base-600 rounded-2xl animate-shimmer" /></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  </div>;
}
