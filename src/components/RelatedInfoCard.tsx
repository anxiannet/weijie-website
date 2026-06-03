import Link from "next/link";
import type { Info } from "@/types";

export function RelatedInfoCard({ info }: { info: Info }) {
  return (
    <Link href={`/infos/${info.id}`} className="block rounded-lg bg-slate-50 p-3">
      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{info.title}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{info.content}</p>
    </Link>
  );
}
