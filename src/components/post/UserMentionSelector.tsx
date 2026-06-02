"use client";

import { AtSign } from "lucide-react";

export function UserMentionSelector() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
      aria-label="提及用户"
    >
      <AtSign className="h-4 w-4" />
      用户
    </button>
  );
}
