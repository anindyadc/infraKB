import { Terminal } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/30">
        <Terminal className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">DevOps Knowledge Base</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Store runbooks, setup guides, and how-tos. Everything your team needs to get things done — searchable, private, and yours.
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-bold">N</kbd>
          <span className="text-sm text-muted-foreground">Create a new runbook</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-bold">/</kbd>
          <span className="text-sm text-muted-foreground">Search all docs</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-bold">[</kbd>
          <span className="text-sm text-muted-foreground">Toggle Sidebar</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-bold">]</kbd>
          <span className="text-sm text-muted-foreground">Toggle Doc List</span>
        </div>
      </div>
    </div>
  );
}
