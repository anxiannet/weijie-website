import { RelatedInfoCard } from "@/components/RelatedInfoCard";
import type { Info } from "@/types";

export function GroupRelatedInfos({ infos }: { infos: Info[] }) {
  return (
    <section className="space-y-3">
      <h2 className="font-semibold">关联信息</h2>
      <div className="grid gap-2 md:grid-cols-2">
        {infos.map((info) => <RelatedInfoCard key={info.id} info={info} />)}
      </div>
    </section>
  );
}
