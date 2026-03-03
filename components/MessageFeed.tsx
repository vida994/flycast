"use client";

import { useEffect, useRef } from "react";
import { useRealtimeMessages, type ConnectionStatus } from "@/hooks/useRealtimeMessages";
import { MessageCard } from "./MessageCard";

function ConnectionBanner({ status }: { status: ConnectionStatus }) {
  if (status === "connected") return null;
  return (
    <div className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
      {status === "connecting" ? "Connecting..." : "Reconnecting..."}
    </div>
  );
}

export function MessageFeed() {
  const { messages, connectionStatus } = useRealtimeMessages();
  const topRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  return (
    <div className="flex flex-1 flex-col">
      <ConnectionBanner status={connectionStatus} />
      <div ref={topRef} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
            <svg
              className="h-16 w-16 text-[var(--color-flycast-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <p className="text-lg text-[var(--color-flycast-muted)]">
              No announcements yet. Stay tuned.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="animate-slide-in">
              <MessageCard message={message} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
