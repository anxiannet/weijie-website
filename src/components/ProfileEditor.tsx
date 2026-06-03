"use client";

import { FormEvent, useState } from "react";
import { Edit3, Image as ImageIcon, MapPin, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

type ProfileEditorProps = {
  profile: Profile | null;
  email?: string | null;
};

export function ProfileEditor({ profile, email }: ProfileEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nickname: profile?.nickname ?? email?.split("@")[0] ?? "维界用户",
    avatarUrl: profile?.avatar_url ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? ""
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();

    setSaving(false);
    if (!response.ok) {
      setMessage(result.error ?? "保存失败，请稍后再试。");
      return;
    }

    setEditing(false);
    setMessage("资料已保存。");
    router.refresh();
  }

  const fallbackInitial = (form.nickname || email || "维").slice(0, 1).toUpperCase();

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-brand text-xl font-bold text-white">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarUrl} alt={`${form.nickname || "用户"}头像`} className="h-full w-full object-cover" />
            ) : (
              fallbackInitial
            )}
          </div>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold">{profile?.nickname ?? form.nickname}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>角色：{profile?.role ?? "user"}</span>
              {profile?.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-brand" />
                  {profile.location}
                </span>
              ) : null}
            </div>
            {profile?.bio ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{profile.bio}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing((value) => !value);
            setMessage("");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          {editing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {editing ? "取消" : "编辑资料"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-slate-700">
            <span>昵称</span>
            <input
              value={form.nickname}
              onChange={(event) => setForm({ ...form, nickname: event.target.value })}
              maxLength={32}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-brand"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700">
            <span>位置</span>
            <input
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              maxLength={40}
              placeholder="例如 Jurong West"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-brand"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
            <span>头像 URL</span>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3">
              <ImageIcon className="h-4 w-4 shrink-0 text-brand" />
              <input
                value={form.avatarUrl}
                onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
                placeholder="https://..."
                className="min-w-0 flex-1 outline-none"
              />
            </div>
          </label>
          <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
            <span>简介</span>
            <textarea
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              maxLength={160}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-3 leading-6 outline-brand"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "保存中" : "保存资料"}
            </button>
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </div>
        </form>
      ) : message ? (
        <p className="mt-3 text-sm text-emerald-700">{message}</p>
      ) : null}
    </section>
  );
}
