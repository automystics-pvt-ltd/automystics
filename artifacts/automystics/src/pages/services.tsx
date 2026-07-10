import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { Code, Server, Smartphone, Workflow, Cloud, Paintbrush, Settings, Cog, CheckCircle2 } from "lucide-react";
import { StatBlock, MiniBars, MiniLine, PreviewCard } from "@/components/dashboard-preview";

function ServicePreview({ id }: { id: string }) {
  switch (id) {
    case "custom-software":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Projects Live" value="150+" sub="Enterprise" />
          <StatBlock label="Avg Delivery" value="6.2 wk" sub="↓ 60% vs market" accent="text-emerald-400" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Sprint Velocity</div>
            <MiniBars data={[42, 58, 51, 68, 74, 82, 78, 88, 92, 86, 95, 98]} />
          </div>
        </div>
      );
    case "web-dev":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="PageSpeed" value="98/100" sub="Lighthouse" accent="text-emerald-400" />
          <StatBlock label="TTFB" value="84ms" sub="Global avg" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Daily Requests</div>
            <MiniLine points={[120, 180, 240, 320, 280, 410, 480, 520, 600, 580, 720, 840]} />
          </div>
        </div>
      );
    case "mobile-dev":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="App Rating" value="4.8 ★" sub="iOS + Android" accent="text-emerald-400" />
          <StatBlock label="Crash Free" value="99.92%" sub="Sessions" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Active Users (30d)</div>
            <MiniBars data={[28, 34, 42, 38, 51, 64, 58, 72, 81, 78, 89, 94]} />
          </div>
        </div>
      );
    case "ai-integration":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Models Deployed" value="84" sub="Production" />
          <StatBlock label="Inference" value="120ms" sub="P95 latency" accent="text-emerald-400" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Tokens / sec</div>
            <MiniLine points={[200, 260, 240, 320, 380, 420, 460, 520, 580, 640, 720, 810]} />
          </div>
        </div>
      );
    case "cloud-devops":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Deploy Freq" value="42/day" sub="Across stack" accent="text-emerald-400" />
          <StatBlock label="MTTR" value="8 min" sub="↓ from 4 hrs" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">CI/CD Pipeline Runs</div>
            <MiniBars data={[64, 72, 58, 84, 91, 78, 96, 88, 102, 94, 118, 124]} />
          </div>
        </div>
      );
    case "ui-ux":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Conversion" value="+38%" sub="Avg lift" accent="text-emerald-400" />
          <StatBlock label="Task Success" value="94.6%" sub="Usability tests" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">User Engagement</div>
            <MiniLine points={[40, 48, 55, 62, 70, 68, 78, 85, 82, 91, 96, 102]} />
          </div>
        </div>
      );
    case "api-integration":
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Uptime" value="99.99%" sub="API SLA" accent="text-emerald-400" />
          <StatBlock label="Endpoints" value="284" sub="REST + GraphQL" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Calls / minute</div>
            <MiniBars data={[120, 145, 132, 168, 184, 152, 196, 178, 212, 198, 234, 256]} />
          </div>
        </div>
      );
    case "maintenance":
    default:
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Response Time" value="< 5 min" sub="Critical issues" accent="text-emerald-400" />
          <StatBlock label="Tickets Closed" value="1,847" sub="This month" />
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">System Health 24h</div>
            <MiniLine points={[92, 94, 91, 95, 97, 96, 98, 97, 99, 98, 99, 99]} />
          </div>
        </div>
      );
  }
}

const services = [
  { 
    id: "custom-software", 
    title: "Custom Software Development", 
    icon: Code,
    desc: "We engineer bespoke enterprise architecture tailored exactly to your operational needs. Our approach focuses on building highly scalable, secure, and performant applications that drive business efficiency and digital transformation.",
    features: ["Cloud-native architecture", "Microservices design", "Legacy system modernization", "Enterprise integration"]
  },
  { 
    id: "web-dev", 
    title: "Web Application Development", 
    icon: Server,
    desc: "Create powerful, scalable cloud-native web applications using modern technology stacks. We build resilient front-ends and robust back-ends that handle high traffic and complex data workflows with ease.",
    features: ["Single Page Applications (SPA)", "Progressive Web Apps (PWA)", "High-performance backends", "Real-time data processing"]
  },
  { 
    id: "mobile-dev", 
    title: "Mobile App Development", 
    icon: Smartphone,
    desc: "Deliver exceptional mobile experiences with native and cross-platform application development. We craft intuitive mobile solutions that keep your users engaged, whether on iOS or Android devices.",
    features: ["iOS & Android native apps", "React Native & Flutter", "Offline-first capabilities", "Push notification systems"]
  },
  { 
    id: "ai-integration", 
    title: "AI Integration & Automation", 
    icon: Workflow,
    desc: "Transform your business operations with intelligent workflow automation. We integrate cutting-edge AI models to automate repetitive tasks, extract insights from unstructured data, and enhance decision-making processes.",
    features: ["Custom LLM integration", "Predictive analytics", "Process automation", "Computer vision solutions"]
  },
  { 
    id: "cloud-devops", 
    title: "Cloud & DevOps Services", 
    icon: Cloud,
    desc: "Optimize your infrastructure for maximum reliability and scalability. Our DevOps experts design CI/CD pipelines, containerized deployments, and robust cloud architectures that ensure high availability and rapid feature delivery.",
    features: ["AWS, Azure & GCP expertise", "Docker & Kubernetes", "Automated CI/CD pipelines", "Infrastructure as Code (IaC)"]
  },
  { 
    id: "ui-ux", 
    title: "UI/UX Design", 
    icon: Paintbrush,
    desc: "Craft user-centric interfaces that combine aesthetic excellence with intuitive usability. Our design process relies on deep user research to create engaging digital products that delight users and drive conversions.",
    features: ["User research & testing", "Wireframing & prototyping", "Design systems", "Interaction design"]
  },
  { 
    id: "api-integration", 
    title: "API Design & Integration", 
    icon: Settings,
    desc: "Ensure seamless system connectivity with robust API design and integration services. We build secure, well-documented RESTful and GraphQL APIs that connect your disparate software systems into a unified ecosystem.",
    features: ["REST & GraphQL APIs", "Third-party service integration", "API security & rate limiting", "Comprehensive documentation"]
  },
  { 
    id: "maintenance", 
    title: "Software Maintenance & Support", 
    icon: Cog,
    desc: "Protect your software investment with 24/7 support and proactive monitoring. We provide ongoing maintenance, security patches, and performance optimizations to keep your systems running flawlessly around the clock.",
    features: ["24/7 system monitoring", "Security patching & updates", "Performance optimization", "Technical support desk"]
  },
];

export function Services() {
  return (
    <div className="bg-transparent relative">
      <SEO 
        title="Services — Custom Software, AI Integration & Cloud DevOps"
        description="End-to-end services from Automystics Technologies Private Limited: custom software engineering, AI/ML integration, mobile apps, cloud DevOps, UI/UX design, and managed support — built for enterprise scale."
        keywords="custom software services, AI integration services, machine learning consulting, mobile app development services, cloud DevOps consulting, UI UX design agency India, enterprise software services, managed software support"
        canonical="/services"
      />

      <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="pt-40 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide mx-auto">
              <span className="text-xl leading-none -mt-1">●</span> OUR SERVICES
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">Engineering <span className="text-primary">Excellence</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We build complex enterprise software faster than anyone else. From custom architecture to AI integration, we deliver robust solutions that scale.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 relative z-10 bg-[#D4DBE8]">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-30" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center scroll-mt-32`}
              >
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-foreground text-sm font-bold tracking-wide uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Service
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-white shadow-sm border border-card-border rounded-2xl shrink-0">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    {service.title}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                    {service.desc}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {service.features.map((feature, i) => (
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
                  <PreviewCard title={service.title} kicker="Service Metrics" icon={service.icon}>
                    <ServicePreview id={service.id} />
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