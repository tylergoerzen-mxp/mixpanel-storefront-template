"use client";

import { useEffect, useState } from "react";
import { subscribe, type TrackedEvent } from "@/lib/analytics";

/**
 * A floating panel that shows events the instant they're tracked. Put it next
 * to Mixpanel's Events view and you can watch the same events land in both
 * places — the core "click around and see it stream" demo moment.
 */
export function LiveActivity({ mixpanelEnabled }: { mixpanelEnabled: boolean }) {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    return subscribe((event) => {
      setEvents((current) => [event, ...current].slice(0, 8));
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-2 border-b border-slate-100 bg-slate-900 px-4 py-3 text-left text-white"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span
              className={`h-2 w-2 rounded-full ${
                mixpanelEnabled ? "animate-pulse bg-emerald-400" : "bg-amber-400"
              }`}
            />
            Live events {mixpanelEnabled ? "→ Mixpanel" : "(local only)"}
          </span>
          <span className="text-xs text-slate-300">{open ? "hide" : "show"}</span>
        </button>

        {open && (
          <div className="max-h-80 overflow-y-auto">
            {events.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                Click around — events show up here and in your Mixpanel project.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events.map((event) => (
                  <li key={event.id} className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{event.name}</p>
                    {Object.keys(event.props).length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {Object.entries(event.props)
                          .map(([key, value]) => `${key}: ${String(value)}`)
                          .join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!mixpanelEnabled && open && (
          <p className="border-t border-slate-100 bg-amber-50 px-4 py-2 text-xs text-amber-700">
            No Mixpanel token detected. Run{" "}
            <code className="font-mono">stripe projects add mixpanel/analytics</code> to stream
            these events.
          </p>
        )}
      </div>
    </div>
  );
}
