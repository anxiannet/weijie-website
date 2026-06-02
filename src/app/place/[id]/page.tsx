import Link from "next/link";
import { MapPin } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { getInfos } from "@/lib/data";

function labelFromId(id: string) {
  return decodeURIComponent(id)
    .replace(/-\d{6}$|-sg$/, "")
    .replaceAll("-", " ")
    .trim();
}

export default async function PlacePage({ params }: { params: { id: string } }) {
  const label = labelFromId(params.id);
  const infos = await getInfos();
  const relatedInfos = infos.filter((info) => {
    const text = `${info.location_name ?? ""} ${info.location_text ?? ""} ${info.location_address ?? ""}`.toLowerCase();
    return text.includes(label.toLowerCase());
  });
  const place = relatedInfos.find((info) => info.location_name)?.location_name ?? label;
  const address = relatedInfos.find((info) => info.location_address)?.location_address;

  return (
    <main className="space-y-6 px-4 py-6 md:px-8">
      <section className="space-y-3">
        <Link href="/" className="text-sm font-medium text-brand">返回首页</Link>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist text-brand">
            <MapPin className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{place}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">{address ?? "Singapore"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["房源", "相关帖子", "附近美食", "达人推荐", "学校", "地铁", "周边服务"].map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100">{item}</div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">相关帖子</h2>
        {relatedInfos.length ? (
          <div className="columns-2 gap-3 space-y-3 md:columns-3">
            {relatedInfos.map((info) => <InfoCard key={info.id} info={info} />)}
          </div>
        ) : (
          <p className="rounded-lg bg-white p-4 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">还没有关联内容。</p>
        )}
      </section>
    </main>
  );
}
