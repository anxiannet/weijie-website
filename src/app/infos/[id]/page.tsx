import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { CommentList } from "@/components/CommentList";
import { InfoTypeBadge } from "@/components/InfoTypeBadge";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ReportButton } from "@/components/ReportButton";
import { SaveButton } from "@/components/SaveButton";
import { TagBadge } from "@/components/TagBadge";
import { channelById, getInfo, getInfoComments, tagsByIds } from "@/lib/data";

function sectionTitleClass(line: string) {
  if (line === "一句话答案") return "mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-xl font-bold text-amber-900";
  if (line === "处理步骤") return "mt-6 rounded-xl border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-xl font-bold text-sky-900";
  if (line === "常见误区") return "mt-6 rounded-xl border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-xl font-bold text-rose-900";
  if (line === "相关问题") return "mt-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-xl font-bold text-emerald-900";
  return "mt-6 rounded-xl border-l-4 border-teal-500 bg-teal-50 px-4 py-3 text-xl font-bold text-teal-900";
}

function renderInfoContent(content: string): ReactElement[] {
  const lines = content.split("\n");
  const elements: ReactElement[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="my-3 space-y-2 rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-4 text-slate-750">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2 leading-7">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={index} className="mt-6 text-3xl font-bold leading-tight text-slate-950">{line.slice(2)}</h1>);
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={index} className={sectionTitleClass(line.slice(3))}>{line.slice(3)}</h2>);
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={index} className="mt-5 rounded-lg bg-slate-100 px-3 py-2 text-lg font-semibold text-slate-900">{line.slice(4)}</h3>);
      return;
    }

    if (line.startsWith("* ") || line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }

    if (/^\d+[\.、]\s*/.test(line)) {
      flushList();
      elements.push(<p key={index} className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 font-medium leading-8 text-sky-950">{line}</p>);
      return;
    }

    flushList();

    const isSectionTitle = ["一句话答案", "适用情况", "需要准备什么", "处理步骤", "常见误区", "相关问题", "更新时间"].includes(line);
    if (isSectionTitle) {
      elements.push(<h2 key={index} className={sectionTitleClass(line)}>{line}</h2>);
      return;
    }

    const isStepTitle = line.startsWith("第一步") || line.startsWith("第二步") || line.startsWith("第三步") || line.startsWith("第四步") || line.startsWith("第五步");
    const hasWarning = line.includes("❌");
    elements.push(
      <p key={index} className={hasWarning ? "rounded-xl bg-rose-50 px-4 py-2 leading-8 text-rose-900" : isStepTitle ? "mt-4 rounded-xl bg-sky-50 px-4 py-3 font-semibold leading-8 text-sky-950" : "leading-8 text-slate-700"}>
        {line}
      </p>
    );
  });

  flushList();
  return elements;
}

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
      <section className="rounded-2xl bg-white p-5 text-slate-700 shadow-sm ring-1 ring-slate-100">
        {renderInfoContent(info.content)}
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
