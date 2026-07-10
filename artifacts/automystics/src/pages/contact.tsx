import React, { useState } from "react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useSiteSettings, formatAddressLines } from "@/hooks/use-site-settings";
import { useLocations, formatLocationAddress, LOCATION_TYPE_LABELS } from "@/hooks/use-locations";

export function Contact() {
  const { toast } = useToast();
  const site = useSiteSettings();
  const fallbackAddress = formatAddressLines(site);
  const locations = useLocations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "request_failed");
      }
      setIsSuccess(true);
      toast({
        title: "Message received",
        description: "Our team will get back to you within 24 hours.",
      });
    } catch (err) {
      toast({
        title: "Could not send your message",
        description: `Please try again in a moment, or email us directly at ${site.primaryEmail}.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative pt-40 pb-24">
      <SEO 
        title="Contact Automystics — Start Your AI Automation Project"
        description="Talk to Automystics Technologies Private Limited about custom software, AI automation, fintech platforms, or industrial systems. Free 20-minute consultation, signed NDA, and risk-free project scoping — based in Tamil Nadu, serving worldwide."
        keywords="contact Automystics, AI automation consultation, software development quote India, hire AI automation company, free MVP estimate, signed NDA software vendor, Tamil Nadu software company contact"
        canonical="/contact"
      />

      <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide mx-auto">
            <span className="text-xl leading-none -mt-1">●</span> GET IN TOUCH
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">Let's Build The <span className="text-primary">Future.</span></h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to automate your workflows and scale your business? Our engineering team is standing by.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Contact Form Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-card-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 relative overflow-hidden card-hover-effect">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              
              {isSuccess ? (
                <div className="text-center py-20 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Request Received</h3>
                  <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                    Thank you for reaching out. A technical specialist will contact you shortly to discuss your project.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full h-12 px-8 border-card-border text-foreground font-semibold bg-white hover:bg-muted">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <h3 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Send us a message</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-foreground font-semibold ml-1">First Name</Label>
                      <Input id="firstName" name="firstName" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="John" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-foreground font-semibold ml-1">Last Name</Label>
                      <Input id="lastName" name="lastName" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-foreground font-semibold ml-1">Work Email</Label>
                    <Input id="email" name="email" type="email" required className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="john@company.com" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-foreground font-semibold ml-1">Company</Label>
                    <Input id="company" name="company" className="bg-white border-card-border focus-visible:ring-primary h-14 rounded-2xl px-4 text-lg shadow-sm" placeholder="Acme Corp" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-foreground font-semibold ml-1">Project Details</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      required 
                      className="min-h-[160px] bg-white border-card-border focus-visible:ring-primary resize-none rounded-2xl p-4 text-lg shadow-sm" 
                      placeholder="Tell us about the software you need..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg h-16 group shadow-lg shadow-primary/20"
                    data-testid="contact-submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Send Message
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white border border-card-border shadow-xl shadow-black/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden card-hover-effect">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Need it faster?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Call us directly to speak with an engineering lead right now.
                </p>
                {site.primaryPhone && (
                  <a href={`tel:${site.primaryPhone.replace(/[^+\d]/g, "")}`} className="block">
                    <Button size="lg" variant="outline" className="w-full rounded-full h-14 bg-white border-primary text-primary font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-sm" data-testid="contact-phone-button">
                      <Phone className="w-5 h-5 mr-2" /> {site.primaryPhone}
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white border border-card-border shadow-lg rounded-[2.5rem] p-10 card-hover-effect">
              <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight">Email Us</h3>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground leading-relaxed flex flex-col gap-1">
                  {site.primaryEmail && (
                    <a href={`mailto:${site.primaryEmail}`} className="hover:text-primary transition-colors font-semibold" data-testid="contact-primary-email">{site.primaryEmail}</a>
                  )}
                  {site.supportEmail && site.supportEmail !== site.primaryEmail && (
                    <a href={`mailto:${site.supportEmail}`} className="hover:text-primary transition-colors" data-testid="contact-support-email">{site.supportEmail}</a>
                  )}
                </p>
              </div>
            </div>

            {locations.length > 0 ? (
              <div className="space-y-4" data-testid="contact-locations">
                <h3 className="text-xl font-bold text-foreground tracking-tight px-2">Our Offices</h3>
                {locations.map((loc) => {
                  const lines = formatLocationAddress(loc);
                  return (
                    <div key={loc.id} className="bg-white border border-card-border shadow-lg rounded-[2.5rem] p-8 card-hover-effect" data-testid={`location-${loc.id}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-foreground font-bold">{loc.label}</h4>
                            <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {LOCATION_TYPE_LABELS[loc.locationType] || loc.locationType}
                            </span>
                          </div>
                          {lines.length > 0 && (
                            <p className="text-muted-foreground leading-relaxed text-sm">
                              {lines.map((line, i) => (
                                <React.Fragment key={i}>
                                  {i > 0 && <br />}
                                  {line}
                                </React.Fragment>
                              ))}
                            </p>
                          )}
                          <div className="flex flex-col gap-1 mt-3 text-sm">
                            {loc.phone && (
                              <a href={`tel:${loc.phone.replace(/[^+\d]/g, "")}`} className="text-foreground/80 hover:text-primary inline-flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> {loc.phone}
                              </a>
                            )}
                            {loc.email && (
                              <a href={`mailto:${loc.email}`} className="text-foreground/80 hover:text-primary inline-flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> {loc.email}
                              </a>
                            )}
                            {loc.mapUrl && (
                              <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                                Get directions <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              fallbackAddress.length > 0 && (
                <div className="bg-white border border-card-border shadow-lg rounded-[2.5rem] p-10 card-hover-effect">
                  <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight">Office Location</h3>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed" data-testid="contact-address">
                      {fallbackAddress.map((line, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              )
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
