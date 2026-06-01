"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button onClick={() => setSaved(!saved)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
      <Bookmark className={saved ? "h-4 w-4 fill-brand text-brand" : "h-4 w-4"} />
      {saved ? "已收藏" : "收藏"}
    </button>
  );
}
