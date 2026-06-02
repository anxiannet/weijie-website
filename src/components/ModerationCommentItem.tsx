"use client";

import type { Comment } from "@/types";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModerationCommentItem({ comment }: { comment: Comment }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "approving" | "rejecting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function review(moderationStatus: "approved" | "rejected") {
    setStatus(moderationStatus === "approved" ? "approving" : "rejecting");
    setMessage("");

    const response = await fetch(`/api/admin/comments/${comment.id}/moderation`, {
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
    setMessage(moderationStatus === "approved" ? "评论已通过。" : "评论已拒绝。");
    router.refresh();
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">待审核评论</span>
      </div>
      {message ? (
        <p className={status === "error" ? "mt-3 text-sm font-medium text-rose-600" : "mt-3 text-sm font-medium text-emerald-700"}>
          {message}
        </p>
      ) : null}
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
