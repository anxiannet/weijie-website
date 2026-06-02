import { AdminAccessDenied } from "@/components/AdminAccessDenied";
import { AdminTagManager } from "@/components/AdminTagManager";
import { getChannels, getTags } from "@/lib/data";
import { getAdminProfile } from "@/lib/supabase/server";

export default async function AdminTagsPage() {
  const admin = await getAdminProfile();
  if (!admin) return <AdminAccessDenied />;

  const [channels, tags] = await Promise.all([getChannels(), getTags()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <div>
          <p className="text-sm font-semibold text-brand">后台</p>
          <h1 className="mt-1 text-3xl font-bold">标签管理</h1>
        </div>
      </header>
      <AdminTagManager channels={channels} tags={tags} />
    </div>
  );
}
