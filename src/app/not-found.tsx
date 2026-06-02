import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-base-900">
    <Icon name="bowl" size={80} className="text-paper-600 mb-4" />
    <h1 className="text-2xl font-bold text-paper-100 mb-2">404</h1>
    <p className="text-paper-400 mb-6 text-center">这个页面被吃掉了</p>
    <Link href="/"><Button>返回首页</Button></Link>
  </div>;
}
