import { HomeChannelFeed } from "@/components/HomeChannelFeed";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getChannels, getInfos } from "@/lib/data";

export default async function HomePage({ searchParams }: { searchParams: { channel?: string } }) {
  const [channels, allInfos] = await Promise.all([getChannels(), getInfos()]);

  return (
    <>
      <PageViewTracker path="/" targetType="home" />
      <HomeChannelFeed channels={channels} infos={allInfos} initialChannelSlug={searchParams.channel} />
    </>
  );
}
