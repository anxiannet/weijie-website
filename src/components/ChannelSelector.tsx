"use client";

import type { Channel } from "@/types";

export function ChannelSelector({ channels, value, onChange }: { channels: Channel[]; value: string; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand">
      {channels.map((channel) => <option key={channel.slug} value={channel.slug}>{channel.name}</option>)}
    </select>
  );
}
