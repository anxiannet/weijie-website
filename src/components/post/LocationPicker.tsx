"use client";

import { useState } from "react";
import type { Place } from "@/types";
import { LocationBottomSheet } from "@/components/post/LocationBottomSheet";
import { LocationChipList, rememberRecentPlace } from "@/components/post/LocationChipList";
import { LocationPreview } from "@/components/post/LocationPreview";

export function LocationPicker({ value, onChange }: {
  value: Place | null;
  onChange: (place: Place | null) => void;
}) {
  const [open, setOpen] = useState(false);

  function selectPlace(place: Place) {
    rememberRecentPlace(place);
    onChange(place);
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      <LocationPreview place={value} onOpen={() => setOpen(true)} onClear={() => onChange(null)} />
      {!value ? <LocationChipList onSelect={selectPlace} /> : null}
      <LocationBottomSheet open={open} onClose={() => setOpen(false)} onSelect={selectPlace} />
    </div>
  );
}
