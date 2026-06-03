import Link from "next/link";
import { ContactVisibilityBadge } from "@/components/ContactVisibilityBadge";
import { MessageButton } from "@/components/MessageButton";
import type { Info } from "@/types";

export function ContactBox({ info, currentUserId }: { info: Info; currentUserId?: string | null }) {
  const visibility = info.contact_visibility ?? "private";
  const isPublisher = Boolean(currentUserId && info.author_id === currentUserId);
  const canMessage = info.allow_messages !== false && !isPublisher;
  const loggedIn = Boolean(currentUserId);
  const showContact = visibility === "public" || (visibility === "login_required" && loggedIn);

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">联系发布者</h2>
        <ContactVisibilityBadge visibility={visibility} />
      </div>
      {isPublisher ? (
        <p className="text-sm leading-6 text-slate-600">这是你发布的信息。</p>
      ) : showContact ? (
        <div className="space-y-2">
          <p className="rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-800">{info.contact_text ?? "作者未填写联系方式"}</p>
          {info.contact_note ? <p className="text-sm leading-6 text-slate-500">{info.contact_note}</p> : null}
        </div>
      ) : visibility === "login_required" ? (
        <p className="text-sm leading-6 text-slate-600">
          <Link href={`/login?next=/infos/${info.id}`} className="font-semibold text-brand">登录后查看联系方式</Link>
        </p>
      ) : (
        <p className="text-sm leading-6 text-slate-600">发布者选择隐藏联系方式，避免骚扰。你可以通过维界私信先说明需求。</p>
      )}
      {canMessage ? <MessageButton infoId={info.id} /> : null}
    </section>
  );
}
