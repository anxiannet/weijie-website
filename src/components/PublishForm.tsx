import type { Channel, Tag } from "@/types";
import { PostComposer } from "@/components/post/PostComposer";

export function PublishForm({ channels, tags }: { channels: Channel[]; tags: Tag[] }) {
  return <PostComposer channels={channels} tags={tags} />;
}
