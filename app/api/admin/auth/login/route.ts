import { createHmac } from "crypto";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "dignity_admin_session";
const ADMIN_SESSION_VALUE = "admin";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL ?? "admin@dignity.local").toLowerCase();
}

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin12345";
}

function getAuthSecret() {
  return (
    process.env.ADMIN_AUTH_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "dignity-trading-local-admin-secret"
  );
}

function signSession(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function createSessionToken() {
  return `${ADMIN_SESSION_VALUE}.${signSession(ADMIN_SESSION_VALUE)}`;
}

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (email !== getAdminEmail() || password !== getAdminPassword()) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Clear any legacy cookie scoped to /admin (older builds)
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

