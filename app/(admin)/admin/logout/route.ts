import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "dignity_admin_session";

function buildDeleteCookie(path: "/" | "/admin") {
  const parts = [
    `${ADMIN_SESSION_COOKIE}=`,
    `Path=${path}`,
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export async function GET(req: Request) {
  // Return an HTML response (not a redirect) so the browser
  // definitely applies Set-Cookie before navigating away.
  const res = new NextResponse(
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/admin/login?toast=logged_out" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Logging out…</title>
  </head>
  <body>
    <script>
      location.replace("/admin/login?toast=logged_out");
    </script>
  </body>
</html>`,
    {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
  // Clear both current and legacy cookie paths (must be two Set-Cookie headers).
  res.headers.append("set-cookie", buildDeleteCookie("/admin"));
  res.headers.append("set-cookie", buildDeleteCookie("/"));
  return res;
}

