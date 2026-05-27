import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats.api';
import { getUsers } from '../api/users.api';
import { Users, Activity, BarChart3, ShieldCheck, Cpu, Database, Network, Server } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity'>('stats');

  return (
    <div className="flex h-full flex-col bg-background animate-in fade-in duration-700">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-8 lg:py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[2px] w-8 bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Oversight</span>
        </div>
        
        <h1 className="flex items-center gap-4 text-4xl lg:text-5xl font-black tracking-tighter text-foreground">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <span>Control Panel</span>
        </h1>
        
        <div className="mt-10 flex gap-2 p-1.5 w-fit rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<BarChart3 className="h-4 w-4" />}
            label="Metrics"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={<Users className="h-4 w-4" />}
            label="Operators"
          />
          <TabButton
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
            icon={<Activity className="h-4 w-4" />}
            label="Event Log"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-primary/10">
        <div className="mx-auto max-w-7xl">
          {activeTab === 'stats' && <StatsDashboard />}
          {activeTab === 'users' && <UserList />}
          {activeTab === 'activity' && <ActivityLog />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
        active 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getStats,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20 opacity-30">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Aggregating System Metrics...</span>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Top Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Database} label="Knowledge Nodes" value={stats.totalDocs} color="text-primary" />
        <StatCard icon={Server} label="Production Sync" value={stats.publishedDocs} />
        <StatCard icon={Cpu} label="Staging Buffers" value={stats.draftDocs} color="text-orange-500" />
        <StatCard icon={Network} label="Network Clients" value={stats.totalUsers} />
      </div>
      
      {/* Detailed View */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/50 bg-card/40 p-8 shadow-xl backdrop-blur-sm">
          <h3 className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 border-b border-border/50 pb-4 flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             Recently Modified
          </h3>
          <div className="space-y-6">
            {stats.recentDocs.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{doc.title}</span>
                  <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest">Modified by Operator 0{doc.authorId}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground/40 bg-muted/30 px-2 py-1 rounded-lg">{new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/50 bg-card/40 p-8 shadow-xl backdrop-blur-sm">
          <h3 className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 border-b border-border/50 pb-4 flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             High Traffic Nodes
          </h3>
          <div className="space-y-6">
            {stats.topViewedDocs.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{doc.title}</span>
                  <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest">Network Request Peak</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-primary tabular-nums tracking-tighter">{doc.viewCount}</span>
                  <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest">Access Events</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = 'text-foreground' }: any) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-8 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-primary/30 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-12 w-12" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">{label}</p>
      <p className={`text-4xl font-black tabular-nums tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers({}),
  });

  if (isLoading) return <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Retrieving Operator Registry...</div>;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 shadow-2xl backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Registered Operator</th>
            <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Security Role</th>
            <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Node Status</th>
            <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Last Activity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {data.data.map((user: any) => (
            <tr key={user.id} className="hover:bg-muted/30 transition-all group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs text-primary font-black uppercase">
                    {user.displayName?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{user.displayName}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/50 lowercase">{user.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-destructive opacity-50'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                    {user.isActive ? 'Active' : 'Offline'}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6 font-mono text-[10px] font-bold text-muted-foreground/40">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'SESSION_VOID'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityLog() {
  return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 border-2 border-dashed border-border/30 rounded-[3rem] opacity-20 grayscale">
       <Activity className="h-12 w-12" />
       <span className="text-[10px] font-black uppercase tracking-[0.5em]">Activity Stream coming soon</span>
    </div>
  );
}
