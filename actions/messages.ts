"use server";

import { cookies } from "next/headers";
import { createSupabaseClient } from "@/lib/supabase";
import { getSession } from "./auth";

export async function insertMessage(text: string): Promise<{ error?: string }> {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return { error: "Unauthorized" };
  }

  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 1000) {
    return { error: "Invalid message" };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("flycast_messages")
      .insert({ text: trimmed });

    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}

export async function updateMessage(
  id: string,
  text: string
): Promise<{ error?: string }> {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return { error: "Unauthorized" };
  }

  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 1000) {
    return { error: "Invalid message" };
  }

  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("flycast_messages")
    .update({ text: trimmed })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  return {};
}
