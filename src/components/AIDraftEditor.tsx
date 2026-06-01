"use client";

import { Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Channel, Tag } from "@/types";

export function AIDraftEditor({ channels, tags }: { channels: Channel[]; tags: Tag[] }) {
  const [channel, setChannel] = useState(channels[0]?.name ?? "生活");
  const [tag, setTag] = useState(tags[0]?.name ?? "#新加坡生活");
  const [topic, setTopic] = useState("银行开户");
  const [draft, setDraft] = useState<{ title: string; content: string; suggestedTags: string[] } | null>(null);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/ai/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, tag, topicText: topic })
    });
    setDraft(await response.json());
  }

  return (
    <div className="space-y-4">
      <form onSubmit={generate} className="grid gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100 md:grid-cols-3">
        <select value={channel} onChange={(event) => setChannel(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3">
          {channels.map((item) => <option key={item.id}>{item.name}</option>)}
        </select>
        <select value={tag} onChange={(event) => setTag(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3">
          {tags.map((item) => <option key={item.id}>{item.name}</option>)}
        </select>
        <input value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 font-semibold text-white md:col-span-3">
          <Sparkles className="h-4 w-4" />
          生成 AI 草稿
        </button>
      </form>
      {draft && (
        <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-lg font-semibold" />
          <textarea value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} rows={12} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-3 leading-7" />
          <div className="mt-3 flex flex-wrap gap-2">
            {draft.suggestedTags.map((item) => <span key={item} className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-brand">{item}</span>)}
          </div>
          <button className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">发布为 Info</button>
        </section>
      )}
    </div>
  );
}
