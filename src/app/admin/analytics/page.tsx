import { AnalyticsTable } from "@/components/AnalyticsTable";
import { getChannels, getInfos, getTags } from "@/lib/data";

export default async function AnalyticsPage() {
  const [channels, tags, infos] = await Promise.all([getChannels(), getTags(), getInfos()]);
  return (
    <div className="space-y-5 px-4 py-6 md:px-8">
      <header>
        <p className="text-sm font-semibold text-brand">后台</p>
        <h1 className="mt-1 text-3xl font-bold">数据监控</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsTable title="搜索词排行" rows={[{ name: "NTU租房", value: 88 }, { name: "蒸饺", value: 58 }, { name: "陪诊", value: 36 }]} />
        <AnalyticsTable title="无结果搜索排行" rows={[{ name: "月嫂", value: 7 }, { name: "宠物寄养", value: 5 }, { name: "中文心理咨询", value: 4 }]} />
        <AnalyticsTable title="频道访问排行" rows={channels.slice(0, 6).map((channel, index) => ({ name: channel.name, value: 420 - index * 38 }))} />
        <AnalyticsTable title="标签访问排行" rows={tags.slice(0, 8).map((tag) => ({ name: tag.name, value: tag.info_count * 23 + 10 }))} />
        <AnalyticsTable title="信息访问排行" rows={infos.slice(0, 6).map((info, index) => ({ name: info.title, value: 180 - index * 17 }))} />
        <AnalyticsTable title="热门发布类型" rows={[{ name: "rental", value: 41 }, { name: "guide", value: 33 }, { name: "service", value: 21 }, { name: "secondhand", value: 16 }]} />
      </div>
    </div>
  );
}
