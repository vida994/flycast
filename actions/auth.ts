"use server";

import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 3600; // 1 hour

function signToken(payload: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = JSON.stringify({ exp });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = signToken(encoded);
  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string): boolean {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return false;
    if (signature !== signToken(encoded)) return false;
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    );
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { success: false, error: "Server not configured" };
  }
  if (password !== expected) {
    return { success: false, error: "Invalid password" };
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return { success: true };
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
