import { NextResponse } from "next/server";
import { after } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function getSalt() {
  return process.env.ANALYTICS_SALT ?? "dignity-trading-default-salt";
}

function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}|${getSalt()}`).digest("hex");
}

function startOfUtcDay(now: Date) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function firstForwardedIp(value: string | null) {
  if (!value) return "0.0.0.0";
  const first = value.split(",")[0]?.trim();
  return first || "0.0.0.0";
}

function sanitizePath(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) return "/";
  if (!input.startsWith("/")) return "/";
  if (input.length > 200) return input.slice(0, 200);
  return input;
}

function shouldSkipPath(path: string) {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/_next")
  );
}

export async function POST(req: Request) {
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const path = sanitizePath((body as { path?: unknown }).path);
  if (shouldSkipPath(path)) {
    return new NextResponse(null, { status: 204 });
  }

  const country = (req.headers.get("x-vercel-ip-country") ?? "XX")
    .slice(0, 2)
    .toUpperCase();
  const ip = firstForwardedIp(req.headers.get("x-forwarded-for"));
  const ipHash = hashIp(ip);
  const day = startOfUtcDay(new Date());

  after(async () => {
    try {
      await prisma.pageView.upsert({
        where: { day_ipHash_path: { day, ipHash, path } },
        update: {},
        create: { day, ipHash, country, path },
      });
    } catch {
      // swallow — never break the response
    }
  });

  return new NextResponse(null, { status: 204 });
}
