import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { Users, Workflow, Briefcase, BookOpen, FileText, HeartHandshake, CheckCircle2, Cloud, Shield, Cpu, GraduationCap, Building, Sparkles, TrendingUp, Award, Globe, ArrowUpRight, HandCoins, FileSignature, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { StatBlock, MiniBars, MiniLine, PreviewCard } from "@/components/dashboard-preview";

export function Company() {
  return (
    <div className="bg-transparent relative">
      <SEO 
        title="Company — About Automystics Technologies Private Limited"
        description="Founded 2019 in Tamil Nadu, Automystics Technologies Private Limited is an ISO 27001-certified AI Automation Company with 84+ engineers, 142+ enterprise clients, and operations across 14 countries. Learn about our mission, process, careers, and partners."
        keywords="Automystics company, about Automystics, Automystics Technologies Private Limited, AI automation company Tamil Nadu, software engineering careers India, ISO 27001 software vendor, Automystics process, Automystics partners"
        canonical="/company"
      />

      {/* Deep near-black hero background with side glows */}
      <div className="absolute top-0 left-0 right-0 h-[820px] bg-[#0A0612] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[820px] bg-[radial-gradient(ellipse_80%_60%_at_0%_50%,_rgba(8,145,178,0.35),_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[820px] bg-[radial-gradient(ellipse_80%_60%_at_100%_50%,_rgba(34,211,238,0.28),_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[820px] bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,_rgba(34,211,238,0.18),_transparent_70%)] pointer-events-none" />

      <div className="pt-36 pb-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 dark-grid-pattern opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl pt-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-[0.2em] mx-auto backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> THE COMPANY <span className="w-1 h-1 rounded-full bg-primary" /> Est. 2019
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              An AI Automation Company<br />
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-cyan-400 via-primary to-cyan-300 bg-clip-text text-transparent">for SaaS, Startups, and SMEs</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q50 2 100 6 T198 5" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
              Accelerate your roadmap with custom AI-integrated web and mobile ecosystems. We bridge the gap between initial concept and global scale, delivering rapid MVP launches and robust, enterprise-grade SaaS architectures for the next generation of business.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link href="/contact">
                <Button size="lg" data-testid="button-hero-consult" className="rounded-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white font-semibold px-7 py-6 text-base shadow-2xl shadow-primary/40 group">
                  Book 20-min Consult
                  <ArrowUpRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/company#case-studies">
                <Button size="lg" variant="outline" data-testid="button-hero-portfolio" className="rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 text-white font-semibold px-7 py-6 text-base backdrop-blur-md group">
                  View Our Work Portfolios
                  <ArrowUpRight className="w-5 h-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-12 text-white/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <HandCoins className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">Free Estimate</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <FileSignature className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">Signed with NDA</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/10 border border-primary/30 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">100% Risk-Free</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 relative z-10 bg-[#D4DBE8]">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-30" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            
            {/* About */}
            <motion.div id="about" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center scroll-mt-32">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> About Us
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><Users className="w-8 h-8 text-primary" /></div>
                  Our Mission
                </h2>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  Founded in Tamil Nadu, Automystics Technologies Private Limited emerged from a simple premise: enterprise software is too slow to build and too hard to maintain. We assembled a team of elite engineers dedicated to changing that paradigm through AI-assisted development and rigorous architectural standards.
                </p>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  Today, we power core operations for financial institutions, large-scale educational trusts, and industrial facilities, delivering military-grade software at startup speed.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {["Tamil-Nadu based engineering hub", "Elite, hand-picked technical team", "Obsession with code quality", "Focus on measurable ROI"].map((feature, i) => (
                    <div key={i} className="group/feat relative flex items-start gap-3 p-4 rounded-2xl bg-white border border-card-border shadow-sm overflow-hidden cursor-default transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 hover:bg-gradient-to-br hover:from-white hover:to-primary/5">
                      <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-cyan-400/0 opacity-0 group-hover/feat:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 group-hover/feat:bg-primary group-hover/feat:scale-110 group-hover/feat:rotate-6 transition-all duration-300 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary group-hover/feat:text-white transition-colors duration-300" />
                      </span>
                      <span className="relative text-sm font-medium text-foreground group-hover/feat:text-primary transition-colors duration-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <PreviewCard title="Automystics Technologies Pvt Ltd" kicker="Company Snapshot" icon={Building}>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBlock label="Founded" value="2019" sub="Tamil Nadu" />
                    <StatBlock label="Engineers" value="84+" sub="Hand-picked" accent="text-emerald-400" />
                    <StatBlock label="Clients" value="142" sub="Enterprise" />
                    <StatBlock label="Retention" value="98%" sub="Multi-year" accent="text-emerald-400" />
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Annual Growth</div>
                      <MiniLine points={[20, 32, 48, 62, 78, 96, 118, 142, 168, 192, 224, 268]} />
                    </div>
                  </div>
                </PreviewCard>
              </div>
            </motion.div>

            {/* Process */}
            <motion.div id="process" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center scroll-mt-32">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Workflow
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><Workflow className="w-8 h-8 text-primary" /></div>
                  Our Process
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  We don't guess. We execute a rigorous, battle-tested 6-step methodology that ensures every line of code serves a business purpose and scales gracefully.
                </p>
                <div className="space-y-4">
                  {[
                    "1. Discovery & Architecture: Mapping the domain",
                    "2. UI/UX Prototyping: Validating user flows",
                    "3. Core Infrastructure: Setting up secure clouds",
                    "4. Rapid Development: AI-accelerated coding",
                    "5. Penetration & Load Testing: Ensuring resilience",
                    "6. Deployment & Handover: Smooth operational transition"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-card-border shadow-sm">
                      <span className="text-sm font-semibold text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <PreviewCard title="Delivery Pipeline" kicker="Process Metrics" icon={Workflow}>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBlock label="Avg Delivery" value="6.2 wk" sub="↓ 60% faster" accent="text-emerald-400" />
                    <StatBlock label="On-time" value="96.4%" sub="Sprint commits" />
                    <StatBlock label="Code Review" value="100%" sub="Coverage" />
                    <StatBlock label="Test Coverage" value="92%" sub="Avg across repos" accent="text-emerald-400" />
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Sprint Velocity (story pts)</div>
                      <MiniBars data={[42, 51, 58, 64, 72, 78, 84, 91, 88, 96, 102, 118]} />
                    </div>
                  </div>
                </PreviewCard>
              </div>
            </motion.div>

            {/* Careers */}
            <motion.div id="careers" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center scroll-mt-32">
              <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Join Us
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><Briefcase className="w-8 h-8 text-primary" /></div>
                  Careers
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  We hire missionaries, not mercenaries. We are always looking for deeply technical, highly autonomous individuals who want to build software that matters. We offer remote flexibility, rigorous mentorship, and the opportunity to work on complex, high-stakes challenges.
                </p>
                <div className="grid gap-4">
                  {["Full-stack Engineer (React/Node)", "Machine Learning Engineer", "DevOps & Cloud Architect", "Product Designer (UI/UX)"].map((role, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-card-border shadow-sm hover:border-primary transition-colors cursor-pointer group">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{role}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">View Role</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <PreviewCard title="Talent Pipeline" kicker="Hiring Snapshot" icon={Briefcase}>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBlock label="Open Roles" value="12" sub="Across teams" accent="text-emerald-400" />
                    <StatBlock label="Applicants" value="2,840" sub="This quarter" />
                    <StatBlock label="Avg Tenure" value="3.4 yrs" sub="Engineering" />
                    <StatBlock label="Remote" value="68%" sub="Distributed" accent="text-emerald-400" />
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Headcount Growth</div>
                      <MiniBars data={[12, 18, 22, 28, 34, 42, 48, 56, 64, 72, 78, 84]} />
                    </div>
                  </div>
                </PreviewCard>
              </div>
            </motion.div>

            {/* Case Studies */}
            <motion.div id="case-studies" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="scroll-mt-32">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Success Stories
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex justify-center items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><BookOpen className="w-8 h-8 text-primary" /></div>
                  Case Studies
                </h2>
                <p className="text-xl text-muted-foreground">See how we've transformed operations for our enterprise partners.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { tag: "FINTECH", metric: "₹50 Cr", metricLabel: "Assets Digitized", title: "Digitizing a $50M Chit Fund", desc: "How we replaced legacy ledgers with a secure, real-time management platform, reducing audit time by 90%." },
                  { tag: "ENERGY", metric: "500 MW", metricLabel: "Plant Monitored", title: "SCADA for 500MW Solar Plant", desc: "Implementing real-time IoT monitoring that improved energy yield optimization and predictive maintenance." },
                  { tag: "EDUCATION", metric: "100K+", metricLabel: "Students Served", title: "Connecting 50+ School Districts", desc: "Deploying KalviCore to unify administration across a massive educational network, serving 100k+ students." }
                ].map((study, i) => (
                  <Card key={i} className="relative overflow-hidden bg-gradient-to-br from-[#0B1426] via-[#11203A] to-[#0B1426] border-0 shadow-xl shadow-primary/20 rounded-3xl p-8 hover:-translate-y-2 transition-transform cursor-pointer group">
                    <div className="absolute inset-0 dark-grid-pattern opacity-40" />
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80">{study.tag}</span>
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="mb-6">
                        <div className="text-4xl font-extrabold text-white tracking-tight">{study.metric}</div>
                        <div className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">{study.metricLabel}</div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors leading-snug">{study.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{study.desc}</p>
                      <div className="mt-6 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">Read Study <span className="group-hover:translate-x-1 transition-transform">&rarr;</span></div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Blog */}
            <motion.div id="blog" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="scroll-mt-32">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Insights
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex justify-center items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><FileText className="w-8 h-8 text-primary" /></div>
                  Our Blog
                </h2>
                <p className="text-xl text-muted-foreground">Engineering insights, architectural patterns, and thoughts on the future of AI.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { tag: "AI & ML", readTime: "8 min", title: "Why Voice AI is Changing Customer Service", date: "Oct 12, 2023", excerpt: "Conversational AI is replacing call centers — here's how to deploy it without losing the human touch." },
                  { tag: "ARCHITECTURE", readTime: "12 min", title: "Microservices vs Monoliths in 2024", date: "Nov 05, 2023", excerpt: "The pendulum has swung. We break down when each pattern wins and the hidden costs nobody talks about." },
                  { tag: "ENGINEERING", readTime: "6 min", title: "The True Cost of Legacy Code Maintenance", date: "Dec 01, 2023", excerpt: "An honest look at the compounding tax of technical debt and the real ROI of modernization." }
                ].map((post, i) => (
                  <Card key={i} className="relative overflow-hidden bg-white border border-card-border shadow-md rounded-3xl hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group">
                    <div className="h-32 bg-gradient-to-br from-[#0B1426] via-[#11203A] to-primary relative overflow-hidden">
                      <div className="absolute inset-0 dark-grid-pattern opacity-50" />
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/40 rounded-full blur-2xl" />
                      <div className="relative z-10 p-6 flex items-start justify-between h-full">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">{post.tag}</span>
                        <FileText className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span>{post.readTime} read</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                      <div className="mt-5 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">Read Post <span className="group-hover:translate-x-1 transition-transform">&rarr;</span></div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Partners */}
            <motion.div id="partners" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="scroll-mt-32">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Ecosystem
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex justify-center items-center gap-4 tracking-tight">
                  <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0"><HeartHandshake className="w-8 h-8 text-primary" /></div>
                  Our Partners
                </h2>
                <p className="text-xl text-muted-foreground">We collaborate with industry leaders to provide robust, end-to-end solutions.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Cloud Infrastructure", icon: Cloud, count: "AWS · Azure · GCP", color: "from-blue-500/20 to-cyan-500/20" },
                  { name: "Security Auditing", icon: Shield, count: "ISO 27001 · SOC 2", color: "from-emerald-500/20 to-teal-500/20" },
                  { name: "Hardware & IoT", icon: Cpu, count: "Sensors · Edge devices", color: "from-amber-500/20 to-orange-500/20" },
                  { name: "Education Boards", icon: GraduationCap, count: "CBSE · State boards", color: "from-violet-500/20 to-purple-500/20" }
                ].map((partner, i) => (
                  <div key={i} className="relative overflow-hidden flex flex-col items-center justify-center p-8 bg-white border border-card-border rounded-3xl shadow-sm text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-card-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <partner.icon className="w-7 h-7 text-primary" />
                      </div>
                      <span className="font-bold text-foreground text-sm mb-1">{partner.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{partner.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}