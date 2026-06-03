"use client";

export function ReportMessageButton({ messageId }: { messageId?: string | null }) {
  async function report() {
    if (!messageId) return;
    await fetch("/api/messages/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, reason: "用户举报" })
    });
    alert("已提交举报。");
  }
  return <button type="button" onClick={report} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">举报</button>;
}
