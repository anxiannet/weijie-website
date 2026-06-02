import { ModerationItem } from "@/components/ModerationItem";
import { EmptyState } from "@/components/EmptyState";
import { getPendingInfos } from "@/lib/data";

export default async function ModerationPage() {
  const infos = await getPendingInfos();

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">审核中心</h1>
        <p className="mt-2 text-sm text-slate-500">待审核信息会在通过后进入前台信息流。</p>
      </header>
      {infos.length ? (
        <section className="space-y-3">
          {infos.map((info) => <ModerationItem key={info.id} info={info} />)}
        </section>
      ) : (
        <EmptyState title="暂无待审核信息" description="用户发布的新信息会出现在这里。" />
      )}
    </div>
  );
}
