import type { Info } from "@/types";

export function ModerationItem({ info }: { info: Info }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{info.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{info.content}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">待审核</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white">通过</button>
        <button className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium">拒绝</button>
        <button className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium">编辑后通过</button>
      </div>
    </div>
  );
}
