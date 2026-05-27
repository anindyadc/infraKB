import { Terminal } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
        <Terminal className="h-8 w-8 text-[#10b981]" />
      </div>
      <h2 className="text-2xl font-bold text-[#e6edf3]">DevOps Knowledge Base</h2>
      <p className="mt-2 max-w-sm text-[#8b949e]">
        Store runbooks, setup guides, and how-tos. Everything your team needs to get things done — searchable, private, and yours.
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-4 text-left">
          <kbd className="rounded border border-[#30363d] bg-[#21262d] px-1.5 py-0.5 font-mono text-xs text-[#10b981]">N</kbd>
          <span className="text-sm text-[#8b949e]">Create a new runbook</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-4 text-left">
          <kbd className="rounded border border-[#30363d] bg-[#21262d] px-1.5 py-0.5 font-mono text-xs text-[#10b981]">/</kbd>
          <span className="text-sm text-[#8b949e]">Search all docs</span>
        </div>
      </div>
    </div>
  );
}
