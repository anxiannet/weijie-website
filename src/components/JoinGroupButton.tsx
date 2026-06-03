"use client";

import { useState } from "react";

export function JoinGroupButton({ groupId }: { groupId: string }) {
  const [state, setState] = useState("加入群聊");
  async function join() {
    setState("处理中");
    const response = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId })
    });
    setState(response.ok ? "已加入" : "请先登录");
    if (response.ok) window.location.reload();
  }
  return <button type="button" onClick={join} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">{state}</button>;
}
