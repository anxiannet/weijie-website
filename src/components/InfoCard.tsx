import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { Info } from "@/types";
import { channelById } from "@/lib/data";
import { InfoTypeBadge } from "@/components/InfoTypeBadge";

const posterColors = [
  "from-sky-100 via-cyan-50 to-white text-slate-800",
  "from-emerald-100 via-teal-50 to-white text-slate-800",
  "from-amber-100 via-orange-50 to-white text-slate-800",
  "from-rose-100 via-pink-50 to-white text-slate-800",
  "from-violet-100 via-indigo-50 to-white text-slate-800"
];

function colorIndex(id: string) {
  return id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % posterColors.length;
}

export function InfoCard({ info }: { info: Info }) {
  const channel = info.channel ?? channelById(info.channel_id);
  const likes = Math.max(12, info.title.length * 7 + info.content.length);

  return (
    <Link href={`/infos/${info.id}`} className="mb-2 block break-inside-avoid overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-soft">
      {info.cover_url ? (
        <div className="relative aspect-[3/4] bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={info.cover_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute left-2 top-2"><InfoTypeBadge type={info.info_type} /></div>
          {info.info_type === "event" || info.info_type === "news" ? (
            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/35 text-white backdrop-blur">
              <Play className="h-4 w-4 fill-white" />
            </span>
          ) : null}
        </div>
      ) : (
        <div className={`relative flex aspect-[3/4] flex-col justify-between bg-gradient-to-br p-4 ${posterColors[colorIndex(info.id)]}`}>
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-brand shadow-sm">{channel?.name ?? "信息"}</span>
            <InfoTypeBadge type={info.info_type} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-brand">{channel?.name ?? "维界"}</p>
            <p className="text-2xl font-extrabold leading-tight text-slate-800 md:text-3xl">{info.title}</p>
          </div>
          <span className="absolute bottom-4 right-4 h-2 w-7 rounded-full bg-brand/20" />
        </div>
      )}
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
