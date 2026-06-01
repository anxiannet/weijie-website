"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics/trackPageView";

export function PageViewTracker({ path, targetType, targetId }: { path: string; targetType: string; targetId?: string }) {
  useEffect(() => {
    void trackPageView({ path, target_type: targetType, target_id: targetId });
  }, [path, targetType, targetId]);
  return null;
}
