import React from "react";

export function StatBlock({ label, value, accent, sub }: { label: string; value: string; accent?: string; sub?: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{label}</div>
      <div className="text-xl font-extrabold text-white mt-1 tracking-tight">{value}</div>
      {sub && <div className={`text-[10px] font-bold mt-0.5 ${accent || "text-primary"}`}>{sub}</div>}
    </div>
  );
}

export function MiniBars({ data, color = "bg-primary" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div key={i} className={`flex-1 ${color} rounded-sm opacity-80`} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

let lineId = 0;
export function MiniLine({ points, height = 40 }: { points: number[]; height?: number }) {
  const gradId = React.useMemo(() => `ar${++lineId}`, []);
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
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function PreviewCard({ title, kicker, icon: Icon, children }: { title: string; kicker: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#0B1426] via-[#11203A] to-[#0B1426] border-0 shadow-2xl shadow-primary/20 rounded-[2.5rem] aspect-[4/3] overflow-hidden relative group p-4 transition-all duration-500">
      <div className="absolute inset-0 dark-grid-pattern opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/30 rounded-full blur-[100px]" />
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
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight leading-tight">{title}</div>
            <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">{kicker}</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
