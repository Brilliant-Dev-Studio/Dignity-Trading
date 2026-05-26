import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "dignity_admin_session";
const ADMIN_SESSION_VALUE = "admin";

function getAuthSecret() {
  return (
    process.env.ADMIN_AUTH_SECRET ??
    "dignity-trading-local-admin-secret"
  );
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signSessionEdge(value: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return hex(sig);
}

async function isValidSessionTokenEdge(token?: string) {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (value !== ADMIN_SESSION_VALUE || !signature) return false;
  const expected = await signSessionEdge(value);
  return signature === expected;
}

function isAdminPage(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function isAuthApi(pathname: string) {
  return (
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/logout") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    const res = NextResponse.redirect(url);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    // Clear both current and legacy cookie paths (two Set-Cookie headers)
    res.headers.append(
      "set-cookie",
      `${ADMIN_SESSION_COOKIE}=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
    );
    res.headers.append(
      "set-cookie",
      `${ADMIN_SESSION_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
    );
    return res;
  }

  const needsProtection =
    (isAdminPage(pathname) &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/logout") ||
    (isAdminApi(pathname) && !isAuthApi(pathname));

  if (!needsProtection) return NextResponse.next();

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const ok = await isValidSessionTokenEdge(token);
  if (ok) return NextResponse.next();

  if (isAdminApi(pathname)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

