import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { AIDraftEditor } from "@/components/AIDraftEditor";
import { getChannels, getTags } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminAIPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;

  const [channels, tags] = await Promise.all([getChannels(), getTags()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">AI 内容生成</h1>
        <p className="mt-2 leading-7 text-slate-600">生成内容先进入 ai_drafts，管理员审核后再发布为 Info。</p>
      </header>
      <AIDraftEditor channels={channels} tags={tags} />
    </div>
  );
}
