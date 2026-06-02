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
    <div className="space-y-8 animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-800 via-base-800 to-base-900 border border-accent-500/15 p-6 md:p-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-accent-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="absolute top-6 right-6 w-16 h-16 rounded-full border border-accent-500/20" />
        <div className="absolute top-10 right-10 w-10 h-10 rounded-full border border-gold-500/15" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xs tracking-[0.2em] uppercase text-accent-300 font-semibold mb-2 select-none">
                {isSunday ? <><Icon name="sparkle" size={10} className="inline mr-1" />今日周日</> : "The Sunday Table"}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-paper-50 tracking-tight">
                {greeting}，{session?.user?.name || "朋友"}
              </h2>
              <p className="text-paper-400 text-sm mt-2 max-w-sm">
                {isSunday ? "今晚想好吃什么了吗？来翻牌吧" : `距周日还有 ${(7 - dayOfWeek) % 7 || 7} 天，提前收藏心仪的店`}
              </p>
            </div>
            <Icon name="plate" size={64} className="text-accent-400/30 animate-float" />
          </div>
          <div className="flex gap-3 mt-5">
            <Link href="/random">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/8 backdrop-blur-sm rounded-xl text-sm font-semibold text-paper-100 hover:bg-white/12 transition-all border border-white/8 select-none">
                <Icon name="dice" size={16} />随机推荐
              </button>
            </Link>
            <Link href="/stores/new">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-500/20 backdrop-blur-sm rounded-xl text-sm font-semibold text-accent-200 hover:bg-accent-500/30 transition-all border border-accent-500/20 select-none">
                <Icon name="plus" size={16} />上传店铺
              </button>
            </Link>
          </div>
        </div>
        <div className="relative z-10 flex gap-8 mt-6 pt-4 border-t border-white/6">
          <div><p className="text-2xl font-bold text-paper-50 tabular-nums">{total}</p><p className="text-2xs text-paper-500">收录店铺</p></div>
          <div><p className="text-2xl font-bold text-paper-50 tabular-nums">{hot.length}</p><p className="text-2xs text-paper-500">已评级店铺</p></div>
        </div>
      </section>

      {/* 热门 */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">Trending</p>
            <h3 className="text-lg font-bold text-paper-100 flex items-center gap-2"><Icon name="fire" size={18} className="text-accent-400" />热门推荐</h3>
          </div>
          <Link href="/rank" className="text-sm text-accent-300 hover:text-accent-200 font-medium transition-colors">
            完整排行 <Icon name="arrow-right" size={14} className="inline" />
          </Link>
        </div>
        {hot.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">{hot.map(s => <StoreCard key={s.id} store={s} />)}</div>
        : <EmptyState icon="chart" title="还没有评分数据" description="快去给店铺评分吧" />}
      </section>

      {/* 最新 */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xs tracking-[0.15em] uppercase text-sage-400 font-semibold mb-1 select-none">Recently Added</p>
            <h3 className="text-lg font-bold text-paper-100 flex items-center gap-2"><Icon name="clock" size={18} className="text-sage-400" />最新收录</h3>
          </div>
          <Link href="/stores" className="text-sm text-accent-300 hover:text-accent-200 font-medium transition-colors">
            浏览全部 <Icon name="arrow-right" size={14} className="inline" />
          </Link>
        </div>
        {latest.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">{latest.map(s => <StoreCard key={s.id} store={s} />)}</div>
        : <EmptyState icon="pencil" title="还没有店铺" description="成为第一个添加店铺的人吧" action={<Link href="/stores/new"><Button>上传店铺</Button></Link>} />}
      </section>

      <footer className="text-center pb-4"><p className="text-2xs text-paper-600 select-none">仅限微信群内成员使用</p></footer>
    </div>
  );
}
