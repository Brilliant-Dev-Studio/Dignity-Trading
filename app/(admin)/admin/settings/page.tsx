import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AdminToastFromQuery from "../AdminToastFromQuery";
import { changeAdminPassword, getAdminEmail } from "@/lib/admin-auth";
import PasswordField from "@/app/(auth)/admin/login/PasswordField";

export default async function AdminSettingsPage() {
  const email = await getAdminEmail();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <AdminToastFromQuery />

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <Badge>Account</Badge>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          Manage the admin account used to sign in to this dashboard.
        </p>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Signed-in account</CardTitle>
            <CardDescription>
              The email used at the login screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label className="text-xs text-zinc-500">Email</Label>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-800">
              {email}
            </div>
            <p className="text-xs text-zinc-500">
              Email changes are not supported from this screen yet.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Minimum 8 characters. New password takes effect on next sign-in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={changeAdminPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current password</Label>
                <PasswordField
                  id="currentPassword"
                  name="currentPassword"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <PasswordField
                  id="newPassword"
                  name="newPassword"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <PasswordField
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Update password</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
