"use client";

export function BlockUserButton({ userId }: { userId?: string | null }) {
  async function block() {
    if (!userId) return;
    await fetch("/api/messages/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedId: userId, reason: "用户主动拉黑" })
    });
    alert("已停止接收对方私信。");
  }
  return <button type="button" onClick={block} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">拉黑</button>;
}
