import { ModerationItem } from "@/components/ModerationItem";
import { getInfos } from "@/lib/data";

export default async function ModerationPage() {
  const infos = (await getInfos()).slice(0, 6).map((info) => ({ ...info, moderation_status: "pending" as const }));
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">审核中心</h1>
      </header>
      <section className="space-y-3">
        {infos.map((info) => <ModerationItem key={info.id} info={info} />)}
      </section>
    </div>
  );
}
