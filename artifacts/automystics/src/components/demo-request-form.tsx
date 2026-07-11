import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, CheckCircle2, ArrowUpRight } from "lucide-react";
import type { PublicDemo } from "@/hooks/use-demos";

export function DemoRequestForm({ demos }: { demos: PublicDemo[] }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      company: String(data.get("company") || "").trim(),
      productInterest: String(data.get("productInterest") || "").trim(),
      preferredDate: String(data.get("preferredDate") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "request_failed");
      }
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Demo request received",
        description: "Our team will reach out shortly to schedule your walkthrough.",
      });
    } catch {
      toast({
        title: "Could not send your request",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      id="book-a-demo"
      className="bg-white border border-card-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden card-hover-effect scroll-mt-32"
      data-testid="demo-request-form"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {isSuccess ? (
        <div className="text-center py-16 relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-8 border border-primary/30">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Request Received</h3>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            Thank you — a specialist will reach out to schedule your personal walkthrough.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full h-12 px-8 border-card-border text-foreground font-semibold bg-white hover:bg-muted">
            Book Another Demo
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-4 uppercase tracking-wide">
              <CalendarCheck className="w-4 h-4" /> Prefer a guided tour?
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Book a Personal Demo</h3>
            <p className="text-muted-foreground mt-2">
              Tell us what you're looking for and our team will walk you through it live.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="demo-name" className="text-foreground font-semibold ml-1">Full Name</Label>
              <Input id="demo-name" name="name" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="John Doe" data-testid="demo-request-name" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="demo-email" className="text-foreground font-semibold ml-1">Work Email</Label>
              <Input id="demo-email" name="email" type="email" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="john@company.com" data-testid="demo-request-email" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="demo-phone" className="text-foreground font-semibold ml-1">Phone (optional)</Label>
              <Input id="demo-phone" name="phone" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="+91 98765 43210" data-testid="demo-request-phone" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="demo-company" className="text-foreground font-semibold ml-1">Company (optional)</Label>
              <Input id="demo-company" name="company" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="Acme Corp" data-testid="demo-request-company" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="demo-product" className="text-foreground font-semibold ml-1">Which product? (optional)</Label>
              {demos.length > 0 ? (
                <select
                  id="demo-product"
                  name="productInterest"
                  className="w-full h-14 rounded-2xl px-4 text-lg shadow-sm bg-white border border-card-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-testid="demo-request-product"
                >
                  <option value="">Not sure yet</option>
                  {demos.map((d) => (
                    <option key={d.id} value={d.title}>{d.title}</option>
                  ))}
                </select>
              ) : (
                <Input id="demo-product" name="productInterest" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="e.g. Chit Fund Management" data-testid="demo-request-product" />
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="demo-date" className="text-foreground font-semibold ml-1">Preferred date/time (optional)</Label>
              <Input id="demo-date" name="preferredDate" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="e.g. Weekday afternoons" data-testid="demo-request-date" />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="demo-message" className="text-foreground font-semibold ml-1">What would you like to see? (optional)</Label>
            <Textarea
              id="demo-message"
              name="message"
              className="min-h-[120px] bg-white border-card-border focus-visible:ring-primary resize-none rounded-2xl p-4 text-lg shadow-sm"
              placeholder="Tell us about your use case or specific questions..."
              data-testid="demo-request-message"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-16 group shadow-lg shadow-primary/20"
            data-testid="demo-request-submit"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Book My Demo
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
