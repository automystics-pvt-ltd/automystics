import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Save,
  Send,
  ShieldCheck,
  Server,
  AtSign,
  Bell,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";

const PASSWORD_PLACEHOLDER = "__unchanged__";

const DEFAULT_DEMO_CONFIRMATION_SUBJECT = "We received your demo request — Automystics";
const DEFAULT_DEMO_CONFIRMATION_BODY = `Hi {{name}},

Thanks for requesting a demo of Automystics{{#productInterest}} for {{productInterest}}{{/productInterest}}!
We've received your request and a member of our team will reach out to {{email}} shortly to schedule a time.

Here's a summary of what you submitted:
Name:              {{name}}
Email:             {{email}}
Phone:             {{phone}}
Company:           {{company}}
Product interest:  {{productInterest}}
Scheduled for:     {{scheduledAt}}
{{#message}}Message:           {{message}}
{{/message}}
If any of this looks incorrect or you'd like to add more details, just reply to this email.

Talk soon,
The Automystics Team`;

const TEMPLATE_PLACEHOLDERS: { key: string; label: string }[] = [
  { key: "name", label: "Visitor's name" },
  { key: "email", label: "Visitor's email" },
  { key: "phone", label: "Phone (or —)" },
  { key: "company", label: "Company (or —)" },
  { key: "productInterest", label: "Product interest" },
  { key: "scheduledAt", label: "Requested date/time" },
  { key: "message", label: "Visitor's message" },
];

function renderPreview(template: string, vars: Record<string, string>): string {
  let out = template.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (_m, key: string, inner: string) =>
    vars[key] ? inner : ""
  );
  out = out.replace(/{{(\w+)}}/g, (_m, key: string) => vars[key] ?? "");
  return out;
}

const PREVIEW_VARS: Record<string, string> = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  phone: "+1 555-0100",
  company: "Acme Corp",
  productInterest: "Workflow Automation",
  scheduledAt: "Tuesday, July 14, 2026, 3:00 PM IST",
  message: "Looking forward to seeing the onboarding flow.",
};

type Settings = {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  hasPassword: boolean;
  fromEmail: string;
  fromName: string;
  notifyEmails: string;
  notifyOnNewEnquiry: boolean;
  notifyOnNewDemoRequest: boolean;
  notifyVisitorOnDemoRequest: boolean;
  enabled: boolean;
  demoConfirmationSubject: string;
  demoConfirmationBody: string;
  updatedAt: string | null;
};

const DEFAULTS: Settings = {
  smtpHost: "",
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: "",
  hasPassword: false,
  fromEmail: "",
  fromName: "Automystics",
  notifyEmails: "",
  notifyOnNewEnquiry: true,
  notifyOnNewDemoRequest: true,
  notifyVisitorOnDemoRequest: true,
  enabled: false,
  demoConfirmationSubject: DEFAULT_DEMO_CONFIRMATION_SUBJECT,
  demoConfirmationBody: DEFAULT_DEMO_CONFIRMATION_BODY,
  updatedAt: null,
};

export function AdminEmailSettings() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [password, setPassword] = useState<string>("");
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch("/api/admin/me", { credentials: "include" });
        if (!me.ok) { navigate("/admin/login"); return; }
        const res = await fetch("/api/admin/settings/email", { credentials: "include" });
        if (res.status === 401) { navigate("/admin/login"); return; }
        const data = await res.json();
        setSettings({ ...DEFAULTS, ...data.settings });
      } catch {
        toast({ title: "Failed to load settings", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        smtpHost: settings.smtpHost,
        smtpPort: Number(settings.smtpPort) || 587,
        smtpSecure: settings.smtpSecure,
        smtpUser: settings.smtpUser,
        fromEmail: settings.fromEmail,
        fromName: settings.fromName,
        notifyEmails: settings.notifyEmails,
        notifyOnNewEnquiry: settings.notifyOnNewEnquiry,
        notifyOnNewDemoRequest: settings.notifyOnNewDemoRequest,
        notifyVisitorOnDemoRequest: settings.notifyVisitorOnDemoRequest,
        enabled: settings.enabled,
        demoConfirmationSubject: settings.demoConfirmationSubject,
        demoConfirmationBody: settings.demoConfirmationBody,
      };
      payload.smtpPassword = touchedPassword ? password : PASSWORD_PLACEHOLDER;

      const res = await fetch("/api/admin/settings/email", {
        method: "PUT",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      if (!res.ok) {
        toast({ title: "Save failed", description: "Please check your inputs.", variant: "destructive" });
        return;
      }
      const data = await res.json();
      setSettings({ ...DEFAULTS, ...data.settings });
      setPassword("");
      setTouchedPassword(false);
      toast({ title: "Email settings saved" });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail) {
      toast({ title: "Enter an email address to send the test to", variant: "destructive" });
      return;
    }
    setTesting(true);
    try {
      const res = await fetch("/api/admin/settings/email/test", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      });
      if (res.status === 401) { navigate("/admin/login"); return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Test send failed",
          description: data?.message || "Check your SMTP settings and try again.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Test email sent", description: `Sent to ${testEmail}.` });
    } catch (err) {
      toast({ title: "Test send failed", variant: "destructive" });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading email settings…</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Status banner */}
      <div className={`rounded-3xl border p-5 flex items-start gap-4 ${
        settings.enabled
          ? "bg-emerald-50 border-emerald-200"
          : "bg-amber-50 border-amber-200"
      }`}>
        {settings.enabled ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-foreground">
            {settings.enabled ? "Email notifications are ON" : "Email notifications are OFF"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {settings.enabled
              ? "New enquiries will be emailed to your notification recipients using the SMTP settings below."
              : "Configure SMTP, add notification recipients, then turn the master switch on."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="enabled-toggle" className="text-sm font-semibold">Master switch</Label>
          <Switch
            id="enabled-toggle"
            checked={settings.enabled}
            onCheckedChange={(v) => update("enabled", v)}
            data-testid="email-enabled-switch"
          />
        </div>
      </div>

      {/* SMTP card */}
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">SMTP Server</h3>
            <p className="text-sm text-muted-foreground">Outgoing mail server used to send enquiry notifications and replies.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="smtpHost" className="font-semibold">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={settings.smtpHost}
              onChange={(e) => update("smtpHost", e.target.value)}
              placeholder="smtp.gmail.com"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="smtp-host"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort" className="font-semibold">Port</Label>
            <Input
              id="smtpPort"
              type="number"
              value={settings.smtpPort}
              onChange={(e) => update("smtpPort", Number(e.target.value) as Settings["smtpPort"])}
              placeholder="587"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="smtp-port"
            />
          </div>
          <div className="md:col-span-3 flex items-center justify-between bg-muted/40 border border-card-border rounded-2xl p-4">
            <div>
              <Label htmlFor="smtpSecure" className="font-semibold">Use SSL/TLS (secure)</Label>
              <p className="text-xs text-muted-foreground mt-1">Turn ON for port 465. For STARTTLS (port 587), keep this OFF.</p>
            </div>
            <Switch
              id="smtpSecure"
              checked={settings.smtpSecure}
              onCheckedChange={(v) => update("smtpSecure", v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUser" className="font-semibold">Username</Label>
            <Input
              id="smtpUser"
              value={settings.smtpUser}
              onChange={(e) => update("smtpUser", e.target.value)}
              placeholder="user@example.com"
              autoComplete="off"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="smtp-user"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="smtpPassword" className="font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Password / App Password
            </Label>
            <Input
              id="smtpPassword"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setTouchedPassword(true); }}
              placeholder={settings.hasPassword ? "•••••••• (saved — leave blank to keep)" : "App password or SMTP password"}
              autoComplete="new-password"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="smtp-password"
            />
            <p className="text-xs text-muted-foreground">For Gmail, generate an app password at myaccount.google.com/apppasswords.</p>
          </div>
        </div>
      </div>

      {/* From / Recipients card */}
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <AtSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Sender & Recipients</h3>
            <p className="text-sm text-muted-foreground">Who emails are sent from, and who gets notified about new enquiries.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="fromEmail" className="font-semibold">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={(e) => update("fromEmail", e.target.value)}
              placeholder="hello@automystics.com"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="from-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromName" className="font-semibold">From Name</Label>
            <Input
              id="fromName"
              value={settings.fromName}
              onChange={(e) => update("fromName", e.target.value)}
              placeholder="Automystics"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="from-name"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notifyEmails" className="font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notification Recipients
            </Label>
            <Input
              id="notifyEmails"
              value={settings.notifyEmails}
              onChange={(e) => update("notifyEmails", e.target.value)}
              placeholder="sales@automystics.com, founder@automystics.com"
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="notify-emails"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list. These addresses receive an email every time a new enquiry comes in.</p>
          </div>
          <div className="md:col-span-2 flex items-center justify-between bg-muted/40 border border-card-border rounded-2xl p-4">
            <div>
              <Label htmlFor="notifyToggle" className="font-semibold">Notify on new enquiry</Label>
              <p className="text-xs text-muted-foreground mt-1">Send an email to your notification recipients whenever a contact form is submitted.</p>
            </div>
            <Switch
              id="notifyToggle"
              checked={settings.notifyOnNewEnquiry}
              onCheckedChange={(v) => update("notifyOnNewEnquiry", v)}
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between bg-muted/40 border border-card-border rounded-2xl p-4">
            <div>
              <Label htmlFor="notifyDemoToggle" className="font-semibold">Notify on new demo request</Label>
              <p className="text-xs text-muted-foreground mt-1">Send an email to your notification recipients whenever a visitor books a demo.</p>
            </div>
            <Switch
              id="notifyDemoToggle"
              checked={settings.notifyOnNewDemoRequest}
              onCheckedChange={(v) => update("notifyOnNewDemoRequest", v)}
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between bg-muted/40 border border-card-border rounded-2xl p-4">
            <div>
              <Label htmlFor="notifyVisitorDemoToggle" className="font-semibold">Send visitors a confirmation email</Label>
              <p className="text-xs text-muted-foreground mt-1">Email the visitor a confirmation whenever they book a demo. Turn off to only notify your team.</p>
            </div>
            <Switch
              id="notifyVisitorDemoToggle"
              checked={settings.notifyVisitorOnDemoRequest}
              onCheckedChange={(v) => update("notifyVisitorOnDemoRequest", v)}
              data-testid="notify-visitor-demo-switch"
            />
          </div>
        </div>
      </div>

      {/* Confirmation email template card */}
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Visitor Confirmation Email</h3>
              <p className="text-sm text-muted-foreground">Customize the subject and wording of the email sent to visitors after they book a demo.</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              update("demoConfirmationSubject", DEFAULT_DEMO_CONFIRMATION_SUBJECT);
              update("demoConfirmationBody", DEFAULT_DEMO_CONFIRMATION_BODY);
            }}
            className="rounded-full h-10 px-4"
            data-testid="reset-confirmation-template"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset to default
          </Button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="demoConfirmationSubject" className="font-semibold">Subject</Label>
            <Input
              id="demoConfirmationSubject"
              value={settings.demoConfirmationSubject}
              onChange={(e) => update("demoConfirmationSubject", e.target.value)}
              placeholder={DEFAULT_DEMO_CONFIRMATION_SUBJECT}
              className="h-11 rounded-xl bg-white border-card-border"
              data-testid="demo-confirmation-subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoConfirmationBody" className="font-semibold">Body</Label>
            <Textarea
              id="demoConfirmationBody"
              value={settings.demoConfirmationBody}
              onChange={(e) => update("demoConfirmationBody", e.target.value)}
              placeholder={DEFAULT_DEMO_CONFIRMATION_BODY}
              rows={14}
              className="rounded-xl bg-white border-card-border font-mono text-sm"
              data-testid="demo-confirmation-body"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Available placeholders:</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_PLACEHOLDERS.map((p) => (
                  <code key={p.key} className="px-2 py-1 rounded-md bg-muted font-mono" title={p.label}>
                    {`{{${p.key}}}`}
                  </code>
                ))}
              </div>
              <p>
                Wrap optional lines with <code className="font-mono">{`{{#message}}...{{/message}}`}</code> to hide them when that field is blank.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Preview</Label>
            <div className="rounded-2xl border border-card-border bg-muted/30 p-5 space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Subject: </span>
                <span className="font-semibold">{renderPreview(settings.demoConfirmationSubject || DEFAULT_DEMO_CONFIRMATION_SUBJECT, PREVIEW_VARS)}</span>
              </div>
              <div className="text-sm whitespace-pre-wrap font-mono bg-white border border-card-border rounded-xl p-4">
                {renderPreview(settings.demoConfirmationBody || DEFAULT_DEMO_CONFIRMATION_BODY, PREVIEW_VARS)}
              </div>
              <p className="text-xs text-muted-foreground">Preview uses sample data and only appears when the "Send visitors a confirmation email" toggle above is on.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test card */}
      <div className="bg-white border border-card-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Send Test Email</h3>
            <p className="text-sm text-muted-foreground">Save your settings first, then send a test to verify everything works.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 rounded-xl bg-white border-card-border flex-1"
            data-testid="test-email-input"
          />
          <Button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="rounded-full bg-foreground hover:bg-foreground/90 text-foreground h-12 px-6"
            data-testid="send-test-email"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Send test
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 bg-white border border-card-border rounded-2xl p-4 shadow-xl">
        <div className="text-sm text-muted-foreground">
          {settings.updatedAt ? (
            <>Last updated {new Date(settings.updatedAt).toLocaleString()}</>
          ) : (
            <>Not yet configured</>
          )}
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 shadow-lg shadow-primary/20"
          data-testid="save-email-settings"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save settings
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground flex items-start gap-2">
        <Mail className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          Tip: For Gmail use host <code className="font-mono">smtp.gmail.com</code>, port <code className="font-mono">587</code>, secure OFF, and an app password.
          For SendGrid use <code className="font-mono">smtp.sendgrid.net</code>, port <code className="font-mono">587</code>, username <code className="font-mono">apikey</code>, and your API key as the password.
        </span>
      </div>
    </form>
  );
}
