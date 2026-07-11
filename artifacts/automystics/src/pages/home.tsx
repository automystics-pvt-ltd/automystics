import React from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell,
  Zap, Shield, Clock, ArrowUpRight, CheckCircle2, Factory, Database,
  Activity, Users, Sparkles, FileSignature, 
  Package, HeartPulse, CalendarCheck, DollarSign, ArrowRight, BrainCircuit,
  Workflow
} from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { DiagonalDivider, WaveDivider } from "@/components/dividers";

const HOME_ICON_MAP: Record<string, any> = {
  Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell,
  Zap, Database, Shield, HeartPulse, CalendarCheck, Activity, Users, DollarSign, Package,
};

const fallbackProducts = [
  { id: "chit-fund", title: "Chit Fund Management", desc: "Complete transparency for finance companies.", icon: Building2 },
  { id: "kalvicore", title: "KalviCore", desc: "Advanced College Management System.", icon: GraduationCap },
  { id: "kural-ai", title: "Kural AI", desc: "Next-gen intelligent voice automation.", icon: Mic },
  { id: "auto-algo", title: "Auto Algo Trading", desc: "High-frequency precision algorithmic trading.", icon: LineChart },
  { id: "scada", title: "SCADA Monitoring", desc: "Large-scale industrial solar monitoring.", icon: Sun },
  { id: "cctv", title: "CCTV AutoMonitoring", desc: "Real-time AI surveillance and anomaly detection.", icon: Camera },
  { id: "school-management", title: "School Management", desc: "End-to-end modern school administration.", icon: GraduationCap },
  { id: "fitro360", title: "Fitro360", desc: "All-in-one gym & fitness studio management.", icon: Dumbbell },
  { id: "custom", title: "Custom Software", desc: "Bespoke enterprise applications built fast.", icon: Code }
];

export function Home() {
  const { products: livePublicProducts } = useProducts();
  const products = livePublicProducts.length
    ? livePublicProducts.map((p) => ({
        id: p.key,
        title: p.title,
        desc: p.description ? p.description.slice(0, 80) : (p.category || ""),
        icon: HOME_ICON_MAP[p.icon || "Package"] || Package,
      }))
    : fallbackProducts;

  return (
    <div className="relative bg-background">
      <SEO 
        title="Automystics Technologies Private Limited | An AI Automation Company"
        description="Automystics Technologies Private Limited is an AI Automation Company building enterprise-grade custom software, AI integrations, fintech platforms, college and school ERPs, SCADA monitoring, and CCTV AI surveillance — delivered with unprecedented speed."
        keywords="AI automation company, custom software development India, enterprise AI, SaaS development, MVP launch, fintech platform, voice AI, Kural AI, chit fund software, college management system, SCADA monitoring, CCTV AI"
        canonical="/"
      />

      {/* Modern Gradient Hero */}
      <section className="relative flex flex-col justify-center pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Soft abstract blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 to-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-primary/20 shadow-sm text-primary text-xs font-bold mb-8 uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-primary" /> 
              <span>Next-Gen AI Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.1] mb-8 relative">
              Automate the Future,<br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Faster Than Anyone.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              We deliver precision-engineered AI applications, financial platforms, and industrial systems with unprecedented speed and scale.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-16 w-full sm:w-auto">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-9 py-7 text-lg shadow-[0_10px_30px_hsla(var(--primary),0.3)] transition-all duration-300 group">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-foreground font-bold px-9 py-7 text-lg backdrop-blur-sm transition-all duration-300 group">
                  Explore Solutions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider to next section */}
        <WaveDivider className="bottom-[-1px] text-card" fill="fill-card" />
      </section>

      {/* Grayscale Trust Strip */}
      <section className="py-12 bg-card relative z-20">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              { icon: Zap, text: "Fastest Delivery" },
              { icon: Shield, text: "Enterprise Grade" },
              { icon: FileSignature, text: "Signed with NDA" },
              { icon: Code, text: "100% Custom Built" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <item.icon className="w-6 h-6 text-foreground" />
                <span className="text-lg font-bold text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Badges with Dotted Connecting Lines */}
      <section className="py-24 md:py-32 bg-card relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Intelligence at <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Every Layer</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our automated pipeline transforms complex business requirements into production-ready AI systems.</p>
          </div>

          <div className="relative">
            {/* Dotted connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-primary/20 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { icon: BrainCircuit, title: "AI Analysis", desc: "We map your workflow using advanced models to find optimal automation points." },
                { icon: Workflow, title: "Process Design", desc: "Custom architecture tailored to your specific industry constraints." },
                { icon: Zap, title: "Rapid Deployment", desc: "Production-ready systems launched in weeks, not months." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center bg-card p-6 rounded-3xl"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 shadow-[0_0_30px_hsla(var(--primary),0.15)] border-4 border-background relative group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <feature.icon className="w-10 h-10 text-primary group-hover:text-white relative z-10 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Text + Illustration Rows */}
      <section className="py-24 md:py-32 bg-muted/30 relative">
        <DiagonalDivider className="top-[-1px] text-card" fill="fill-card" />
        <div className="container relative z-10 mx-auto px-4 max-w-6xl mt-12">
          
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background text-primary border border-primary/20 text-sm font-bold mb-6">
                <LineChart className="w-4 h-4" /> Fintech & Trading
              </div>
              <h2 className="text-4xl font-extrabold mb-6">High-frequency performance.</h2>
              <p className="text-xl text-muted-foreground mb-8">
                From precision algorithmic trading to secure chit fund management, our financial platforms process millions of transactions with zero downtime.
              </p>
              <ul className="space-y-4">
                {['Sub-millisecond execution times', 'Bank-grade encryption', 'Real-time analytics dashboards'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-[2rem] border border-background shadow-xl p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative z-10 bg-background rounded-2xl p-6 shadow-lg w-full max-w-sm border border-card-border">
                  <div className="flex justify-between items-center mb-6">
                    <div className="font-bold text-foreground">Live Trading Volume</div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">+24.7%</span>
                  </div>
                  <div className="text-4xl font-extrabold mb-4 text-foreground">$4.2M</div>
                  <svg viewBox="0 0 100 24" className="w-full h-12" preserveAspectRatio="none">
                    <polyline points="0,18 15,14 30,16 45,10 60,12 75,6 90,8 100,4" stroke="url(#grad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background text-secondary border border-secondary/20 text-sm font-bold mb-6">
                <Sun className="w-4 h-4" /> Industrial & SCADA
              </div>
              <h2 className="text-4xl font-extrabold mb-6">Monitor everything, everywhere.</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Large-scale industrial solar monitoring and CCTV AI surveillance systems that detect anomalies before they become critical failures.
              </p>
              <ul className="space-y-4">
                {['Predictive maintenance alerts', 'Multi-site aggregation', 'Computer vision anomaly detection'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-bl from-secondary/10 to-primary/5 rounded-[2rem] border border-background shadow-xl p-8 flex flex-col gap-4 justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                <div className="relative z-10 bg-background rounded-2xl p-4 shadow-lg border border-card-border flex items-center gap-4 translate-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center"><Camera className="w-6 h-6 text-secondary" /></div>
                  <div>
                    <div className="font-bold text-foreground">Zone A Camera 04</div>
                    <div className="text-sm text-emerald-600 font-medium">Status Normal</div>
                  </div>
                </div>
                <div className="relative z-10 bg-background rounded-2xl p-4 shadow-lg border border-card-border flex items-center gap-4 -translate-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><Activity className="w-6 h-6 text-primary" /></div>
                  <div>
                    <div className="font-bold text-foreground">Grid Inverter B</div>
                    <div className="text-sm text-primary font-medium">Efficiency Drop Detected</div>
                  </div>
                </div>
                <div className="relative z-10 bg-background rounded-2xl p-4 shadow-lg border border-card-border flex items-center gap-4 translate-x-8">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center"><Sun className="w-6 h-6 text-secondary" /></div>
                  <div>
                    <div className="font-bold text-foreground">Total Output</div>
                    <div className="text-sm text-muted-foreground font-medium">128.4 MW</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
        <WaveDivider className="bottom-[-1px] text-background" fill="fill-background" flip />
      </section>

      {/* Bold CTA Band */}
      <section className="py-32 relative bg-background overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_hsla(var(--primary),0.3)] relative overflow-hidden">
            {/* Decorative background for CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to scale your intelligence?</h2>
              <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                Join the enterprise leaders who trust Automystics to build faster, smarter, and more securely.
              </p>

              <div className="bg-background p-2 rounded-full flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
                <div className="flex-1 flex items-center px-6">
                  <span className="text-muted-foreground font-medium whitespace-nowrap">How can we help you build?</span>
                </div>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}