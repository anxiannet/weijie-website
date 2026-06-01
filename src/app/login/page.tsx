export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-5 px-4 py-10">
      <header>
        <p className="text-sm font-semibold text-brand">Supabase Auth</p>
        <h1 className="mt-1 text-3xl font-bold">登录维界</h1>
      </header>
      <form className="space-y-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <input type="email" placeholder="邮箱" className="w-full rounded-lg border border-slate-200 px-3 py-3" />
        <button className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white">发送登录链接</button>
        <p className="text-sm leading-6 text-slate-500">配置 Supabase 环境变量后，可接入 Magic Link、OAuth 或密码登录。</p>
      </form>
    </div>
  );
}
