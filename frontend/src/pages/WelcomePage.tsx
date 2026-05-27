import { Terminal, Activity, Zap, Shield, Search, Plus, PanelLeft, PanelRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats.api';

export default function WelcomePage() {
  const { data: stats } = useQuery({
    queryKey: ['welcome-stats'],
    queryFn: getStats,
  });

  return (
    <div className="h-full w-full p-6 lg:p-10 overflow-y-auto animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Command Center</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-none">
            INFRA<span className="text-primary italic">KB.</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl font-medium leading-relaxed">
            Standardize, collaborate, and execute with absolute precision.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">System Latency</span>
            <span className="text-xl font-black tabular-nums text-foreground">1.2ms</span>
          </div>
          <div className="w-px h-10 bg-border/50" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Node Status</span>
            <span className="text-lg font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Activity} label="Entities" value={stats?.totalDocs || 0} trend="+12%" />
        <StatCard icon={Zap} label="Deployments" value="2,481" />
        <StatCard icon={Shield} label="Security" value="Passed" />
        <StatCard icon={Terminal} label="Operators" value={stats?.totalUsers || 0} />
      </div>

      {/* Shortcuts & Operations */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-[2rem] p-6 lg:p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 border-b border-border/50 pb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Quick Operations / Keyboard Shortcuts
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <ShortcutCard 
            keyLabel="/" 
            title="Search" 
            desc="Locate playbooks instantly."
            icon={Search}
          />
          <ShortcutCard 
            keyLabel="N" 
            title="New" 
            desc="Initialize documentation node."
            icon={Plus}
          />
          <ShortcutCard 
            keyLabel="[" 
            title="Sidebar" 
            desc="Toggle navigation view."
            icon={PanelLeft}
          />
          <ShortcutCard 
            keyLabel="]" 
            title="Registry" 
            desc="Toggle document view."
            icon={PanelRight}
          />
        </div>
      </div>

      {/* Subtle bottom decoration */}
      <div className="mt-12 pt-8 border-t border-border/20 flex justify-between items-center opacity-30">
        <div className="flex gap-4">
          <div className="h-1 w-1 bg-foreground rounded-full" />
          <div className="h-1 w-1 bg-foreground rounded-full" />
          <div className="h-1 w-1 bg-foreground rounded-full" />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">System Ready</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend }: any) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-sm transition-all hover:border-primary/30">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-16 w-16" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-black tracking-tighter text-foreground tabular-nums">{value}</h4>
        {trend && (
          <span className="text-[10px] font-black text-primary/80 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ShortcutCard({ keyLabel, title, desc, icon: Icon }: any) {
  return (
    <div className="group rounded-2xl border border-border bg-card/30 p-5 transition-all hover:bg-muted/30 hover:border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all">
          <Icon className="h-5 w-5" />
        </div>
        <kbd className="ml-auto rounded-lg border border-border bg-muted/50 px-2 py-1 font-mono text-xs font-black text-primary">
          {keyLabel}
        </kbd>
      </div>
      <h4 className="text-sm font-black uppercase tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
