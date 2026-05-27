import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats.api';
import { getUsers } from '../api/users.api';
import { Users, Activity, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity'>('stats');

  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="border-b border-[#30363d] bg-[#161b22] px-8 py-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-[#e6edf3]">
          <ShieldCheck className="h-6 w-6 text-[#10b981]" />
          <span>Admin Panel</span>
        </h1>
        <div className="mt-6 flex gap-4">
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<BarChart3 className="h-4 w-4" />}
            label="Statistics"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={<Users className="h-4 w-4" />}
            label="User Management"
          />
          <TabButton
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
            icon={<Activity className="h-4 w-4" />}
            label="Activity Log"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'stats' && <StatsDashboard />}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'activity' && <ActivityLog />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]'
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

  if (isLoading) return <div className="text-[#484f58]">Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Documents" value={stats.totalDocs} />
      <StatCard label="Published" value={stats.publishedDocs} color="text-[#10b981]" />
      <StatCard label="Drafts" value={stats.draftDocs} color="text-[#d29922]" />
      <StatCard label="Users" value={stats.totalUsers} />
      
      <div className="col-span-full mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
          <h3 className="mb-4 text-sm font-bold text-[#e6edf3]">Recently Updated</h3>
          <div className="space-y-4">
            {stats.recentDocs.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">{doc.title}</span>
                <span className="text-[10px] font-mono text-[#484f58]">{new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
          <h3 className="mb-4 text-sm font-bold text-[#e6edf3]">Top Viewed</h3>
          <div className="space-y-4">
            {stats.topViewedDocs.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between">
                <span className="text-sm text-[#8b949e]">{doc.title}</span>
                <span className="text-[10px] font-mono text-[#10b981]">{doc.viewCount} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-[#e6edf3]' }: any) {
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
      <p className="text-xs font-mono uppercase tracking-widest text-[#484f58]">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers({}),
  });

  if (isLoading) return <div className="text-[#484f58]">Loading users...</div>;

  return (
    <div className="overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#30363d] bg-[#0d1117]/50">
            <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[#484f58]">User</th>
            <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[#484f58]">Role</th>
            <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[#484f58]">Status</th>
            <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[#484f58]">Last Login</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#30363d]">
          {data.data.map((user: any) => (
            <tr key={user.id} className="hover:bg-[#21262d]">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-[#e6edf3]">{user.displayName}</span>
                  <span className="text-xs text-[#8b949e]">{user.email}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-[#bc8cff]/10 text-[#bc8cff]' : 'bg-[#58a6ff]/10 text-[#58a6ff]'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`h-2 w-2 inline-block rounded-full ${user.isActive ? 'bg-[#10b981]' : 'bg-[#f85149]'}`} />
                <span className="ml-2 text-[#8b949e]">{user.isActive ? 'Active' : 'Disabled'}</span>
              </td>
              <td className="px-6 py-4 text-[#8b949e]">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityLog() {
  return <div className="text-[#8b949e]">Activity log coming soon...</div>;
}
