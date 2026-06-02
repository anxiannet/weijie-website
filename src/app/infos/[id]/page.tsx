import { notFound } from "next/navigation";
import { CommentList } from "@/components/CommentList";
import { InfoTypeBadge } from "@/components/InfoTypeBadge";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ReportButton } from "@/components/ReportButton";
import { SaveButton } from "@/components/SaveButton";
import { TagBadge } from "@/components/TagBadge";
import { channelById, getInfo, getInfoComments, tagsByIds } from "@/lib/data";

export default async function InfoPage({ params }: { params: { id: string } }) {
  const [info, comments] = await Promise.all([getInfo(params.id), getInfoComments(params.id)]);
  if (!info) notFound();
  const channel = info.channel ?? channelById(info.channel_id);
  const tags = info.tags?.length ? info.tags : tagsByIds(info.tag_ids);
  const coverSrc = info.cover_url || `/api/covers/${info.id}`;

  return (
    <article className="space-y-5 px-4 py-6 md:px-8">
      <PageViewTracker path={`/infos/${params.id}`} targetType="info" targetId={info.id} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverSrc} alt="" className="max-h-[560px] w-full rounded-lg object-cover shadow-sm" />
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <InfoTypeBadge type={info.info_type} />
          <span className="text-sm font-medium text-brand">{channel?.name}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">{info.title}</h1>
        <div className="flex flex-wrap gap-2">{tags.map((tag) => tag && <TagBadge key={tag.id} tag={tag} />)}</div>
      </header>
      <section className="rounded-lg bg-white p-5 leading-8 text-slate-700 shadow-sm ring-1 ring-slate-100">
        {info.content.split("\n").map((line) => <p key={line}>{line}</p>)}
      </section>
      <section className="grid gap-3 rounded-lg bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100 md:grid-cols-3">
        <p><span className="text-slate-500">价格：</span>{info.price_text ?? "未填写"}</p>
        <p><span className="text-slate-500">地点：</span>{info.location_text ?? "新加坡"}</p>
        <p><span className="text-slate-500">联系方式：</span>{info.contact_text ?? "作者未公开"}</p>
      </section>
      <div className="flex gap-2"><SaveButton /><ReportButton /></div>
      <CommentList comments={comments} />
    </article>
  );
}
