import Link from "next/link";
import { ComposeMessage } from "@/components/ComposeMessage";
import { MessageHistory } from "@/components/MessageHistory";

export default function AdminPage() {
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
            Flycast Admin
          </h1>
        </div>
        <nav className="flex gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-[var(--color-flycast-accent)] hover:underline"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/qr"
            className="text-sm font-medium text-[var(--color-flycast-accent)] hover:underline"
          >
            QR Code
          </Link>
        </nav>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <section className="shrink-0 md:sticky md:top-0 md:z-10 md:bg-[var(--color-flycast-bg)] md:pb-4">
          <ComposeMessage />
        </section>
        <section className="flex-1">
          <MessageHistory />
        </section>
      </div>
    </main>
  );
}
