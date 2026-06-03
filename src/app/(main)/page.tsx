// 首页
import { getSession } from "@/lib/auth";
import { getHomeData } from "@/lib/queries";
import { StoreCard } from "@/components/store/StoreCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function HomePage() {
  const session = await getSession();
  const { hot, latest, total } = await getHomeData();
  const now = new Date(); const dayOfWeek = now.getDay(); const hour = now.getHours(); const isSunday = dayOfWeek === 0;
  const greeting = hour < 12 ? "早上好" : hour < 14 ? "中午好" : hour < 18 ? "下午好" : "晚上好";

  return (
    <div className="space-y-16 animate-reveal-up">
      {/* HERO */}
      <section className="pt-4 md:pt-8">
        <p className="text-2xs text-caramel-500 tracking-[0.25em] uppercase font-semibold mb-4 select-none">
          {isSunday ? "Today is Sunday" : "The Sunday Table"}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-ink-50 tracking-tight leading-none">
          {greeting}，
          <br />
          <span className="text-caramel-400">{session?.user?.name || "朋友"}</span>
        </h2>
        <p className="text-base text-ink-400 mt-4 max-w-md leading-relaxed">
          {isSunday
            ? "今晚想好吃什么了吗？让命运来决定。"
            : `距周日还有 ${(7 - dayOfWeek) % 7 || 7} 天。提前收藏，到时不用愁。`}
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/random">
            <Button size="lg"><Icon name="dice" size={16} className="mr-2" />随机推荐</Button>
          </Link>
          <Link href="/stores/new">
            <Button variant="outline" size="lg"><Icon name="plus" size={16} className="mr-2" />上传店铺</Button>
          </Link>
        </div>
        <div className="flex gap-12 mt-16 pt-8 ring-1 ring-ink-800/50">
          <div>
            <p className="stat-num text-ink-50">{total}</p>
            <p className="stat-label">收录店铺</p>
          </div>
          <div>
            <p className="stat-num text-caramel-400">{hot.length}</p>
            <p className="stat-label">已评级</p>
          </div>
        </div>
      </section>

      {/* 热门 */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-2xs text-caramel-500 tracking-[0.2em] uppercase font-semibold mb-2 select-none">Trending</p>
            <h3 className="text-2xl font-bold text-ink-50 tracking-tight">热门推荐</h3>
          </div>
          <Link href="/rank" className="text-sm text-caramel-400 hover:text-caramel-300 font-medium tracking-wide">
            完整排行 <Icon name="arrow-right" size={12} className="inline" />
          </Link>
        </div>
        {hot.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">{hot.map(s => <StoreCard key={s.id} store={s} />)}</div>
        ) : <EmptyState icon="trophy" title="还没有评分数据" description="去给店铺评分吧" />}
      </section>

      {/* 最新 */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-2xs text-sage-400 tracking-[0.2em] uppercase font-semibold mb-2 select-none">Recently Added</p>
            <h3 className="text-2xl font-bold text-ink-50 tracking-tight">最新收录</h3>
          </div>
          <Link href="/stores" className="text-sm text-caramel-400 hover:text-caramel-300 font-medium tracking-wide">
            浏览全部 <Icon name="arrow-right" size={12} className="inline" />
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">{latest.map(s => <StoreCard key={s.id} store={s} />)}</div>
        ) : <EmptyState icon="pencil" title="还没有店铺" description="成为第一个添加的人" action={<Link href="/stores/new"><Button>上传店铺</Button></Link>} />}
      </section>

      <footer className="text-center pb-8"><p className="text-2xs text-ink-600 select-none tracking-widest uppercase">Members Only</p></footer>
    </div>
  );
}
