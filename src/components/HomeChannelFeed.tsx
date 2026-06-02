"use client";

import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TouchEvent, useMemo, useRef, useState } from "react";
import { InfoCard } from "@/components/InfoCard";
import type { Channel, Info } from "@/types";

type HomeChannelFeedProps = {
  channels: Channel[];
  infos: Info[];
  initialChannelSlug?: string;
};

export function HomeChannelFeed({ channels, infos, initialChannelSlug }: HomeChannelFeedProps) {
  const router = useRouter();
  const tabScrollerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const tabs = useMemo(() => [{ id: "all", name: "推荐", slug: "" }, ...channels], [channels]);
  const initialIndex = Math.max(0, tabs.findIndex((tab) => tab.slug === (initialChannelSlug ?? "")));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const activeInfos = activeTab.slug
    ? infos.filter((info) => info.channel_id === activeTab.id)
    : infos;
  const topTabs = ["关注", "发现", "附近"];

  function activate(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), tabs.length - 1);
    const nextTab = tabs[nextIndex];
    setActiveIndex(nextIndex);
    router.replace(nextTab.slug ? `/?channel=${nextTab.slug}` : "/", { scroll: false });

    requestAnimationFrame(() => {
      const scroller = tabScrollerRef.current;
      const item = scroller?.querySelector<HTMLElement>(`[data-tab-index="${nextIndex}"]`);
      item?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 56) return;
    activate(delta < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 pt-4 md:px-8">
          <div className="flex h-11 items-center justify-between">
            <Link href="/search" className="grid h-10 w-10 place-items-center rounded-full text-slate-800" aria-label="频道">
              <Menu className="h-7 w-7" />
            </Link>
            <div className="flex items-center gap-8 text-lg font-semibold text-slate-400">
              {topTabs.map((tab) => (
                <span key={tab} className={tab === "发现" ? "relative text-slate-950" : ""}>
                  {tab}
                  {tab === "关注" && <span className="absolute -right-4 -top-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-xs text-white">1</span>}
                  {tab === "发现" && <span className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-brand" />}
                </span>
              ))}
            </div>
            <Link href="/search" className="grid h-10 w-10 place-items-center rounded-full text-slate-800" aria-label="搜索">
              <Search className="h-7 w-7" />
            </Link>
          </div>
          <div ref={tabScrollerRef} className="scrollbar-none mt-4 flex snap-x gap-7 overflow-x-auto whitespace-nowrap pb-3 text-base text-slate-500">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                data-tab-index={index}
                onClick={() => activate(index)}
                className={activeIndex === index ? "snap-start font-semibold text-slate-950" : "snap-start font-medium"}
              >
                {tab.name}
              </button>
            ))}
            <span className="inline-flex items-center gap-1 font-medium">
              更多
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-2 py-3 md:px-8">
        <section onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {activeInfos.length ? (
            <div className="columns-2 gap-2 space-y-2 md:columns-3 md:gap-4 md:space-y-4">
              {activeInfos.map((info) => <InfoCard key={info.id} info={info} />)}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
              这个频道暂时没有信息。
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
