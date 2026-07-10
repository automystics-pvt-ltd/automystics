import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, ArrowUpRight, Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Server, Cloud, Smartphone, Paintbrush, Cog, Workflow, Settings, Users, BookOpen, Briefcase, FileText, HeartHandshake, Database, Dumbbell, Package, Zap, Shield, HeartPulse, CalendarCheck, Activity, DollarSign } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProducts } from "@/hooks/use-products";

const PRODUCT_ICON_MAP: Record<string, any> = {
  Building2, GraduationCap, Mic, LineChart, Sun, Camera, Code, Dumbbell,
  Zap, Database, Shield, HeartPulse, CalendarCheck, Activity, Users, DollarSign, Package,
};

const services = [
  { id: "custom-software", title: "Custom Software", desc: "Bespoke enterprise architecture", icon: Code },
  { id: "web-dev", title: "Web Application", desc: "Scalable cloud-native apps", icon: Server },
  { id: "mobile-dev", title: "Mobile App", desc: "Native & cross-platform", icon: Smartphone },
  { id: "ai-integration", title: "AI Integration", desc: "Intelligent workflow automation", icon: Workflow },
  { id: "cloud-devops", title: "Cloud & DevOps", desc: "Infrastructure optimization", icon: Cloud },
  { id: "ui-ux", title: "UI/UX Design", desc: "User-centric interface crafting", icon: Paintbrush },
  { id: "api-integration", title: "API Integration", desc: "Seamless system connectivity", icon: Settings },
  { id: "maintenance", title: "Maintenance", desc: "24/7 support & monitoring", icon: Cog },
];

const fallbackProducts = [
  { id: "chit-fund", title: "Chit Fund Management", desc: "Digital platform for finance", icon: Building2 },
  { id: "school-management", title: "School Management", desc: "End-to-end administration", icon: GraduationCap },
  { id: "kalvicore", title: "KalviCore", desc: "Advanced College Management", icon: GraduationCap },
  { id: "kural-ai", title: "Kural AI", desc: "Intelligent voice automation", icon: Mic },
  { id: "auto-algo", title: "Auto Algo Trading", desc: "High-frequency trading", icon: LineChart },
  { id: "scada", title: "SCADA Monitoring", desc: "Industrial solar monitoring", icon: Sun },
  { id: "cctv", title: "CCTV AutoMonitoring", desc: "Intelligent anomaly detection", icon: Camera },
  { id: "fitro360", title: "Fitro360", desc: "Gym Management System", icon: Dumbbell },
  { id: "custom", title: "Custom Solutions", desc: "Bespoke applications", icon: Code }
];

const industries = [
  { id: "finance", title: "Finance & Banking", desc: "Secure fintech platforms", icon: Building2 },
  { id: "education", title: "Education", desc: "Institution management", icon: GraduationCap },
  { id: "manufacturing", title: "Manufacturing", desc: "Industry 4.0 automation", icon: Cog },
  { id: "energy", title: "Energy & Utilities", desc: "Grid & asset monitoring", icon: Sun },
  { id: "healthcare", title: "Healthcare", desc: "Compliance & data management", icon: HeartHandshake },
  { id: "retail", title: "Retail", desc: "E-commerce & inventory", icon: Smartphone },
  { id: "logistics", title: "Logistics", desc: "Supply chain optimization", icon: Workflow },
  { id: "real-estate", title: "Real Estate", desc: "Property tech solutions", icon: Building2 },
];

const solutions = [
  { id: "enterprise-automation", title: "Enterprise Automation", desc: "End-to-end workflow orchestration", icon: Workflow },
  { id: "ai-voice", title: "AI Voice Agents", desc: "Conversational AI for support & sales", icon: Mic },
  { id: "algo-trading", title: "Algorithmic Trading", desc: "Low-latency quantitative execution", icon: LineChart },
  { id: "surveillance", title: "Surveillance Intelligence", desc: "Real-time video analytics & alerts", icon: Camera },
  { id: "solar-monitoring", title: "Solar Plant Monitoring", desc: "SCADA & IoT telemetry at scale", icon: Sun },
  { id: "academic", title: "Academic Management", desc: "Full student & faculty lifecycle", icon: GraduationCap },
  { id: "fintech-platform", title: "Fintech Platforms", desc: "Compliant lending & chit fund engines", icon: Building2 },
  { id: "data-intelligence", title: "Data Intelligence", desc: "Pipelines, dashboards & BI", icon: Database },
];

const company = [
  { id: "about", title: "About Us", desc: "Our mission & vision", icon: Users },
  { id: "process", title: "Our Process", desc: "How we build", icon: Workflow },
  { id: "careers", title: "Careers", desc: "Join our team", icon: Briefcase },
  { id: "case-studies", title: "Case Studies", desc: "Client success stories", icon: BookOpen },
  { id: "blog", title: "Blog", desc: "Insights & news", icon: FileText },
  { id: "partners", title: "Partners", desc: "Our ecosystem", icon: HeartHandshake },
];

const DropdownGrid = ({ items, linkPrefix }: { items: any[], linkPrefix: string }) => (
  <div className="w-[800px] p-6 grid grid-cols-2 gap-4 bg-white border border-border shadow-2xl rounded-2xl">
    {items.map((item) => (
      <NavigationMenuLink asChild key={item.id}>
        <Link href={`${linkPrefix}#${item.id}`} className="group p-3 rounded-xl hover:bg-muted transition-colors flex gap-4 items-start outline-none">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {item.desc}
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    ))}
  </div>
);

export function Navbar() {
  const [location] = useLocation();
  const isHome = location === "/";
  const isContact = location === "/contact";
  const { products: livePublicProducts } = useProducts();
  const products = livePublicProducts.length
    ? livePublicProducts.map((p) => ({
        id: p.key,
        title: p.title,
        desc: p.category || (p.description ? p.description.slice(0, 60) : ""),
        icon: PRODUCT_ICON_MAP[p.icon || "Package"] || Package,
      }))
    : fallbackProducts;

  const triggerClass = (path: string) => {
    const active = location === path || location.startsWith(path + "/");
    return `!h-10 rounded-full px-4 py-2 text-sm font-semibold transition-all focus:!outline-none focus-visible:!ring-2 focus-visible:!ring-primary/60 data-[state=open]:!bg-primary data-[state=open]:!text-white ${
      active
        ? "!bg-primary !text-white shadow-lg shadow-primary/40 hover:!bg-primary hover:!text-white focus:!bg-primary focus:!text-white"
        : "!bg-transparent !text-white/80 hover:!bg-white/10 hover:!text-white focus:!bg-transparent focus-visible:!bg-white/10"
    }`;
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-[#0B1426] text-white rounded-full shadow-2xl shadow-primary/10 border border-white/10 flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 relative z-10 outline-none shrink-0" data-testid="nav-logo">
            <div className="bg-white rounded-2xl h-12 w-14 flex items-center justify-center shadow-lg ring-1 ring-white/20">
              <img src="/logo-icon.png" alt="Automystics" className="h-10 w-auto object-contain" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-white uppercase">Automystics</span>
              <span className="text-[6.5px] font-semibold uppercase text-primary mt-1 block" style={{ letterSpacing: "0.135em", marginRight: "-0.135em" }}>An AI Automation Company</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-0.5">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass("/services")}>
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownGrid items={services} linkPrefix="/services" />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass("/products")}>
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownGrid items={products} linkPrefix="/products" />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass("/industries")}>
                    Industries
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownGrid items={industries} linkPrefix="/industries" />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass("/solutions")}>
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownGrid items={solutions} linkPrefix="/solutions" />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerClass("/company")}>
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <DropdownGrid items={company} linkPrefix="/company" />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/demo" className={`group inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white outline-none ${location.startsWith("/demo") ? "bg-primary text-white shadow-lg shadow-primary/40" : "text-white/80"}`} data-testid="nav-demo">
                      Demo
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className={`group inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white outline-none ${isContact ? "bg-primary text-white shadow-lg shadow-primary/40" : "text-white/80"}`}>
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center justify-end relative z-10 shrink-0">
            <Link href="/contact">
              <Button className="rounded-full h-10 px-5 bg-primary hover:bg-primary/90 text-white font-semibold gap-2 transition-all group" data-testid="nav-cta">
                Start a Project
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden relative z-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0B1426] border-l border-white/10 p-6 w-[320px] overflow-y-auto">
                <div className="flex flex-col gap-6 mt-10">
                  <Link href="/" className={`text-lg font-medium transition-colors ${isHome ? "text-white" : "text-white/70"}`}>
                    Home
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="text-lg font-medium text-white">Services</div>
                    <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                      {services.map(p => (
                        <Link key={p.id} href={`/services#${p.id}`} className="text-white/70 hover:text-white text-sm">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg font-medium text-white">Products</div>
                    <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                      {products.map(p => (
                        <Link key={p.id} href={`/products#${p.id}`} className="text-white/70 hover:text-white text-sm">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg font-medium text-white">Industries</div>
                    <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                      {industries.map(p => (
                        <Link key={p.id} href={`/industries#${p.id}`} className="text-white/70 hover:text-white text-sm">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg font-medium text-white">Solutions</div>
                    <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                      {solutions.map(p => (
                        <Link key={p.id} href={`/solutions#${p.id}`} className="text-white/70 hover:text-white text-sm">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg font-medium text-white">Company</div>
                    <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                      {company.map(p => (
                        <Link key={p.id} href={`/company#${p.id}`} className="text-white/70 hover:text-white text-sm">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link href="/demo" className={`text-lg font-medium transition-colors ${location.startsWith("/demo") ? "text-white" : "text-white/70"}`}>
                    Demo
                  </Link>

                  <Link href="/contact" className={`text-lg font-medium transition-colors ${isContact ? "text-white" : "text-white/70"}`}>
                    Contact Us
                  </Link>
                  
                  <div className="h-px bg-white/10 w-full my-2"></div>
                  <Link href="/contact">
                    <Button variant="default" className="w-full rounded-full bg-primary text-white font-semibold gap-2 h-12 hover:bg-primary/90">
                      Start a Project <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
