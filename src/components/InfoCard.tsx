import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { Info } from "@/types";
import { InfoTypeBadge } from "@/components/InfoTypeBadge";

export function InfoCard({ info }: { info: Info }) {
  const channel = info.channel;
  const likes = Math.max(12, info.title.length * 7 + info.content.length);
  const coverSrc = info.cover_url || `/api/covers/${info.id}`;

  return (
    <Link href={`/infos/${info.id}`} className="mb-2 block break-inside-avoid overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[3/4] bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverSrc} alt="" className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2"><InfoTypeBadge type={info.info_type} /></div>
        {info.info_type === "event" || info.info_type === "news" ? (
          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/35 text-white backdrop-blur">
            <Play className="h-4 w-4 fill-white" />
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">{info.title}</h3>
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="min-w-0 truncate">{info.location_text ?? channel?.name ?? "新加坡"}</span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Heart className="h-4 w-4" />
            {likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
