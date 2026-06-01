"use client";

import { FormEvent, useMemo, useState } from "react";
import { classifyInfo } from "@/lib/classifier/classifyInfo";
import type { Channel, Tag } from "@/types";
import { ChannelSelector } from "@/components/ChannelSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { TagSelector } from "@/components/TagSelector";

export function PublishForm({ channels, tags }: { channels: Channel[]; tags: Tag[] }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("note");
  const [channelSlug, setChannelSlug] = useState("life");
  const [selectedTags, setSelectedTags] = useState<string[]>(["#新加坡生活"]);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const visibleTags = useMemo(() => tags.filter((tag) => {
    const channel = channels.find((item) => item.slug === channelSlug);
    return !channel || tag.channel_id === channel.id || tag.is_featured;
  }).slice(0, 18), [channelSlug, channels, tags]);

  function autoClassify() {
    const result = classifyInfo({ title, content, location_text: location, price_text: price });
    setChannelSlug(result.channelSlug);
    setSelectedTags(result.tags);
    setType(result.infoType);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const response = await fetch("/api/infos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        contactText: contact,
        priceText: price,
        locationText: location,
        infoType: type,
        channelSlug,
        tags: selectedTags
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitState("error");
      setMessage(result.error ?? "提交失败，请稍后再试。");
      return;
    }

    setSubmitState("success");
    setMessage(result.mode === "mock" ? "已提交到 mock 流程。配置 Supabase 后会写入审核队列。" : "已提交到审核队列，通过后会在前台展示。");
    setTitle("");
    setContent("");
    setContact("");
    setPrice("");
    setLocation("");
    setType("note");
    setChannelSlug("life");
    setSelectedTags(["#新加坡生活"]);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {submitState === "success" && <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
      {submitState === "error" && <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700">{message}</div>}
      <input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="标题" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand" />
      <textarea value={content} onChange={(event) => setContent(event.target.value)} required rows={7} placeholder="正文，写清楚地点、价格、条件和真实情况" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand" />
      <ImageUploader />
      <div className="grid gap-3 md:grid-cols-3">
        <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="联系方式" className="rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand" />
        <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="价格" className="rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand" />
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="地点" className="rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand" />
      </div>
      <button type="button" onClick={autoClassify} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">自动归类并生成标签</button>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">频道</label>
          <ChannelSelector channels={channels} value={channelSlug} onChange={setChannelSlug} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">类型</label>
          <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand">
            {["note", "rental", "service", "business", "food", "event", "secondhand", "guide", "news", "question"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">标签</label>
        <TagSelector tags={visibleTags} selected={selectedTags} onChange={setSelectedTags} />
      </div>
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">维界允许合理展示联系方式，但请发布真实、合法、对他人有帮助的信息。</p>
      <button disabled={submitState === "submitting"} className="w-full rounded-full bg-brand px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {submitState === "submitting" ? "提交中" : "提交审核"}
      </button>
    </form>
  );
}
