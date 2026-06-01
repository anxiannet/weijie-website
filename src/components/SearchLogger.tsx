"use client";

import { useEffect } from "react";
import { trackSearch } from "@/lib/analytics/trackSearch";

export function SearchLogger({ query, resultCount, matchedTagId, matchedChannelId }: { query: string; resultCount: number; matchedTagId?: string; matchedChannelId?: string }) {
  useEffect(() => {
    if (query) {
      void trackSearch({ query, result_count: resultCount, matched_tag_id: matchedTagId, matched_channel_id: matchedChannelId });
    }
  }, [query, resultCount, matchedTagId, matchedChannelId]);
  return null;
}
