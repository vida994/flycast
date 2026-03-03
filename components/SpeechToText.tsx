"use client";

import { useState, useRef, useCallback } from "react";

type SpeechToTextProps = {
  language: string;
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined;

export function SpeechToText({
  language,
  onTranscript,
  disabled = false,
}: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  function handleClick() {
    if (!SpeechRecognition) return;
    if (disabled) return;

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      if (fullTranscript) {
        onTranscript(fullTranscript);
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognition.onerror = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }

  if (!SpeechRecognition) {
    return (
      <button
        type="button"
        disabled
        title="Speech-to-text requires a Chromium-based browser (Chrome, Edge, Opera)."
        className="rounded-md p-2 text-[var(--color-flycast-muted)] opacity-50"
      >
        <MicrophoneIcon filled={false} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={isListening ? "Stop dictating" : "Dictate"}
      className={`rounded-md p-2 transition-colors ${
        isListening
          ? "bg-[var(--color-flycast-accent)] text-white animate-pulse"
          : "text-[var(--color-flycast-accent)] hover:bg-gray-100"
      }`}
    >
      <MicrophoneIcon filled={isListening} />
    </button>
  );
}

function MicrophoneIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}
