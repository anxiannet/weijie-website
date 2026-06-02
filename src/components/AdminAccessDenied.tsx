import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function AdminAccessDenied() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-amber-600" />
      <div>
        <h1 className="text-2xl font-bold">需要管理员权限</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          后台内容只对 profiles.role 为 admin 的账号开放。
        </p>
      </div>
      <Link href="/login" className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
        去登录
      </Link>
    </div>
  );
}
