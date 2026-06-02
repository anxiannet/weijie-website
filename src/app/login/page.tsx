import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-5 px-4 py-10">
      <header>
        <p className="text-sm font-semibold text-brand">Supabase Auth</p>
        <h1 className="mt-1 text-3xl font-bold">登录维界</h1>
      </header>
      <LoginForm />
    </div>
  );
}
