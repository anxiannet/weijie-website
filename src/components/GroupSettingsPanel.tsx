import type { GroupChat } from "@/types";

export function GroupSettingsPanel({ group }: { group: GroupChat }) {
  return (
    <section className="rounded-lg bg-white p-4 text-sm leading-6 shadow-sm ring-1 ring-slate-100">
      <p className="font-semibold text-slate-900">群聊设置</p>
      <p className="mt-1 text-slate-500">加入方式：{group.join_policy}</p>
      <p className="text-slate-500">状态：{group.status}</p>
    </section>
  );
}
