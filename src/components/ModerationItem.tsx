"use client";

import type { Info } from "@/types";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModerationItem({ info }: { info: Info }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "approving" | "rejecting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const channelName = info.channel?.name ?? "未分类";

  async function review(moderationStatus: "approved" | "rejected") {
    setStatus(moderationStatus === "approved" ? "approving" : "rejecting");
    setMessage("");

    const response = await fetch(`/api/admin/infos/${info.id}/moderation`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moderationStatus })
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "审核失败，请稍后再试。");
      return;
    }

    setStatus("done");
    setMessage(moderationStatus === "approved" ? "已通过，前台可见。" : "已拒绝，前台不展示。");
    router.refresh();
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{info.title}</p>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{info.content}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">待审核</span>
      </div>
      <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-4">
        <p><span className="text-slate-400">频道：</span>{channelName}</p>
        <p><span className="text-slate-400">类型：</span>{info.info_type}</p>
        <p><span className="text-slate-400">地点：</span>{info.location_text ?? "未填写"}</p>
        <p><span className="text-slate-400">价格：</span>{info.price_text ?? "未填写"}</p>
      </div>
      {info.contact_text && (
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <span className="text-slate-400">联系方式：</span>{info.contact_text}
        </p>
      )}
      {message && (
        <p className={status === "error" ? "mt-3 text-sm font-medium text-rose-600" : "mt-3 text-sm font-medium text-emerald-700"}>
          {message}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={status === "approving" || status === "rejecting"}
          onClick={() => review("approved")}
          className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check className="h-4 w-4" />
          {status === "approving" ? "通过中" : "通过"}
        </button>
        <button
          type="button"
          disabled={status === "approving" || status === "rejecting"}
          onClick={() => review("rejected")}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" />
          {status === "rejecting" ? "拒绝中" : "拒绝"}
        </button>
      </div>
    </div>
  );
}
