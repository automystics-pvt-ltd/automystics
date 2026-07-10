import React from "react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell, CheckCircle2, ArrowUpRight, TrendingUp, Users, DollarSign, Activity, AlertCircle, Zap, Database, Shield, HeartPulse, CalendarCheck, Package, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useProducts, type PublicProduct } from "@/hooks/use-products";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell,
  Zap, Database, Shield, HeartPulse, CalendarCheck, Activity, Users,
  DollarSign, TrendingUp, AlertCircle, Package,
};

function iconFor(name: string | null | undefined): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Package;
}

const fallbackProducts = [
  {
    id: "chit-fund",
    title: "Chit Fund Management",
    category: "Financial Technology",
    description: "A secure, transparent, and fully compliant digital platform designed specifically for finance companies to manage chit funds effortlessly.",
    icon: Building2,
    features: ["Automated dividend calculation", "Member KYC & tracking", "Integrated payment gateways", "Regulatory compliance reporting"]
  },
  {
    id: "school-management",
    title: "School Management System",
    category: "EdTech",
    description: "An end-to-end administration and academic management hub that connects educators, students, and parents in one seamless ecosystem.",
    icon: GraduationCap,
    features: ["Attendance & timetable management", "Fee collection & invoicing", "Examination & grading modules", "Parent-teacher communication portal"]
  },
  {
    id: "kalvicore",
    title: "KalviCore",
    category: "EdTech",
    description: "Our flagship College Management System built for the complex workflows of modern higher education institutions.",
    icon: GraduationCap,
    features: ["University affiliation compliance", "Placement & alumni tracking", "Course & faculty management", "Hostel & transport administration"]
  },
  {
    id: "kural-ai",
    title: "Kural AI",
    category: "Artificial Intelligence",
    description: "Next-generation AI voice automation that transforms how businesses handle customer interactions, support, and internal operations.",
    icon: Mic,
    features: ["Natural language understanding", "Multi-language voice synthesis", "Workflow trigger integration", "Sentiment analysis"]
  },
  {
    id: "auto-algo",
    title: "Auto Algo Trading",
    category: "Financial Technology",
    description: "A high-frequency algorithmic trading platform that executes complex quantitative strategies with sub-millisecond latency.",
    icon: LineChart,
    features: ["Custom strategy builder", "Real-time market data ingestion", "Risk management controls", "Backtesting environment"]
  },
  {
    id: "scada",
    title: "SCADA Monitoring",
    category: "Industrial IoT",
    description: "Enterprise-grade SCADA systems optimized for large-scale solar power plants, providing complete operational visibility and control.",
    icon: Sun,
    features: ["Real-time telemetry", "Predictive maintenance alerts", "Inverter performance tracking", "Historical data analytics"]
  },
  {
    id: "cctv",
    title: "CCTV AutoMonitoring AI",
    category: "Computer Vision",
    description: "Intelligent video analytics that transform passive surveillance cameras into active security and operational monitoring systems.",
    icon: Camera,
    features: ["Intrusion detection", "Safety gear compliance", "Object tracking", "Automated incident alerts"]
  },
  {
    id: "fitro360",
    title: "Fitro360 — Gym Management System",
    category: "Health & Fitness",
    description: "An all-in-one operating system for modern gyms, fitness studios, and wellness chains. Fitro360 unifies member onboarding, biometric attendance, billing, trainer scheduling, diet & workout plans, and franchise analytics in a single fast platform.",
    icon: Dumbbell,
    features: ["Member CRM & onboarding", "Biometric & RFID attendance", "Automated billing & dunning", "Trainer scheduling & PT plans", "Diet, workout & progress tracking", "Multi-branch franchise analytics"]
  },
  {
    id: "custom",
    title: "Custom Software Development",
    category: "Enterprise Solutions",
    description: "Bespoke software architecture and development for complex business requirements, delivered with our signature high-speed methodology.",
    icon: Code,
    features: ["Cloud-native architecture", "Legacy system modernization", "API design & integration", "Scalable microservices"]
  }
];

function StatBlock({ label, value, accent, sub }: { label: string; value: string; accent?: string; sub?: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{label}</div>
      <div className="text-xl font-extrabold text-white mt-1 tracking-tight">{value}</div>
      {sub && <div className={`text-[10px] font-bold mt-0.5 ${accent || "text-primary"}`}>{sub}</div>}
    </div>
  );
}

function MiniBars({ data, color = "bg-primary" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div key={i} className={`flex-1 ${color} rounded-sm opacity-80`} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function MiniLine({ points, height = 40 }: { points: number[]; height?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  const area = `${path} L100,${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ar)" />
      <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
    </svg>
  );
}

function ProductPreview({ id }: { id: string }) {
  switch (id) {
    case "chit-fund":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Total AUM" value="₹128.4 Cr" sub="↑ 18.4% YoY" />
          <StatBlock label="Active Members" value="45,672" sub="↑ 1,204 this mo" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Monthly Collection</div>
              <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">98.7% on time</div>
            </div>
            <MiniLine points={[42, 48, 45, 58, 62, 71, 68, 79, 84, 92, 88, 96]} />
          </div>
          <StatBlock label="Compliance" value="100%" sub="RBI · KYC · AML" />
          <StatBlock label="Schemes" value="64" sub="12 maturing" />
        </div>
      );
    case "school-management":
    case "kalvicore":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Students" value={id === "kalvicore" ? "12,840" : "3,247"} sub="↑ 8% enrolled" />
          <StatBlock label="Attendance" value="94.2%" sub="Today" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Fee Collection (12mo)</div>
              <div className="text-[10px] font-bold text-primary">₹4.8 Cr</div>
            </div>
            <MiniBars data={[55, 78, 62, 88, 71, 94, 82, 76, 91, 84, 96, 89]} />
          </div>
          <StatBlock label="Faculty" value={id === "kalvicore" ? "428" : "186"} sub="Active staff" />
          <StatBlock label="Pass Rate" value="96.4%" sub="Last semester" />
        </div>
      );
    case "kural-ai":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Calls Handled" value="284,120" sub="↑ 32% wk" />
          <StatBlock label="Accuracy" value="98.4%" sub="Intent match" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Live Voice Activity</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </div>
            </div>
            <div className="flex items-center gap-0.5 h-10">
              {[3, 6, 9, 4, 11, 7, 14, 9, 5, 12, 8, 15, 10, 6, 13, 9, 7, 11, 4, 8, 12, 6, 9, 14, 8, 5, 10].map((h, i) => (
                <div key={i} className="flex-1 bg-primary rounded-full" style={{ height: `${h * 6}%` }} />
              ))}
            </div>
          </div>
          <StatBlock label="Languages" value="14" sub="Multi-lingual" />
          <StatBlock label="Avg Resolve" value="42s" sub="↓ 68% vs human" />
        </div>
      );
    case "auto-algo":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="P&L Today" value="+$48,290" sub="↑ 4.7%" accent="text-emerald-400" />
          <StatBlock label="Win Rate" value="71.2%" sub="Last 30d" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Equity Curve</div>
              <div className="text-[10px] font-bold text-emerald-400">Sharpe 2.84</div>
            </div>
            <MiniLine points={[20, 28, 24, 35, 42, 38, 51, 58, 54, 67, 74, 82, 78, 89]} />
          </div>
          <StatBlock label="Latency" value="0.8ms" sub="Order to fill" />
          <StatBlock label="Strategies" value="32" sub="14 live" />
        </div>
      );
    case "scada":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Power Output" value="128.4 MW" sub="Real-time" accent="text-emerald-400" />
          <StatBlock label="Plant Uptime" value="99.96%" sub="Last 30d" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Generation 24h</div>
              <div className="text-[10px] font-bold text-primary">2.84 GWh</div>
            </div>
            <MiniBars data={[5, 12, 28, 48, 72, 92, 96, 88, 76, 58, 32, 12]} />
          </div>
          <StatBlock label="Inverters" value="412" sub="408 healthy" />
          <StatBlock label="Alerts" value="3" sub="Predictive" accent="text-amber-400" />
        </div>
      );
    case "cctv":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Cameras" value="1,284" sub="All online" accent="text-emerald-400" />
          <StatBlock label="Detections" value="48.2K" sub="Last 24h" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Event Timeline</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> 2 ALERTS
              </div>
            </div>
            <MiniLine points={[12, 18, 14, 28, 22, 34, 42, 38, 52, 48, 64, 58]} />
          </div>
          <StatBlock label="PPE Compliance" value="97.8%" sub="Site avg" />
          <StatBlock label="False Positives" value="0.4%" sub="Industry low" />
        </div>
      );
    case "fitro360":
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Active Members" value="48,210" sub="↑ 22.4% MoM" />
          <StatBlock label="Monthly Revenue" value="₹2.84 Cr" sub="↑ 31% YoY" accent="text-emerald-400" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Daily Check-ins (last 12 days)</div>
              <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1"><HeartPulse className="w-3 h-3" /> 6,142 today</div>
            </div>
            <MiniBars data={[3820, 4210, 4580, 5120, 4920, 5340, 5680, 5910, 6020, 5780, 6240, 6142]} />
          </div>
          <StatBlock label="Retention 90d" value="86.3%" sub="Industry: 64%" accent="text-emerald-400" />
          <StatBlock label="PT Sessions" value="12,486" sub="This month" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold flex items-center gap-1.5"><CalendarCheck className="w-3 h-3" /> Class Occupancy</div>
              <div className="text-[10px] font-bold text-primary">94% avg</div>
            </div>
            <MiniLine points={[68, 72, 78, 82, 79, 86, 88, 92, 95, 91, 96, 94]} />
          </div>
          <StatBlock label="Branches Live" value="38" sub="14 cities" />
          <StatBlock label="Trainer Rating" value="4.82★" sub="Avg across staff" accent="text-amber-400" />
        </div>
      );
    case "custom":
    default:
      return (
        <div className="w-full grid grid-cols-2 gap-3">
          <StatBlock label="Projects Live" value="150+" sub="Enterprise" />
          <StatBlock label="Avg Delivery" value="6.2 wk" sub="↓ 60% vs market" accent="text-emerald-400" />
          <div className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Velocity (sprints)</div>
              <div className="text-[10px] font-bold text-primary">+38% QoQ</div>
            </div>
            <MiniBars data={[42, 58, 51, 68, 74, 82, 78, 88, 92, 86, 95, 98]} />
          </div>
          <StatBlock label="Uptime SLA" value="99.99%" sub="Production" />
          <StatBlock label="Tech Stack" value="40+" sub="Frameworks" />
        </div>
      );
  }
}

export function Products() {
  const { products: live, loading } = useProducts();
  const products: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    icon: LucideIcon;
    features: string[];
  }> = (live.length > 0
    ? live.map((p: PublicProduct) => ({
        id: p.key,
        title: p.title,
        category: p.category ?? "",
        description: p.description ?? "",
        icon: iconFor(p.icon),
        features: p.features ?? [],
      }))
    : fallbackProducts.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        icon: p.icon,
        features: p.features,
      })));

  return (
    <div className="bg-transparent relative">
      <SEO 
        title="Products — AI & Automation Platforms by Automystics"
        description="Explore Automystics Technologies Private Limited's suite of 8 enterprise products: Chit Fund Management, KalviCore college ERP, Kural AI voice automation, Auto Algo Trading, SCADA Solar Monitoring, CCTV AutoMonitoring, School Management, and bespoke custom software."
        keywords="Automystics products, chit fund management software, KalviCore college ERP, Kural AI voice automation, auto algo trading platform, SCADA solar monitoring, CCTV AI monitoring, school management software, custom enterprise software"
        canonical="/products"
      />

      <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="pt-40 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide mx-auto">
              <span className="text-xl leading-none -mt-1">●</span> OUR PRODUCTS
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">Our <span className="text-primary">Solutions</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Powerful, scalable, and intelligent platforms designed to automate complex workflows across industries.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 relative z-10 bg-[#D4DBE8]">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-30" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {loading && live.length === 0 && (
            <div className="text-center text-muted-foreground py-10">Loading products…</div>
          )}
          {!loading && products.length === 0 && (
            <div className="text-center text-muted-foreground py-10">No products to show yet.</div>
          )}
          <div className="space-y-32 md:space-y-48">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                id={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center scroll-mt-32`}
              >
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold tracking-wide uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {product.category}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0">
                      <product.icon className="w-8 h-8 text-primary" />
                    </div>
                    {product.title}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {product.features.map((feature, i) => (
                      <div key={i} className="group/feat relative flex items-start gap-3 p-4 rounded-2xl bg-white border border-card-border shadow-sm overflow-hidden cursor-default transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 hover:bg-gradient-to-br hover:from-white hover:to-primary/5">
                        <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-cyan-400/0 opacity-0 group-hover/feat:opacity-100 transition-opacity duration-500" />
                        <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 group-hover/feat:bg-primary group-hover/feat:scale-110 group-hover/feat:rotate-6 transition-all duration-300 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-primary group-hover/feat:text-white transition-colors duration-300" />
                        </span>
                        <span className="relative text-sm font-medium text-foreground group-hover/feat:text-primary transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/contact">
                    <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 group">
                      Request Demo <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                <div className="flex-1 w-full">
                  <Card className="bg-gradient-to-br from-[#0B1426] via-[#11203A] to-[#0B1426] border-0 shadow-2xl shadow-primary/20 rounded-[2.5rem] aspect-[4/3] flex items-center justify-center overflow-hidden relative group p-4 transition-all duration-500">
                    <div className="absolute inset-0 dark-grid-pattern opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/30 rounded-full blur-[100px] group-hover:bg-primary/50 transition-colors duration-500" />
                    <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80">
                      Live Preview
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: "0.6s" }} />
                    </div>
                    <div className="relative z-10 w-full px-5 pt-12 pb-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/40">
                          <product.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm tracking-tight leading-tight">{product.title}</div>
                          <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Dashboard</div>
                        </div>
                      </div>
                      <ProductPreview id={product.id} />
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
