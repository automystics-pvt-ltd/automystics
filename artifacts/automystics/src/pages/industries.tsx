import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Cog, Sun, HeartHandshake, Smartphone, Workflow, CheckCircle2 } from "lucide-react";
import { StatBlock, MiniBars, MiniLine, PreviewCard } from "@/components/dashboard-preview";

function IndustryPreview({ id }: { id: string }) {
  switch (id) {
    case "finance":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Tx / sec" value="48,200" sub="Peak load" accent="text-emerald-400" />
          <StatBlock label="Fraud Caught" value="₹4.2 Cr" sub="This quarter" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Daily Transaction Volume</div>
            <MiniLine points={[200, 280, 340, 320, 410, 480, 520, 600, 580, 720, 810, 920]} />
          </div>
        </div>
      );
    case "education":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Institutions" value="84" sub="Live deployments" />
          <StatBlock label="Students" value="2.4 L+" sub="Managed" accent="text-emerald-400" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Enrollment Growth</div>
            <MiniBars data={[42, 51, 58, 64, 72, 78, 84, 91, 88, 96, 102, 118]} />
          </div>
        </div>
      );
    case "manufacturing":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="OEE" value="92.4%" sub="Plant efficiency" accent="text-emerald-400" />
          <StatBlock label="Downtime" value="↓ 68%" sub="vs baseline" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Production Output 24h</div>
            <MiniBars data={[58, 72, 84, 76, 91, 88, 95, 82, 96, 89, 94, 98]} />
          </div>
        </div>
      );
    case "energy":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Grid Output" value="284 MW" sub="Real-time" accent="text-emerald-400" />
          <StatBlock label="Plants" value="42" sub="Monitored" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Solar Generation Curve</div>
            <MiniLine points={[5, 12, 28, 48, 72, 92, 96, 88, 76, 58, 32, 12]} />
          </div>
        </div>
      );
    case "healthcare":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Patient Records" value="1.8M+" sub="HIPAA secure" accent="text-emerald-400" />
          <StatBlock label="Telemed Visits" value="48,200" sub="This month" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Appointment Volume</div>
            <MiniLine points={[120, 142, 168, 154, 184, 196, 218, 234, 248, 268, 284, 312]} />
          </div>
        </div>
      );
    case "retail":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="GMV" value="$12.4M" sub="Last 30d" accent="text-emerald-400" />
          <StatBlock label="Conversion" value="4.8%" sub="↑ 1.2pp" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Daily Orders</div>
            <MiniBars data={[68, 84, 76, 92, 104, 88, 116, 98, 124, 112, 134, 148]} />
          </div>
        </div>
      );
    case "logistics":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="On-Time" value="98.4%" sub="Delivery rate" accent="text-emerald-400" />
          <StatBlock label="Fleet" value="2,840" sub="Active vehicles" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Routes Optimized</div>
            <MiniLine points={[140, 168, 192, 220, 248, 272, 308, 342, 378, 412, 448, 488]} />
          </div>
        </div>
      );
    case "real-estate":
    default:
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Properties" value="12,840" sub="Under mgmt" accent="text-emerald-400" />
          <StatBlock label="Occupancy" value="94.2%" sub="Portfolio avg" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Rental Yield Trend</div>
            <MiniBars data={[42, 48, 52, 58, 62, 68, 74, 78, 82, 86, 91, 96]} />
          </div>
        </div>
      );
  }
}

const industries = [
  { 
    id: "finance", 
    title: "Finance & Banking", 
    icon: Building2,
    desc: "We architect secure, scalable fintech platforms that process high-volume transactions with absolute reliability. Our solutions ensure regulatory compliance while delivering seamless digital banking experiences for modern consumers.",
    features: ["Core banking integrations", "High-frequency trading systems", "Regulatory compliance automation", "Fraud detection algorithms"]
  },
  { 
    id: "education", 
    title: "Education", 
    icon: GraduationCap,
    desc: "Transform educational administration with our comprehensive management systems. We build platforms that connect administrators, faculty, students, and parents into a single, cohesive digital ecosystem.",
    features: ["Campus management systems", "E-learning platform development", "Student lifecycle tracking", "Automated assessment tools"]
  },
  { 
    id: "manufacturing", 
    title: "Manufacturing", 
    icon: Cog,
    desc: "Drive Industry 4.0 initiatives with intelligent automation. We develop systems that optimize production lines, track inventory in real-time, and utilize predictive maintenance to minimize costly equipment downtime.",
    features: ["IoT sensor integration", "Predictive maintenance models", "Supply chain visibility", "Production line automation"]
  },
  { 
    id: "energy", 
    title: "Energy & Utilities", 
    icon: Sun,
    desc: "Empower the energy sector with advanced grid and asset monitoring solutions. Our software processes vast amounts of telemetry data to optimize energy distribution and manage renewable power generation facilities effectively.",
    features: ["SCADA system development", "Smart grid analytics", "Renewable asset monitoring", "Demand forecasting"]
  },
  { 
    id: "healthcare", 
    title: "Healthcare", 
    icon: HeartHandshake,
    desc: "Modernize patient care and medical administration with secure healthcare technology. We build HIPAA-compliant applications that manage electronic health records, telemedicine portals, and clinical workflows.",
    features: ["HIPAA-compliant architecture", "Telemedicine platforms", "EHR/EMR integrations", "Medical imaging analytics"]
  },
  { 
    id: "retail", 
    title: "Retail & E-Commerce", 
    icon: Smartphone,
    desc: "Create engaging omnichannel retail experiences. Our solutions handle complex product catalogs, optimize dynamic pricing strategies, and streamline fulfillment operations to drive sales and customer loyalty.",
    features: ["Omnichannel commerce platforms", "Dynamic pricing engines", "Inventory optimization", "Customer personalization AI"]
  },
  { 
    id: "logistics", 
    title: "Logistics & Supply Chain", 
    icon: Workflow,
    desc: "Optimize the movement of goods with intelligent logistics software. We deliver platforms for route optimization, fleet management, and end-to-end supply chain visibility to reduce costs and improve delivery times.",
    features: ["Route optimization algorithms", "Fleet management systems", "Warehouse automation", "Real-time shipment tracking"]
  },
  { 
    id: "real-estate", 
    title: "Real Estate & PropTech", 
    icon: Building2,
    desc: "Innovate property management and real estate transactions. We build PropTech solutions that streamline lease management, automate tenant communications, and provide powerful data analytics for property investments.",
    features: ["Property management portals", "Virtual tour platforms", "Smart building integration", "Investment analytics dashboards"]
  },
];

export function Industries() {
  return (
    <div className="bg-transparent relative">
      <SEO 
        title="Industries — Finance, Education, Energy, Healthcare & More"
        description="Industry-specific software from Automystics Technologies Private Limited spanning finance, education, manufacturing, solar energy, healthcare, retail, logistics, and the public sector — with proven enterprise deployments."
        keywords="finance software solutions, education technology India, manufacturing automation software, solar energy monitoring, healthcare software India, retail automation, logistics software, public sector software India"
        canonical="/industries"
      />

      <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="pt-40 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide mx-auto">
              <span className="text-xl leading-none -mt-1">●</span> INDUSTRIES WE SERVE
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">Sectors We <span className="text-primary">Power</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We deliver domain-specific expertise and specialized automation across key industries, modernizing legacy workflows with precision.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 relative z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#E1E6EF] to-[#D4DBE8]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {industries.map((industry, index) => (
              <motion.div 
                key={industry.id}
                id={industry.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center scroll-mt-32`}
              >
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Industry Focus
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0">
                      <industry.icon className="w-8 h-8 text-primary" />
                    </div>
                    {industry.title}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                    {industry.desc}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {industry.features.map((feature, i) => (
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
                  <PreviewCard title={industry.title} kicker="Industry Metrics" icon={industry.icon}>
                    <IndustryPreview id={industry.id} />
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