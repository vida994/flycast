import Link from "next/link";
import { MessageFeed } from "@/components/MessageFeed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-flycast-bg)]">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-[var(--color-flycast-accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <h1 className="text-2xl font-bold text-[var(--color-flycast-text)]">
            Flycast
          </h1>
        </div>
        <Link
          href="/admin"
          className="rounded-md bg-[var(--color-flycast-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Admin
        </Link>
      </header>
      <MessageFeed />
    </main>
  );
}
