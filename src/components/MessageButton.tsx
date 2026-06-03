"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export function MessageButton({ infoId, disabled, label = "私信联系" }: { infoId: string; disabled?: boolean; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function startConversation() {
    if (disabled) return;
    setLoading(true);
    const response = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ infoId })
    });
    const result = await response.json();
    setLoading(false);
    if (response.ok) window.location.href = `/messages/${result.id}`;
    else window.location.href = `/login?next=/infos/${infoId}`;
  }

  return (
    <button
      type="button"
      onClick={startConversation}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <MessageCircle className="h-4 w-4" />
      {loading ? "正在打开" : label}
    </button>
  );
}
