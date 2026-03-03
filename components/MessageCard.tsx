"use client";

import { useEffect, useState } from "react";
import type { FlycastMessage } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type MessageCardProps = {
  message: FlycastMessage;
};

export function MessageCard({ message }: MessageCardProps) {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(message.updated_at)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(message.updated_at));
    }, 30000);
    return () => clearInterval(interval);
  }, [message.updated_at]);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-lg font-medium text-[var(--color-flycast-text)] sm:text-xl">
        {message.text}
      </p>
      <time
        className="mt-2 block text-sm text-[var(--color-flycast-muted)]"
        dateTime={message.updated_at}
      >
        {relativeTime}
      </time>
    </article>
  );
}
