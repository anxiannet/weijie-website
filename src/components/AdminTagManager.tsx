"use client";

import { FormEvent, useState } from "react";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Channel, Tag } from "@/types";

export function AdminTagManager({ channels, tags }: { channels: Channel[]; tags: Tag[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [channelId, setChannelId] = useState(channels[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, channelId, description })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.error ?? "新增标签失败。");
      return;
    }

    setName("");
    setDescription("");
    setMessage("标签已新增。");
    router.refresh();
  }

  async function toggleFeatured(tag: Tag) {
    const response = await fetch(`/api/admin/tags/${tag.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !tag.is_featured })
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error ?? "更新标签失败。");
      return;
    }

    setMessage(result.isFeatured ? "已设为推荐标签。" : "已取消推荐。");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createTag} className="grid gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100 md:grid-cols-[1fr_180px_1fr_auto]">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="#标签名"
          className="rounded-lg border border-slate-200 px-3 py-3 outline-brand"
        />
        <select value={channelId} onChange={(event) => setChannelId(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-3 outline-brand">
          {channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
        </select>
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="说明"
          className="rounded-lg border border-slate-200 px-3 py-3 outline-brand"
        />
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          <Plus className="h-4 w-4" />
          新增
        </button>
      </form>
      {message ? <p className="text-sm font-medium text-slate-600">{message}</p> : null}
      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
        {tags.map((tag) => {
          const channel = channels.find((item) => item.id === tag.channel_id);
          return (
            <div key={tag.id} className="grid gap-2 border-b border-slate-100 p-4 text-sm md:grid-cols-[1fr_1fr_100px_140px_120px]">
              <span className="font-semibold">{tag.name}</span>
              <span className="text-slate-500">{channel?.name}</span>
              <span>{tag.info_count} 条</span>
              <span className={tag.info_count > 100 ? "font-medium text-amber-700" : "text-slate-400"}>{tag.info_count > 100 ? "建议升级专题" : "可继续观察"}</span>
              <button type="button" onClick={() => toggleFeatured(tag)} className="inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 font-medium">
                <Star className={tag.is_featured ? "h-4 w-4 fill-brand text-brand" : "h-4 w-4"} />
                {tag.is_featured ? "推荐中" : "推荐"}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
