"use client";

import { ChevronDown, Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Place } from "@/types";

export function LocationBottomSheet({ open, onClose, onSelect }: {
  open: boolean;
  onClose: () => void;
  onSelect: (place: Place) => void;
}) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/places/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "搜索失败");
        setPlaces(result.places ?? []);
      } catch (searchError) {
        if (searchError instanceof DOMException && searchError.name === "AbortError") return;
        setError(searchError instanceof Error ? searchError.message : "搜索失败");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/35" role="dialog" aria-modal="true">
      <button type="button" aria-label="关闭地点选择" className="absolute inset-0 h-full w-full" onClick={onClose} />
      <div className="relative max-h-[86vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl md:mx-auto md:max-w-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <button type="button" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
            新加坡 <ChevronDown className="h-4 w-4" />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">地点</h2>
          <button type="button" onClick={onClose} aria-label="关闭" className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-slate-100 px-4 py-3">
          <label className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-slate-500">
            <Search className="h-5 w-5" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="搜索地点"
              className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          </label>
        </div>
        <div className="max-h-[58vh] overflow-y-auto px-4 py-2">
          {error ? <p className="py-6 text-center text-sm text-rose-600">{error}</p> : null}
          {!query.trim() ? <p className="py-6 text-center text-sm text-slate-500">输入公寓、学校、商场、MRT 或餐厅名称。</p> : null}
          {query.trim() && !loading && !places.length && !error ? <p className="py-6 text-center text-sm text-slate-500">没有找到相关地点。</p> : null}
          {places.map((place) => (
            <button
              key={`${place.name}-${place.address}-${place.postal ?? ""}`}
              type="button"
              onClick={() => onSelect(place)}
              className="flex w-full gap-3 border-b border-slate-100 py-4 text-left last:border-b-0"
            >
              <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold text-slate-900">{place.name}</span>
                <span className="mt-1 block text-sm font-medium text-slate-500">{place.category ?? "地点"}</span>
                <span className="mt-1 block text-sm leading-5 text-slate-500">{place.address}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
