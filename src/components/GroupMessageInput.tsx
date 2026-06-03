"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export function GroupMessageInput({ groupId }: { groupId: string }) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = body.trim();
    if (!value) return;
    const response = await fetch("/api/groups/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, body: value })
    });
    const result = await response.json();
    if (!response.ok) setStatus(result.error ?? "发送失败");
    else {
      setBody("");
      window.location.reload();
    }
  }

  return (
    <form onSubmit={submit} className="sticky bottom-20 space-y-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100 md:bottom-3">
      <div className="flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={1000}
          placeholder="发送消息，礼貌沟通，避免刷屏。"
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-brand"
        />
        <button className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white" aria-label="发送群消息">
          <Send className="h-4 w-4" />
        </button>
      </div>
      {status ? <p className="text-xs text-rose-600">{status}</p> : null}
    </form>
  );
}
