import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldCheck } from "lucide-react";

export function AdminAccountSettings() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters for your new password.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Double-check the new password and confirmation.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          data?.error === "invalid_current_password"
            ? "Your current password is incorrect."
            : data?.error === "password_unchanged"
              ? "New password must be different from your current password."
              : "Please check your inputs and try again.";
        toast({ title: "Couldn't change password", description: message, variant: "destructive" });
        return;
      }

      toast({
        title: "Password changed",
        description: "Please sign in again with your new password.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/admin/login");
    } catch {
      toast({ title: "Couldn't change password", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Change password</h3>
            <p className="text-sm text-muted-foreground">
              You'll be signed out and asked to log in again after this change.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5 bg-white border-card-border rounded-xl h-11"
              data-testid="input-current-password"
              required
            />
          </div>
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 bg-white border-card-border rounded-xl h-11"
              data-testid="input-new-password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> At least 8 characters.
            </p>
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 bg-white border-card-border rounded-xl h-11"
              data-testid="input-confirm-password"
              minLength={8}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              data-testid="button-change-password"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? "Changing…" : "Change password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
