"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("未配置 Supabase 环境变量，暂不能发送登录链接。");
      return;
    }

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/me`
      }
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("登录链接已发送，请查看邮箱。");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder="邮箱"
        className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-brand"
      />
      <button
        disabled={status === "sending" || !hasSupabaseEnv}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail className="h-4 w-4" />
        {status === "sending" ? "发送中" : "发送登录链接"}
      </button>
      {message ? (
        <p className={status === "error" ? "text-sm leading-6 text-rose-600" : "text-sm leading-6 text-emerald-700"}>
          {message}
        </p>
      ) : (
        <p className="text-sm leading-6 text-slate-500">
          使用 Supabase Magic Link 登录。管理员权限由 profiles.role 控制。
        </p>
      )}
    </form>
  );
}
