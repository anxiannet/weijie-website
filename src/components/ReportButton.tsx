"use client";

import { Flag } from "lucide-react";
import { useState } from "react";

export function ReportButton() {
  const [reported, setReported] = useState(false);
  return (
    <button onClick={() => setReported(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
      <Flag className="h-4 w-4" />
      {reported ? "已提交" : "举报"}
    </button>
  );
}
