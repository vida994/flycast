"use client";

import { useState } from "react";
import { insertMessage } from "@/actions/messages";
import { SpeechToText } from "./SpeechToText";

const MAX_LENGTH = 1000;

export function ComposeMessage() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const isEmpty = text.trim().length === 0;
  const isOverLimit = text.length > MAX_LENGTH;
  const canSend = !isEmpty && !isOverLimit && !isSubmitting;

  function handleTranscript(transcript: string) {
    setText(transcript);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setError(null);
    setIsSubmitting(true);
    const result = await insertMessage(text);
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setText("");
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-[var(--color-flycast-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-flycast-accent)]"
          >
            <option value="en-US">English</option>
            <option value="hr-HR">Croatian</option>
          </select>
        </div>
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="Type or dictate your message..."
            rows={3}
            maxLength={MAX_LENGTH}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-[var(--color-flycast-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-flycast-accent)]"
          />
          <SpeechToText
            language={language}
            onTranscript={handleTranscript}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              isOverLimit ? "text-red-600" : "text-[var(--color-flycast-muted)]"
            }`}
          >
            {text.length}/{MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-md bg-[var(--color-flycast-accent)] px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
      {error && (
        <div
          className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
