import type { InfoType } from "@/types";

const labels: Record<InfoType, string> = {
  note: "信息",
  rental: "房源",
  service: "服务",
  business: "商家",
  food: "美食",
  event: "活动",
  secondhand: "二手",
  guide: "攻略",
  news: "资讯",
  question: "求助"
};

export function InfoTypeBadge({ type }: { type: InfoType }) {
  return <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700">{labels[type]}</span>;
}
