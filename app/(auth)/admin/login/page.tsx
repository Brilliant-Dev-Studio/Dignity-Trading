import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminLoginHint,
  isAdminAuthenticated,
  loginAdmin,
} from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "invalid";
  const loginHint = getAdminLoginHint();

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-950">
      <div className="grid min-h-dvh lg:grid-cols-[60%_40%]">
        <section className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:block">
          <video
            className="absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4"
              type="video/mp4"
            />
          </video>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(900px_520px_at_85%_78%,rgba(84,168,230,0.26),transparent_60%),radial-gradient(700px_420px_at_18%_88%,rgba(47,102,212,0.20),transparent_62%),linear-gradient(to_top,rgba(84,168,230,0.18),transparent_58%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.52))]"
          />
          <div className="relative flex h-full flex-col justify-between">
            <Badge className="w-fit gap-2 border-white/15 bg-white/10 py-1.5 pr-3 text-white">
              <Image
                src="/logo.png"
                alt="Dignity Trading logo"
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
                priority
              />
              Dignity Trading Admin
            </Badge>
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/55">
                Control room
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                Manage the trading education business from one calm workspace.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                Review student activity, course operations, capital challenges,
                and performance signals without leaving the admin area.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden bg-zinc-950 px-5 py-10 sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.55))]"
          />
          <Card className="relative z-10 w-full max-w-sm xl:max-w-md">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Sign in with your admin credentials to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={loginAdmin} className="space-y-4">
                {hasError ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    Email or password is incorrect.
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@dignity.local"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>

              {loginHint ? (
                <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-600">
                  Local demo credentials: {loginHint.email} / {loginHint.password}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
