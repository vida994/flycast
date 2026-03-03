"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminPassword } from "@/actions/auth";

export function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await verifyAdminPassword(password);
    setIsLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Invalid password");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-flycast-bg)] px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-[var(--color-flycast-text)]">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--color-flycast-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-flycast-accent)]"
            autoFocus
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-[var(--color-flycast-accent)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
