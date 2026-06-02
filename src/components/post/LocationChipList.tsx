"use client";

import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Place } from "@/types";

const recentKey = "weijie.recentPlaces";

const popularPlaces: Place[] = [
  { name: "The Floravale", address: "240 Westwood Ave Singapore 648361", postal: "648361", category: "住宅区", source: "popular" },
  { name: "NTU", address: "50 Nanyang Ave Singapore 639798", postal: "639798", category: "学校", source: "popular" },
  { name: "NUS", address: "21 Lower Kent Ridge Rd Singapore 119077", postal: "119077", category: "学校", source: "popular" },
  { name: "Jurong Point", address: "1 Jurong West Central 2 Singapore 648886", postal: "648886", category: "商场", source: "popular" },
  { name: "Gek Poh", address: "762 Jurong West Street 75 Singapore 640762", postal: "640762", category: "社区", source: "popular" }
];

function readRecentPlaces(): Place[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(recentKey);
    return value ? (JSON.parse(value) as Place[]) : [];
  } catch {
    return [];
  }
}

export function rememberRecentPlace(place: Place) {
  if (typeof window === "undefined") return;
  const recent = readRecentPlaces().filter((item) => item.name !== place.name || item.address !== place.address);
  window.localStorage.setItem(recentKey, JSON.stringify([place, ...recent].slice(0, 20)));
}

export function LocationChipList({ onSelect }: { onSelect: (place: Place) => void }) {
  const [recent, setRecent] = useState<Place[]>([]);
  const [nearWest, setNearWest] = useState(false);

  useEffect(() => {
    setRecent(readRecentPlaces());
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setNearWest(latitude > 1.29 && latitude < 1.38 && longitude > 103.62 && longitude < 103.75);
      },
      () => undefined,
      { maximumAge: 1000 * 60 * 30, timeout: 2500 }
    );
  }, []);

  const places = useMemo(() => {
    const prioritized = nearWest ? popularPlaces : [...popularPlaces.slice(1), popularPlaces[0]];
    const merged = [...recent, ...prioritized];
    return merged.filter((place, index) => merged.findIndex((item) => item.name === place.name && item.address === place.address) === index).slice(0, 10);
  }, [nearWest, recent]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {places.map((place) => (
          <button
            key={`${place.name}-${place.address}`}
            type="button"
            onClick={() => onSelect(place)}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
          >
            <MapPin className="h-4 w-4 text-brand" />
            {place.name}
          </button>
        ))}
      </div>
    </div>
  );
}
