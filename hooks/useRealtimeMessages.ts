"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import type { FlycastMessage } from "@/lib/types";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function useRealtimeMessages() {
  const [messages, setMessages] = useState<FlycastMessage[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const supabase = createSupabaseClient();

    async function fetchMessages() {
      const { data, error } = await supabase
        .from("flycast_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessages(data as FlycastMessage[]);
        setConnectionStatus("connected");
      } else if (error) {
        setConnectionStatus("disconnected");
      }
    }

    void fetchMessages();

    const channel = supabase
      .channel("flycast_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "flycast_messages" },
        (payload) => {
          const newMessage = payload.new as FlycastMessage;
          setMessages((prev) => [newMessage, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "flycast_messages" },
        (payload) => {
          const updated = payload.new as FlycastMessage;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      )
      .subscribe((status) => {
        const statusStr = String(status);
        if (statusStr === "SUBSCRIBED") {
          setConnectionStatus("connected");
        } else if (
          statusStr === "CHANNEL_ERROR" ||
          statusStr === "TIMED_OUT" ||
          statusStr === "CLOSED"
        ) {
          setConnectionStatus("disconnected");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return { messages, connectionStatus };
}
