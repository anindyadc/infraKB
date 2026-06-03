import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStats } from '../api/stats.api';
import { getUsers, updateUser, createUser, deleteUser } from '../api/users.api';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import { createDoc } from '../api/docs.api';
import { 
  Users, Activity, BarChart3, ShieldCheck, Cpu, Database, Network, 
  Server, Plus, Edit2, Trash2, X, Check, Key, Folder, Sparkles, Hash, FileUp
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'categories' | 'activity'>('stats');

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
        
        <div className="mt-10 flex flex-wrap gap-2 p-1.5 w-fit rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
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
            active={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            icon={<Folder className="h-4 w-4" />}
            label="Registry Structure"
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
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
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
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Database} label="Knowledge Nodes" value={stats.totalDocs} color="text-primary" />
        <StatCard icon={Server} label="Production Sync" value={stats.publishedDocs} />
        <StatCard icon={Cpu} label="Staging Buffers" value={stats.draftDocs} color="text-orange-500" />
        <StatCard icon={Network} label="Network Clients" value={stats.totalUsers} />
      </div>
      
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

function UserManagement() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers({}),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowAddModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  if (isLoading) return <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Retrieving Operator Registry...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Operator Registry</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Operator</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 shadow-2xl backdrop-blur-md">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Registered Operator</th>
              <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Security Role</th>
              <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">Node Status</th>
              <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data?.data?.map((user: any) => (
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
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => confirm('Disable operator?') && deleteMutation.mutate(user.id)}
                      className="p-2 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-[2rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black uppercase tracking-tighter text-foreground">
                 {showAddModal ? 'Register Operator' : 'Modify Credentials'}
               </h4>
               <button onClick={() => { setShowAddModal(false); setEditingUser(null); }} className="text-muted-foreground hover:text-foreground">
                 <X className="h-5 w-5" />
               </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              if (showAddModal) {
                createMutation.mutate(data);
              } else {
                updateMutation.mutate({ id: editingUser.id, data });
              }
            }} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</label>
                  <input name="displayName" defaultValue={editingUser?.displayName} required className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
                
                {showAddModal && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                      <input name="username" required className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                      <input name="email" type="email" required className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {showAddModal ? 'Access Key / Password' : 'Reset Access Key (Optional)'}
                  </label>
                  <input name="password" type="password" required={showAddModal} placeholder={editingUser ? 'Leave blank to keep current' : ''} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Role</label>
                  <select name="role" defaultValue={editingUser?.role || 'VIEWER'} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none">
                    <option value="VIEWER">VIEWER (Read Only)</option>
                    <option value="EDITOR">EDITOR (Create/Edit)</option>
                    <option value="ADMIN">ADMIN (Full Access)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full rounded-xl bg-primary py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Key className="h-3 w-3" />
                <span>{showAddModal ? 'Initialize Account' : 'Commit Credentials'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryManagement() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importCategoryId, setImportCategoryId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowAddModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const bulkImportMutation = useMutation({
    mutationFn: async ({ categoryId, files }: { categoryId: number, files: FileList }) => {
      const promises = Array.from(files).map(async (file) => {
        const title = file.name.replace(/\.[^/.]+$/, "");
        const content = await file.text();
        return createDoc({ title, content, categoryId });
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      alert('Bulk import completed successfully.');
    },
    onError: (err: any) => {
      alert(`Bulk import failed: ${err.message}`);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && importCategoryId) {
      bulkImportMutation.mutate({ categoryId: importCategoryId, files: e.target.files });
    }
    // Reset
    e.target.value = '';
    setImportCategoryId(null);
  };

  if (isLoading) return <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Scanning Registry Structure...</div>;

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept=".md,.markdown,.txt" 
        className="hidden" 
      />
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Knowledge Hierarchies</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Hierarchy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.categories?.map((cat: any) => (
          <div key={cat.id} className="group relative rounded-[2rem] border border-border/50 bg-card/40 p-8 shadow-xl backdrop-blur-sm hover:border-primary/30 transition-all overflow-hidden">
             {/* Decorative Background Icon */}
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl">{cat.icon || '📁'}</span>
             </div>

             <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-2xl shadow-inner">
                   {cat.icon || '📁'}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => {
                      setImportCategoryId(cat.id);
                      fileInputRef.current?.click();
                    }}
                    title="Bulk Import Markdown"
                    className="p-2 rounded-lg bg-background border border-border hover:text-primary transition-all"
                   >
                      <FileUp className="h-3.5 w-3.5" />
                   </button>
                   <button onClick={() => setEditingCategory(cat)} className="p-2 rounded-lg bg-background border border-border hover:text-primary transition-all">
                      <Edit2 className="h-3.5 w-3.5" />
                   </button>
                   <button onClick={() => confirm('Purge this hierarchy node?') && deleteMutation.mutate(cat.id)} className="p-2 rounded-lg bg-background border border-border hover:text-destructive transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                   </button>
                </div>
             </div>

             <h4 className="text-lg font-black uppercase tracking-tighter text-foreground mb-1">{cat.name}</h4>
             <p className="text-[10px] font-mono font-bold text-muted-foreground/50 mb-4 uppercase tracking-widest">path: /{cat.slug}</p>
             
             <div className="flex items-center gap-4 border-t border-border/30 pt-4">
                <div className="flex flex-col">
                   <span className="text-xl font-black text-foreground tabular-nums">{cat._count?.docs || 0}</span>
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Entities</span>
                </div>
                <div className="w-px h-6 bg-border/50" />
                <div className="flex flex-col">
                   <span className="text-xl font-black text-foreground tabular-nums">{cat.children?.length || 0}</span>
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Sub-Nodes</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-[2rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black uppercase tracking-tighter text-foreground">
                 {showAddModal ? 'Initialize Hierarchy' : 'Modify Hierarchy'}
               </h4>
               <button onClick={() => { setShowAddModal(false); setEditingCategory(null); }} className="text-muted-foreground hover:text-foreground">
                 <X className="h-5 w-5" />
               </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const rawData = Object.fromEntries(formData.entries());
              const payload = {
                ...rawData,
                sortOrder: Number(rawData.sortOrder),
                parentId: rawData.parentId ? Number(rawData.parentId) : null,
              };
              if (showAddModal) {
                createMutation.mutate(payload as any);
              } else {
                updateMutation.mutate({ id: editingCategory.id, data: payload as any });
              }
            }} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                  <input name="name" defaultValue={editingCategory?.name} required placeholder="e.g. INFRASTRUCTURE" className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Slug (Path)</label>
                    <input name="slug" defaultValue={editingCategory?.slug} placeholder="e.g. infra" className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Icon (Emoji)</label>
                    <input name="icon" defaultValue={editingCategory?.icon} placeholder="e.g. 🏗️" className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-center" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                  <textarea name="description" defaultValue={editingCategory?.description} placeholder="Brief summary of this hierarchy..." className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all h-20 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={editingCategory?.sortOrder || 0} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Parent Hierarchy</label>
                    <select name="parentId" defaultValue={editingCategory?.parentId || ""} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none font-bold uppercase">
                    <option value="">/ NONE (TOP LEVEL)</option>
                    {categories?.categories?.filter((c: any) => c.id !== editingCategory?.id).map((c: any) => (
                      <option key={c.id} value={c.id}>/ {c.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full rounded-xl bg-primary py-4 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Folder className="h-3 w-3" />
                <span>{showAddModal ? 'Initialize hierarchy' : 'Commit Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
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
