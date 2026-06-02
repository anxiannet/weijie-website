"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Hash } from "lucide-react";
import { ChannelSelector } from "@/components/ChannelSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { TagSelector } from "@/components/TagSelector";
import { LocationPicker } from "@/components/post/LocationPicker";
import { TopicSelector } from "@/components/post/TopicSelector";
import { UserMentionSelector } from "@/components/post/UserMentionSelector";
import { classifyInfo } from "@/lib/classifier/classifyInfo";
import type { Channel, Place, Tag } from "@/types";

const draftKey = "weijie.postComposerDraft";

type Draft = {
  title: string;
  content: string;
  contact: string;
  price: string;
  type: string;
  channelSlug: string;
  selectedTags: string[];
  selectedLocation: Place | null;
};

const emptyDraft: Draft = {
  title: "",
  content: "",
  contact: "",
  price: "",
  type: "note",
  channelSlug: "life",
  selectedTags: ["#新加坡生活"],
  selectedLocation: null
};

export function PostComposer({ channels, tags }: { channels: Channel[]; tags: Tag[] }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(draftKey);
      if (saved) setDraft({ ...emptyDraft, ...(JSON.parse(saved) as Partial<Draft>) });
    } catch {
      setDraft(emptyDraft);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft]);

  const visibleTags = useMemo(() => tags.filter((tag) => {
    const channel = channels.find((item) => item.slug === draft.channelSlug);
    return !channel || tag.channel_id === channel.id || tag.is_featured;
  }).slice(0, 18), [draft.channelSlug, channels, tags]);

  function updateDraft(values: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...values }));
  }

  function autoClassify() {
    const result = classifyInfo({
      title: draft.title,
      content: draft.content,
      location_text: draft.selectedLocation?.name,
      price_text: draft.price
    });
    updateDraft({
      channelSlug: result.channelSlug,
      selectedTags: Array.from(new Set([...draft.selectedTags, ...result.tags])),
      type: result.infoType
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    let imageUrls: string[] = [];

    if (imageFiles.length) {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));

      const uploadResponse = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setSubmitState("error");
        setMessage(uploadResult.error ?? "图片上传失败，请稍后再试。");
        return;
      }

      imageUrls = uploadResult.urls ?? [];
    }

    const response = await fetch("/api/infos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title,
        content: draft.content,
        contactText: draft.contact,
        priceText: draft.price,
        locationText: draft.selectedLocation?.name ?? "",
        location: draft.selectedLocation,
        infoType: draft.type,
        channelSlug: draft.channelSlug,
        tags: draft.selectedTags,
        imageUrls
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
    setDraft(emptyDraft);
    setImageFiles([]);
    window.localStorage.removeItem(draftKey);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {submitState === "success" && <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
      {submitState === "error" && <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700">{message}</div>}

      <ImageUploader files={imageFiles} onChange={setImageFiles} disabled={submitState === "submitting"} />

      <input
        value={draft.title}
        onChange={(event) => updateDraft({ title: event.target.value })}
        required
        placeholder="添加标题"
        className="w-full border-0 border-b border-slate-100 bg-transparent px-0 py-3 text-lg font-semibold outline-none placeholder:text-slate-400 focus:border-brand"
      />
      <textarea
        value={draft.content}
        onChange={(event) => updateDraft({ content: event.target.value })}
        required
        rows={8}
        placeholder="添加正文"
        className="w-full resize-none border-0 bg-transparent px-0 py-2 text-base leading-7 outline-none placeholder:text-slate-400"
      />

      <TopicSelector selected={draft.selectedTags} onChange={(selectedTags) => updateDraft({ selectedTags })} />

      <div className="flex gap-2 border-y border-slate-100 py-3">
        <button
          type="button"
          onClick={autoClassify}
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          <Hash className="h-4 w-4" />
          话题
        </button>
        <UserMentionSelector />
      </div>

      <LocationPicker value={draft.selectedLocation} onChange={(selectedLocation) => updateDraft({ selectedLocation })} />

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={draft.contact}
          onChange={(event) => updateDraft({ contact: event.target.value })}
          placeholder="联系方式"
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand"
        />
        <input
          value={draft.price}
          onChange={(event) => updateDraft({ price: event.target.value })}
          placeholder="价格或预算"
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">频道</label>
          <ChannelSelector channels={channels} value={draft.channelSlug} onChange={(channelSlug) => updateDraft({ channelSlug })} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">类型</label>
          <select value={draft.type} onChange={(event) => updateDraft({ type: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-brand">
            {["note", "rental", "service", "business", "food", "event", "secondhand", "guide", "news", "question"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">更多标签</label>
        <TagSelector tags={visibleTags} selected={draft.selectedTags} onChange={(selectedTags) => updateDraft({ selectedTags })} />
      </div>

      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">维界允许合理展示联系方式，但请发布真实、合法、对他人有帮助的信息。</p>
      <button disabled={submitState === "submitting"} className="w-full rounded-full bg-brand px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {submitState === "submitting" ? "提交中" : "提交审核"}
      </button>
    </form>
  );
}
