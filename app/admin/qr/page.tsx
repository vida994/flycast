import Link from "next/link";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

export default function QRPage() {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://flycast-delta.vercel.app";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <header className="absolute left-0 top-0 flex w-full items-center justify-between border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-[var(--color-flycast-text)]">
          Flycast
        </h1>
        <Link
          href="/admin"
          className="text-sm font-medium text-[var(--color-flycast-accent)] hover:underline"
        >
          Back to Dashboard
        </Link>
      </header>
      <div className="flex flex-col items-center gap-6 py-16">
        <h2 className="text-3xl font-bold text-[var(--color-flycast-text)]">
          Flycast
        </h2>
        <p className="text-lg text-[var(--color-flycast-muted)]">
          Scan to follow live announcements
        </p>
        <QRCodeDisplay url={url} />
      </div>
    </main>
  );
}
