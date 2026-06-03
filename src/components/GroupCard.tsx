import Link from "next/link";
import { UsersRound } from "lucide-react";
import type { GroupChat } from "@/types";

export function GroupCard({ group }: { group: GroupChat }) {
  return (
    <Link href={`/groups/${group.id}`} className="block rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{group.title}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{group.description ?? "维界群聊"}</p>
          <p className="mt-2 text-xs font-medium text-brand">{group.tag?.name ?? group.channel?.name ?? group.group_type}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-600">
          <UsersRound className="h-3.5 w-3.5" />
          {group.member_count}
        </span>
      </div>
    </Link>
  );
}
