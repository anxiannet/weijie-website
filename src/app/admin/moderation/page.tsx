import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { ModerationCommentItem } from "@/components/ModerationCommentItem";
import { ModerationItem } from "@/components/ModerationItem";
import { EmptyState } from "@/components/EmptyState";
import { getPendingComments, getPendingInfos } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function ModerationPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;

  const [infos, comments] = await Promise.all([getPendingInfos(), getPendingComments()]);

  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">审核中心</h1>
        <p className="mt-2 text-sm text-slate-500">待审核信息会在通过后进入前台信息流。</p>
      </header>
      {infos.length || comments.length ? (
        <section className="space-y-3">
          {infos.length ? <h2 className="font-semibold">待审核信息</h2> : null}
          {infos.map((info) => <ModerationItem key={info.id} info={info} />)}
          {comments.length ? <h2 className="pt-3 font-semibold">待审核评论</h2> : null}
          {comments.map((comment) => <ModerationCommentItem key={comment.id} comment={comment} />)}
        </section>
      ) : (
        <EmptyState title="暂无待审核信息" description="用户发布的新信息会出现在这里。" />
      )}
    </div>
  );
}
