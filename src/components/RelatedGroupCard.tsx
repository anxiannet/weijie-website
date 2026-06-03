import Link from "next/link";
import type { GroupChat } from "@/types";

export function RelatedGroupCard({ group }: { group: GroupChat }) {
  return (
    <Link href={`/groups/${group.id}`} className="block rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="font-semibold text-slate-900">{group.title}</p>
      <p className="mt-1 text-sm text-slate-500">{group.member_count} 人 · {group.infos?.length ?? 0} 条关联信息</p>
    </Link>
  );
}
