"use client";

import { MapPin, X } from "lucide-react";
import type { Place } from "@/types";

export function LocationPreview({ place, onClear, onOpen }: {
  place: Place | null;
  onClear: () => void;
  onOpen: () => void;
}) {
  if (!place) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between border-t border-slate-100 py-4 text-left text-base font-medium text-slate-800"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brand" />
          标记地点
        </span>
        <span className="text-slate-400">&gt;</span>
      </button>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 border-t border-slate-100 py-4">
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-5 w-5 shrink-0 text-brand" />
          <span className="truncate">{place.name}</span>
        </span>
        <span className="mt-1 block pl-7 text-sm leading-6 text-slate-500">{place.address}</span>
      </button>
      <button
        type="button"
        onClick={onClear}
        aria-label="删除地点"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
