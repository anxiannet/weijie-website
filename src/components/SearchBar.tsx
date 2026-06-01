"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <Search className="h-5 w-5 text-brand" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="搜索新加坡生活信息"
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
      />
    </form>
  );
}
