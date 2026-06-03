import type { Metadata } from "next";
import { Bell, Home, Plus, Search, UserRound } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "维界 Weijie",
  description: "新加坡华人本地生活内容社区"
};

const nav = [
  { href: "/", label: "首页", icon: Home },
  { href: "/search", label: "搜索", icon: Search },
  { href: "/publish", label: "发布", icon: Plus, primary: true },
  { href: "/messages", label: "消息", icon: Bell },
  { href: "/me", label: "我的", icon: UserRound }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="mx-auto min-h-screen max-w-5xl pb-24 md:pb-8">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 py-2">
            {nav.map((item) => {
              const Icon = item.icon;
              if (item.primary) {
                return (
                  <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-2 text-xs font-medium text-brand">
                    <span className="-mt-7 grid h-14 w-16 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-teal-900/20">
                      <Icon className="h-8 w-8 stroke-[3]" />
                    </span>
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-600">
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </body>
    </html>
  );
}
