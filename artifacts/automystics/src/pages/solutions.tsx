import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { Workflow, Mic, LineChart, Camera, Sun, GraduationCap, Building2, Database, CheckCircle2 } from "lucide-react";
import { StatBlock, MiniBars, MiniLine, PreviewCard } from "@/components/dashboard-preview";

const solutions = [
  {
    id: "enterprise-automation",
    title: "Enterprise Automation",
    icon: Workflow,
    desc: "Streamline complex business processes across departments with our enterprise automation solutions. We map out manual workflows and replace them with intelligent, automated systems that reduce errors, save thousands of human hours, and enforce standardized operational protocols.",
    features: ["End-to-end workflow mapping", "Robotic Process Automation (RPA)", "ERP/CRM deep integration", "Custom approval routing"]
  },
  {
    id: "ai-voice",
    title: "AI Voice Agents",
    icon: Mic,
    desc: "Deploy sophisticated conversational interfaces that handle customer support, outbound dialing, and internal inquiries. Our voice AI utilizes state-of-the-art natural language processing to understand intent, manage complex dialog flows, and trigger backend actions seamlessly.",
    features: ["Natural language understanding", "Multi-turn dialog management", "Human handoff protocols", "Voice synthesis & cloning"]
  },
  {
    id: "algo-trading",
    title: "Algorithmic Trading",
    icon: LineChart,
    desc: "Execute quantitative financial strategies with absolute precision. Our algorithmic trading platforms are engineered for high frequency and low latency, capable of ingesting massive market data streams, running complex mathematical models, and routing orders in sub-milliseconds.",
    features: ["Sub-millisecond execution", "Real-time market data ingestion", "Strategy backtesting engine", "Automated risk management"]
  },
  {
    id: "surveillance",
    title: "Surveillance Intelligence",
    icon: Camera,
    desc: "Transform passive video feeds into active monitoring systems. We implement advanced computer vision models that analyze CCTV streams in real-time to detect unauthorized access, ensure safety compliance, and automatically flag operational anomalies across large facilities.",
    features: ["Real-time anomaly detection", "Facial & object recognition", "Safety gear compliance checks", "Automated incident reporting"]
  },
  {
    id: "solar-monitoring",
    title: "Solar Plant Monitoring",
    icon: Sun,
    desc: "Maximize renewable energy yield with comprehensive IoT data collection. Our solar monitoring solutions aggregate data from thousands of panels and inverters to provide granular performance tracking, predictive maintenance alerts, and automated degradation analysis.",
    features: ["Inverter telemetry aggregation", "Predictive maintenance AI", "Weather pattern correlation", "Energy yield optimization"]
  },
  {
    id: "academic",
    title: "Academic Management",
    icon: GraduationCap,
    desc: "Manage the entire student lifecycle with integrated academic platforms. From admission processing and course enrollment to examination grading and alumni relations, we build centralized hubs that eliminate administrative silos in modern educational institutions.",
    features: ["Automated enrollment flows", "Curriculum & syllabus management", "Digital examination portals", "Parent-teacher communication"]
  },
  {
    id: "fintech-platform",
    title: "Fintech Platforms",
    icon: Building2,
    desc: "Build compliant, high-performance financial platforms — from chit fund operations and digital lending to payment orchestration. Our fintech systems handle KYC, ledgering, settlement, and reconciliation with bank-grade security and full audit trails.",
    features: ["Bank-grade encryption & audit logs", "Automated KYC & AML workflows", "Double-entry ledger engine", "Payment gateway orchestration"]
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence",
    icon: Database,
    desc: "Turn raw operational data into decision-ready insight. We architect end-to-end data platforms — ingestion pipelines, warehouses, real-time dashboards and ML models — so leadership teams can act on what is happening across the business right now.",
    features: ["Real-time ETL pipelines", "Cloud data warehousing", "Executive BI dashboards", "Predictive ML models"]
  }
];

function SolutionPreview({ id }: { id: string }) {
  switch (id) {
    case "enterprise-automation":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Workflows" value="284" sub="Automated" accent="text-emerald-400" />
          <StatBlock label="Hours Saved" value="48K/mo" sub="Across teams" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Process Throughput</div>
            <MiniBars data={[42, 58, 64, 78, 82, 91, 88, 96, 102, 118, 124, 138]} />
          </div>
        </div>
      );
    case "ai-voice":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Calls / day" value="48,200" sub="Peak capacity" accent="text-emerald-400" />
          <StatBlock label="Intent Acc" value="96.4%" sub="Multi-language" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Conversation Volume</div>
            <MiniLine points={[120, 168, 192, 224, 268, 312, 348, 396, 432, 478, 524, 580]} />
          </div>
        </div>
      );
    case "algo-trading":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Latency" value="0.8 ms" sub="Order routing" accent="text-emerald-400" />
          <StatBlock label="Strategies" value="142" sub="Live" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Cumulative P&L</div>
            <MiniLine points={[10, 22, 32, 28, 48, 64, 72, 88, 98, 112, 128, 148]} />
          </div>
        </div>
      );
    case "surveillance":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Cameras" value="2,840" sub="AI-monitored" accent="text-emerald-400" />
          <StatBlock label="Detections" value="1,284" sub="Last 24h" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Anomaly Events / hr</div>
            <MiniBars data={[12, 18, 14, 22, 28, 16, 32, 24, 38, 28, 42, 36]} />
          </div>
        </div>
      );
    case "solar-monitoring":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Power Output" value="128.4 MW" sub="Real-time" accent="text-emerald-400" />
          <StatBlock label="Inverters" value="1,284" sub="Online" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Daily Generation Curve</div>
            <MiniLine points={[5, 14, 32, 54, 78, 94, 98, 92, 78, 56, 32, 12]} />
          </div>
        </div>
      );
    case "academic":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Students" value="1.8 L+" sub="Lifecycle managed" accent="text-emerald-400" />
          <StatBlock label="Faculty" value="8,400" sub="Active users" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Term Enrollment</div>
            <MiniBars data={[48, 56, 64, 72, 78, 84, 92, 98, 104, 112, 124, 138]} />
          </div>
        </div>
      );
    case "fintech-platform":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Settled Vol" value="₹284 Cr" sub="This month" accent="text-emerald-400" />
          <StatBlock label="KYC Auto" value="98.2%" sub="Pass rate" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Daily Disbursals</div>
            <MiniLine points={[180, 220, 264, 298, 324, 368, 412, 446, 488, 524, 572, 624]} />
          </div>
        </div>
      );
    case "data-intelligence":
    default:
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Pipelines" value="148" sub="Production" accent="text-emerald-400" />
          <StatBlock label="Records / day" value="2.4 B" sub="Processed" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Query Throughput</div>
            <MiniBars data={[58, 72, 64, 84, 92, 78, 102, 88, 116, 98, 128, 142]} />
          </div>
        </div>
      );
  }
}

export function Solutions() {
  return (
    <div className="bg-transparent relative">
      <SEO 
        title="Solutions — AI Automation, RPA & Intelligent Platforms"
        description="Targeted Automystics solutions: AI workflow automation, voice AI, computer vision, predictive analytics, smart energy, EdTech platforms, fintech infrastructure, and data intelligence — engineered for measurable ROI."
        keywords="AI workflow automation, voice AI solution, computer vision solution, predictive analytics platform, smart energy software, EdTech platform, fintech infrastructure, data intelligence platform, RPA solutions India"
        canonical="/solutions"
      />

      <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="pt-40 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide mx-auto">
              <span className="text-xl leading-none -mt-1">●</span> OUR SOLUTIONS
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">Purpose-Built <span className="text-primary">Systems</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Targeted technology frameworks designed to solve specific, complex challenges across your operational landscape.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 relative z-10 bg-[#D4DBE8]">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-30" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {solutions.map((solution, index) => (
              <motion.div 
                key={solution.id}
                id={solution.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center scroll-mt-32`}
              >
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Solution Focus
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0">
                      <solution.icon className="w-8 h-8 text-primary" />
                    </div>
                    {solution.title}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                    {solution.desc}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {solution.features.map((feature, i) => (
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
                  <PreviewCard title={solution.title} kicker="Solution Metrics" icon={solution.icon}>
                    <SolutionPreview id={solution.id} />
                  </PreviewCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
