import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { InfoCard } from "@/components/InfoCard";
import { getMyComments, getMyInfos, getMySavedInfos } from "@/lib/data";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/server";

export default async function MePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">我的</h1>
        <p className="text-sm leading-6 text-slate-500">登录后可以查看自己的发布、收藏和评论。</p>
        <Link href="/login" className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          去登录
        </Link>
      </div>
    );
  }

  const [profile, infos, savedInfos, comments] = await Promise.all([
    getCurrentProfile(),
    getMyInfos(),
    getMySavedInfos(),
    getMyComments()
  ]);

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <section className="flex flex-wrap items-start justify-between gap-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div>
          <h1 className="text-2xl font-bold">{profile?.nickname ?? user.email ?? "我的"}</h1>
          <p className="mt-2 text-sm text-slate-600">角色：{profile?.role ?? "user"}</p>
        </div>
        <LogoutButton />
      </section>
      <h2 className="font-semibold">我的信息</h2>
      {infos.length ? (
        <div className="columns-2 gap-3 space-y-3 md:columns-3">{infos.map((info) => <InfoCard key={info.id} info={info} />)}</div>
      ) : (
        <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">还没有发布信息。</p>
      )}
      <h2 className="font-semibold">我的收藏</h2>
      {savedInfos.length ? (
        <div className="columns-2 gap-3 space-y-3 md:columns-3">{savedInfos.map((info) => <InfoCard key={info.id} info={info} />)}</div>
      ) : (
        <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">还没有收藏。</p>
      )}
      <h2 className="font-semibold">我的评论</h2>
      {comments.length ? (
        <section className="space-y-2">
          {comments.map((comment) => (
            <p key={comment.id} className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
              {comment.content}
            </p>
          ))}
        </section>
      ) : (
        <p className="rounded-lg bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-100">还没有评论。</p>
      )}
    </div>
  );
}
