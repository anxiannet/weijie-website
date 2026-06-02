"use client";

import type { Comment } from "@/types";
import { FormEvent, useState } from "react";

export function CommentList({ comments, infoId }: { comments: Comment[]; infoId: string }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ infoId, content })
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "评论失败，请稍后再试。");
      return;
    }

    setStatus("success");
    setMessage("评论已提交，审核通过后展示。");
    setContent("");
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">评论</h2>
      <form onSubmit={submit} className="space-y-2 rounded-lg bg-white p-3 ring-1 ring-slate-100">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          rows={3}
          placeholder="写一条评论"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-brand"
        />
        <button
          disabled={status === "submitting"}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "提交中" : "提交评论"}
        </button>
        {message ? (
          <p className={status === "error" ? "text-sm text-rose-600" : "text-sm text-emerald-700"}>{message}</p>
        ) : null}
      </form>
      {comments.length === 0 ? <p className="text-sm text-slate-500">还没有评论。</p> : comments.map((comment) => (
        <div key={comment.id} className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
          <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
        </div>
      ))}
    </section>
  );
}
