import React, { useState } from "react";
import { useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export function AdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        toast({
          title: "Too many attempts",
          description: `Account temporarily locked. Try again in about ${Math.ceil((data.retryAfter || 900) / 60)} minutes.`,
          variant: "destructive",
        });
        return;
      }
      if (!res.ok) {
        toast({
          title: "Sign-in failed",
          description: "Please check your username and password and try again.",
          variant: "destructive",
        });
        return;
      }
      navigate("/admin");
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Try again shortly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative pt-40 pb-24 flex items-start justify-center">
      <SEO
        title="Admin Sign In — Automystics"
        description="Secure admin sign-in for Automystics enquiry management."
        canonical="/admin/login"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        <div className="bg-white border border-card-border rounded-[2.5rem] p-10 shadow-xl shadow-black/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight text-center mb-2">Admin Sign In</h1>
            <p className="text-muted-foreground text-center mb-8">
              Authorised personnel only. All sign-in attempts are logged.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-semibold ml-1">Username</Label>
                <Input
                  id="username"
                  data-testid="admin-username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white border-card-border focus-visible:ring-primary h-12 rounded-xl px-4 text-base shadow-sm"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-semibold ml-1">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="admin-password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-card-border focus-visible:ring-primary h-12 rounded-xl px-4 text-base shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                data-testid="admin-login-submit"
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-12 group shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
