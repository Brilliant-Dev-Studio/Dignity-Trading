import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ensureAdminCredentialSeed,
  getAdminEmail as readAdminEmail,
  setAdminPassword,
  verifyAdminLogin,
} from "@/lib/admin-credentials";

const ADMIN_SESSION_COOKIE = "dignity_admin_session";
const ADMIN_SESSION_VALUE = "admin";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getAuthSecret() {
  return (
    process.env.ADMIN_AUTH_SECRET ??
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

export async function getAdminEmail() {
  return readAdminEmail();
}

export async function loginAdmin(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  await ensureAdminCredentialSeed();

  const ok = await verifyAdminLogin(email, password);
  if (!ok) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  // Clear any legacy cookie scoped to /admin (older builds)
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin?toast=login");
}

export async function logoutAdmin() {
  "use server";

  const cookieStore = await cookies();
  // Clear both current and legacy cookie paths
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}

export async function changeAdminPassword(formData: FormData) {
  "use server";

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!current || !next || !confirm) {
    redirect("/admin/settings?error=missing");
  }
  if (next.length < 8) {
    redirect("/admin/settings?error=short");
  }
  if (next !== confirm) {
    redirect("/admin/settings?error=mismatch");
  }
  if (next === current) {
    redirect("/admin/settings?error=same");
  }

  const email = await readAdminEmail();
  const ok = await verifyAdminLogin(email, current);
  if (!ok) {
    redirect("/admin/settings?error=invalidCurrent");
  }

  await setAdminPassword(next);
  redirect("/admin/settings?toast=passwordChanged");
}

export function getAdminLoginHint() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    email: process.env.ADMIN_EMAIL ?? "admin@dignity.local",
    password: process.env.ADMIN_PASSWORD ?? "admin12345",
  };
}
