"use client";

import type { Tag } from "@/types";

export function TagSelector({ tags, selected, onChange }: { tags: Tag[]; selected: string[]; onChange: (tags: string[]) => void }) {
  function toggle(name: string) {
    onChange(selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button key={tag.id} type="button" onClick={() => toggle(tag.name)} className={selected.includes(tag.name) ? "rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white" : "rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-brand"}>
          {tag.name}
        </button>
      ))}
    </div>
  );
}
