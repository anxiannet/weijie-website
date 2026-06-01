import Link from "next/link";
import type { Channel } from "@/types";

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link href={`/channels/${channel.slug}`} className="flex min-w-20 flex-col items-center gap-2 rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-slate-100">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-white">{channel.name.slice(0, 1)}</span>
      <span className="text-sm font-medium text-slate-800">{channel.name}</span>
    </Link>
  );
}
