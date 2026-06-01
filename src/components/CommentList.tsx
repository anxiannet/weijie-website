import type { Comment } from "@/types";

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">评论</h2>
      {comments.length === 0 ? <p className="text-sm text-slate-500">还没有评论。</p> : comments.map((comment) => (
        <div key={comment.id} className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
          <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
        </div>
      ))}
    </section>
  );
}
