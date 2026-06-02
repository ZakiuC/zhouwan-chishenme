import { StoreForm } from "@/components/store/StoreForm";
import { Icon } from "@/components/ui/Icon";

export default function NewStorePage() {
  return <div className="space-y-4">
    <div>
      <p className="text-2xs tracking-[0.15em] uppercase text-accent-400 font-semibold mb-1 select-none">Submit</p>
      <h2 className="text-xl font-bold text-paper-100 flex items-center gap-2"><Icon name="plus" size={22} className="text-accent-400" />上传店铺</h2>
      <p className="text-sm text-paper-500 mt-1">添加你想吃或推荐的店铺</p>
    </div>
    <StoreForm />
  </div>;
}
