"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="flex flex-col items-center justify-center py-20 px-4">
    <Icon name="emoji-dizzy" size={48} className="text-ink-500 mb-4" />
    <h2 className="text-xl font-semibold text-ink-100 mb-2">出错了</h2>
    <p className="text-sm text-ink-300 mb-6 text-center max-w-sm">页面加载出现问题</p>
    <Button onClick={reset} variant="outline">重新加载</Button>
  </div>;
}
