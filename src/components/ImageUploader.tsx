"use client";

import { ImagePlus } from "lucide-react";

export function ImageUploader() {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
      <ImagePlus className="mb-2 h-6 w-6 text-brand" />
      添加图片
      <input type="file" accept="image/*" multiple className="hidden" />
    </label>
  );
}
