"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

export function SaveButton({ targetId, initialSaved = false }: { targetId: string; initialSaved?: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/saved", {
      method: saved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "info", targetId })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.error ?? "操作失败，请稍后再试。");
      return;
    }

    setSaved(result.saved);
  }

  return (
    <div className="space-y-1">
      <button
        onClick={toggle}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Bookmark className={saved ? "h-4 w-4 fill-brand text-brand" : "h-4 w-4"} />
        {loading ? "处理中" : saved ? "已收藏" : "收藏"}
      </button>
      {message ? <p className="text-xs text-rose-600">{message}</p> : null}
    </div>
  );
}
