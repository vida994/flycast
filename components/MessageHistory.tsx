"use client";

import { useState } from "react";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { updateMessage } from "@/actions/messages";
import { MessageCard } from "./MessageCard";
import type { FlycastMessage } from "@/lib/types";

export function MessageHistory() {
  const { messages } = useRealtimeMessages();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function startEdit(message: FlycastMessage) {
    setEditingId(message.id);
    setEditText(message.text);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setError(null);
  }

  async function saveEdit() {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed || trimmed.length > 1000) {
      setError("Message must be 1-1000 characters");
      return;
    }
    const result = await updateMessage(editingId, trimmed);
    if (result.error) {
      setError("Failed to update message. Please try again.");
    } else {
      setEditingId(null);
      setEditText("");
      setError(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[var(--color-flycast-text)]">
        Message History
      </h2>
      {messages.length === 0 ? (
        <p className="py-8 text-center text-[var(--color-flycast-muted)]">
          No messages yet. Send your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) =>
            editingId === message.id ? (
              <div
                key={message.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <textarea
                  value={editText}
                  onChange={(e) =>
                    setEditText(e.target.value.slice(0, 1000))
                  }
                  rows={3}
                  maxLength={1000}
                  className="mb-3 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--color-flycast-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-flycast-accent)]"
                  autoFocus
                />
                {error && (
                  <p className="mb-2 text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-md bg-[var(--color-flycast-accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className="flex items-start gap-2"
              >
                <div className="min-w-0 flex-1">
                  <MessageCard message={message} />
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(message)}
                  className="shrink-0 self-center rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-flycast-accent)] hover:bg-gray-100"
                >
                  Edit
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
