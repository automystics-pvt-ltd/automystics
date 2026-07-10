import React, { useMemo, useState } from "react";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowUpRight, PlayCircle, Lock, Copy, Check, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDemos, type PublicDemo } from "@/hooks/use-demos";
import { useToast } from "@/hooks/use-toast";

function CredentialChip({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-card-border text-xs font-mono text-foreground hover:border-primary/40 transition-colors"
      data-testid={`copy-${label.toLowerCase()}`}
    >
      <span className="text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="font-semibold">{value}</span>
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

function DemoCard({ demo }: { demo: PublicDemo }) {
  const cta = demo.ctaLabel || "Launch demo";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-card-border rounded-[2rem] shadow-lg shadow-black/5 overflow-hidden flex flex-col card-hover-effect"
      data-testid={`demo-card-${demo.id}`}
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent overflow-hidden">
        {demo.thumbnailUrl ? (
          <img src={demo.thumbnailUrl} alt={demo.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-primary/40" />
          </div>
        )}
        {demo.badge && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wide shadow-lg">
            {demo.badge}
          </span>
        )}
        {demo.category && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold uppercase tracking-wide border border-card-border">
            {demo.category}
          </span>
        )}
      </div>

      <div className="p-7 flex-1 flex flex-col">
        <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{demo.title}</h3>
        {demo.tagline && (
          <p className="mt-1 text-primary font-semibold text-sm">{demo.tagline}</p>
        )}
        {demo.description && (
          <p className="mt-4 text-muted-foreground leading-relaxed">{demo.description}</p>
        )}

        {(demo.demoUsername || demo.demoPassword) && (
          <div className="mt-5 p-4 rounded-2xl bg-muted/30 border border-card-border">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Lock className="w-3.5 h-3.5" /> Demo credentials
            </div>
            <div className="flex flex-wrap gap-2">
              {demo.demoUsername && <CredentialChip label="User" value={demo.demoUsername} />}
              {demo.demoPassword && <CredentialChip label="Pass" value={demo.demoPassword} />}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-wrap gap-3">
          {demo.demoUrl && (
            <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
              <Button className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white font-bold group" data-testid={`demo-launch-${demo.id}`}>
                {cta} <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          )}
          {demo.videoUrl && (
            <a href={demo.videoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full h-12 border-card-border bg-white hover:border-primary/40">
                <PlayCircle className="w-4 h-4 mr-2" /> Watch video
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Demo() {
  const { demos, loading } = useDemos();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    demos.forEach((d) => d.category && set.add(d.category));
    return ["all", ...Array.from(set).sort()];
  }, [demos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demos.filter((d) => {
      if (activeCategory !== "all" && d.category !== activeCategory) return false;
      if (!q) return true;
      return [d.title, d.tagline, d.description, d.category]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q));
    });
  }, [demos, query, activeCategory]);

  return (
    <div className="min-h-screen bg-transparent pt-40 pb-24">
      <SEO
        title="Product Demos — Try Automystics Live"
        description="Explore live demos of Automystics products — chit fund management, KalviCore CMS, Kural AI Voice, Auto Algo Trading, SCADA Monitoring and more. Real apps, demo credentials included."
        keywords="Automystics demo, product demo, chit fund demo, KalviCore demo, Kural AI demo, SCADA demo, fitness software demo, trading platform demo"
        canonical="/demo"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-card-border shadow-sm text-primary text-sm font-bold mb-6 uppercase tracking-wide">
            <PlayCircle className="w-4 h-4" /> Live Product Demos
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            See Our Products <span className="text-primary">In Action.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Click to explore working demos of every Automystics product — no scheduling required.
          </p>
        </motion.div>

        {!loading && demos.length > 1 && (
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="bg-white border border-card-border rounded-2xl p-2 shadow-sm flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-muted-foreground ml-2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search demos…"
                className="border-0 focus-visible:ring-0 bg-transparent h-10"
                data-testid="demo-search"
              />
            </div>
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      activeCategory === c
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-foreground border-card-border hover:border-primary/40"
                    }`}
                    data-testid={`demo-category-${c}`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading demos…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-card-border rounded-3xl p-16 text-center">
            <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              {demos.length === 0 ? "Demos coming soon" : "No demos match your search"}
            </h3>
            <p className="text-muted-foreground">
              {demos.length === 0
                ? "Our team is preparing live previews. Reach out for a personal walkthrough."
                : "Try a different search or category filter."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((d) => <DemoCard key={d.id} demo={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
