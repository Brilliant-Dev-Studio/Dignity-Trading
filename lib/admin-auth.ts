import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "dignity_admin_session";
const ADMIN_SESSION_VALUE = "admin";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@dignity.local";
}

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

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

function isValidSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const [value, signature] = token.split(".");

  if (value !== ADMIN_SESSION_VALUE || !signature) {
    return false;
  }

  const expected = signSession(value);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function loginAdmin(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== getAdminEmail().toLowerCase() || password !== getAdminPassword()) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
  redirect("/admin/login");
}

export function getAdminLoginHint() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    email: getAdminEmail(),
    password: getAdminPassword(),
  };
}
