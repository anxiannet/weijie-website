import Link from "next/link";
import type { Info } from "@/types";
import { channelById, tagsByIds } from "@/lib/data";
import { InfoTypeBadge } from "@/components/InfoTypeBadge";

export function InfoCard({ info }: { info: Info }) {
  const channel = info.channel ?? channelById(info.channel_id);
  const tags = (info.tags?.length ? info.tags : tagsByIds(info.tag_ids)).slice(0, 3);

  return (
    <Link href={`/infos/${info.id}`} className="break-inside-avoid overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
      {info.cover_url ? (
        <div className="relative aspect-[4/3] bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={info.cover_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute left-2 top-2"><InfoTypeBadge type={info.info_type} /></div>
        </div>
      ) : (
        <div className="flex min-h-24 items-start justify-between bg-gradient-to-br from-brand to-emerald-500 p-3 text-white">
          <span className="text-sm font-medium">{channel?.name ?? "信息"}</span>
          <InfoTypeBadge type={info.info_type} />
        </div>
      )}
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">{info.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{info.content}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => tag && <span key={tag.id} className="text-xs font-medium text-brand">{tag.name}</span>)}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{info.location_text ?? channel?.name}</span>
          <span>{info.price_text ?? "查看"}</span>
        </div>
      </div>
    </Link>
  );
}
