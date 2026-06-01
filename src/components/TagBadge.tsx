import Link from "next/link";
import type { Tag } from "@/types";

export function TagBadge({ tag, href = true }: { tag: Tag; href?: boolean }) {
  const className = "inline-flex items-center rounded-full bg-mist px-3 py-1 text-sm font-medium text-brand";
  if (!href) return <span className={className}>{tag.name}</span>;
  return (
    <Link href={`/tags/${tag.slug}`} className={className}>
      {tag.name}
    </Link>
  );
}
