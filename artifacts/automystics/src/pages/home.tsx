import React from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell,
  Zap, Shield, Clock, ArrowUpRight, CheckCircle2, Factory, Database,
  Activity, Users, Sparkles, HandCoins, FileSignature, ShieldCheck,
  Package, HeartPulse, CalendarCheck, DollarSign
} from "lucide-react";
import { useProducts } from "@/hooks/use-products";

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
    <div className="relative">
      <SEO 
        title="Automystics Technologies Private Limited | An AI Automation Company"
        description="Automystics Technologies Private Limited is an AI Automation Company building enterprise-grade custom software, AI integrations, fintech platforms, college and school ERPs, SCADA monitoring, and CCTV AI surveillance — delivered with unprecedented speed."
        keywords="AI automation company, custom software development India, enterprise AI, SaaS development, MVP launch, fintech platform, voice AI, Kural AI, chit fund software, college management system, SCADA monitoring, CCTV AI"
        canonical="/"
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-28 overflow-hidden">
        {/* Deep near-black background with side glows */}
        <div className="absolute inset-0 bg-[#0A0612] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_50%,_rgba(8,145,178,0.35),_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_50%,_rgba(34,211,238,0.28),_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,_rgba(34,211,238,0.18),_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 dark-grid-pattern opacity-30 pointer-events-none" />

        {/* Animated orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-12 w-40 h-40 bg-primary/30 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-12 w-56 h-56 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Engineering The Future
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] mb-8 relative">
              We Build Software,<br/>
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-cyan-400 via-primary to-cyan-300 bg-clip-text text-transparent">Faster Than Anyone.</span>
                <svg className="absolute w-full -bottom-2 left-0" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q50 2 100 6 T198 5" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-3xl mx-auto leading-relaxed">
              Automystics delivers precision-engineered AI applications, financial platforms, and industrial systems with unprecedented speed.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/contact">
                <Button size="lg" data-testid="button-hero-start" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white font-semibold px-7 py-6 text-base shadow-2xl shadow-primary/40 group">
                  Start Your Project
                  <ArrowUpRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" data-testid="button-hero-explore" className="w-full sm:w-auto rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-semibold px-7 py-6 text-base backdrop-blur-md group">
                  Explore Products
                  <ArrowUpRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust strip - icon row */}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-4 text-white/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">Fastest Delivery</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">Enterprise Grade</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <FileSignature className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">Signed with NDA</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">100% Custom Built</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Dark Accent Band */}
      <section className="py-16 bg-[#0B1426] border-y border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { label: "Projects Delivered", value: "150+", icon: CheckCircle2 },
              { label: "Lines of Code", value: "2M+", icon: Code },
              { label: "System Uptime", value: "99.9%", icon: Activity },
              { label: "Enterprise Clients", value: "45+", icon: Users }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-primary font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid (Section A: light blue-gray) */}
      <section id="services" className="py-24 md:py-32 relative bg-[#D4DBE8]">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-30" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary border border-card-border text-sm font-bold mb-6 uppercase tracking-wide shadow-sm">
              <span className="text-xl leading-none -mt-1">●</span> OUR EXPERTISE
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">Enterprise solutions, <span className="text-primary">engineered to scale.</span></h2>
            <p className="text-xl text-muted-foreground">From high-frequency algorithmic trading to large-scale SCADA monitoring, our suite of AI-powered solutions drives industry transformation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={`/products#${product.id}`} className="block h-full group" data-testid={`product-tile-${product.id}`}>
                  <div className="relative h-full bg-[#334155] rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50">
                    {/* Top gradient accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    
                    {/* Decorative bg blob */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Index number watermark */}
                    <div className="absolute top-6 right-6 text-5xl font-extrabold text-white/5 group-hover:text-primary/30 transition-colors leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="relative p-7 flex flex-col h-full">
                      {/* Icon */}
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <product.icon className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                        {product.desc}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60 group-hover:text-primary transition-colors">
                          Explore
                        </span>
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <ArrowUpRight className="w-4 h-4 text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries (Section B: soft gradient panel) */}
      <section id="industries" className="py-24 md:py-32 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#E1E6EF] to-[#D4DBE8]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border text-primary text-sm font-bold mb-6 uppercase tracking-wide shadow-sm">
                <span className="text-xl leading-none -mt-1">●</span> SECTORS
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">Industries We <span className="text-primary">Power</span></h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                We deliver specialized intelligence and robust automation across key sectors, modernizing legacy workflows.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { name: "Financial Services", desc: "Secure fintech platforms", icon: Building2 },
                  { name: "Education", desc: "Scalable institution mgmt", icon: GraduationCap },
                  { name: "Industrial & Energy", desc: "Real-time SCADA control", icon: Factory },
                  { name: "Enterprise", desc: "Complex workflow automation", icon: Database }
                ].map((ind, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-card-border shadow-sm flex items-center justify-center">
                      <ind.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-bold mb-1">{ind.name}</h4>
                      <p className="text-sm text-muted-foreground">{ind.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] overflow-hidden border border-card-border aspect-square lg:aspect-[4/3] bg-white shadow-xl p-8 flex flex-col items-center justify-center group"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
              <div className="w-64 h-64 bg-primary/10 rounded-full blur-[80px] absolute group-hover:bg-primary/20 transition-colors duration-700" />
              <div className="relative z-10 w-full h-full border border-card-border rounded-2xl bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center p-6">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  {/* Trading metric */}
                  <div className="bg-white rounded-xl border border-card-border shadow-sm flex flex-col justify-between p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LineChart className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+24.7%</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground font-semibold">Trade Volume</div>
                      <div className="text-xl font-extrabold text-foreground tracking-tight">$4.2M</div>
                    </div>
                    <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                      <polyline points="0,18 15,14 30,16 45,10 60,12 75,6 90,8 100,4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  {/* Solar metric */}
                  <div className="bg-white rounded-xl border border-card-border shadow-sm flex flex-col justify-between p-4 mt-6 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground font-semibold">Power Output</div>
                      <div className="text-xl font-extrabold text-foreground tracking-tight">128.4 MW</div>
                    </div>
                    <div className="flex gap-1 items-end h-6">
                      {[40, 60, 35, 80, 55, 90, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/70 rounded-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  {/* Voice AI */}
                  <div className="bg-white rounded-xl border border-card-border shadow-sm flex flex-col justify-between p-4 -mt-6 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">98% ACC</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground font-semibold">Calls Handled</div>
                      <div className="text-xl font-extrabold text-foreground tracking-tight">12,847</div>
                    </div>
                    <div className="flex items-center gap-0.5 h-6">
                      {[3, 5, 8, 4, 9, 6, 11, 7, 5, 10, 4, 8, 6, 9].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary rounded-full" style={{ height: `${h * 8}%` }} />
                      ))}
                    </div>
                  </div>
                  {/* Fintech */}
                  <div className="bg-white rounded-xl border border-card-border shadow-sm flex flex-col justify-between p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">SECURE</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground font-semibold">Active Members</div>
                      <div className="text-xl font-extrabold text-foreground tracking-tight">45.6K</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[78%] bg-primary rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold text-foreground">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process / Why Choose Us (Section A: Off-white base) */}
      <section className="py-24 md:py-32 bg-transparent relative">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary border border-card-border text-sm font-bold mb-6 uppercase tracking-wide shadow-sm">
              <span className="text-xl leading-none -mt-1">●</span> WORKFLOW
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">Our <span className="text-primary">Process</span></h2>
            <p className="text-xl text-muted-foreground">A streamlined approach that guarantees delivery in record time without compromising quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Dashed connector line behind cards */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-px border-t-2 border-dashed border-primary/30" />

            {[
              { num: "01", title: "Discover", desc: "Deep dive into requirements and architecture planning.", icon: Database, time: "1-2 weeks", deliverables: ["Requirements doc", "Tech architecture", "Project roadmap"] },
              { num: "02", title: "Design", desc: "UI/UX wireframing and scalable database schema design.", icon: Code, time: "2-3 weeks", deliverables: ["Wireframes & UI", "Database schema", "API contracts"] },
              { num: "03", title: "Build", desc: "Rapid iterative development using advanced AI tooling.", icon: Zap, time: "4-8 weeks", deliverables: ["Working software", "Weekly demos", "QA & testing"] },
              { num: "04", title: "Deliver", desc: "Rigorous testing, deployment, and ongoing support.", icon: CheckCircle2, time: "Ongoing", deliverables: ["Production deploy", "Documentation", "24/7 support"] }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 group"
              >
                {/* Step number circle on top */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-white">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="relative bg-white border border-card-border shadow-md hover:shadow-2xl hover:shadow-primary/10 rounded-3xl pt-12 pb-7 px-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 h-full overflow-hidden">
                  {/* Watermark step number */}
                  <div className="absolute top-3 right-5 text-6xl font-extrabold text-primary/5 select-none leading-none">{step.num}</div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step {step.num}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.time}
                      </span>
                    </div>

                    <h4 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{step.desc}</p>

                    <div className="space-y-2 pt-4 border-t border-card-border">
                      {step.deliverables.map((d, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-foreground/80 font-medium">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
