"use client";

import { Flag } from "lucide-react";
import { useState } from "react";

export function ReportButton({ targetId }: { targetId: string }) {
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function report() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "info", targetId, reason: "user_report" })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.error ?? "举报失败，请稍后再试。");
      return;
    }

    setReported(true);
  }

  return (
    <div className="space-y-1">
      <button
        onClick={report}
        disabled={reported || loading}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Flag className="h-4 w-4" />
        {loading ? "提交中" : reported ? "已提交" : "举报"}
      </button>
      {message ? <p className="text-xs text-rose-600">{message}</p> : null}
    </div>
  );
}
