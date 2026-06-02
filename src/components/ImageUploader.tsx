"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo } from "react";

const maxImages = 6;

export function ImageUploader({ files, onChange, disabled = false }: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const previews = useMemo(() => files.map((file) => ({
    file,
    url: URL.createObjectURL(file)
  })), [files]);

  useEffect(() => () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const images = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    onChange([...files, ...images].slice(0, maxImages));
  }

  function removeFile(index: number) {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="space-y-3">
      {previews.length ? (
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {previews.map((preview, index) => (
            <div key={`${preview.file.name}-${preview.file.lastModified}`} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                aria-label="移除图片"
                className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 transition hover:border-brand hover:text-brand">
        <ImagePlus className="mb-2 h-6 w-6 text-brand" />
        {files.length ? `继续添加图片（${files.length}/${maxImages}）` : "添加图片"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled || files.length >= maxImages}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
          className="hidden"
        />
      </label>
      <p className="text-xs text-slate-500">最多 {maxImages} 张，第一张会作为封面。</p>
    </div>
  );
}
