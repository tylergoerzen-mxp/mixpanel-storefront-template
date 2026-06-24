"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires a single event when the component mounts. Drop it into any server-
 * rendered page to record a view event (e.g. "Product Viewed") without making
 * the whole page a client component.
 */
export function TrackOnView({
  name,
  props = {},
}: {
  name: string;
  props?: Record<string, unknown>;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(name, props);
    // We intentionally fire once per mount; props are captured at mount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
