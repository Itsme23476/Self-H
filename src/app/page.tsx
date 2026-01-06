
"use client";

import { Sidebar } from "@/components/workflow/Sidebar";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-[#0F0F12]/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-bold text-lg tracking-tight">AntiGravity Workflow</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new Event('TRIGGER_RUN_WORKFLOW'))}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:brightness-110 transition-all font-medium text-sm shadow-lg shadow-emerald-500/20 active:scale-95">
            <Play className="w-4 h-4 fill-current" />
            Run Workflow
          </button>

          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/5" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>
      </div>
    </main>
  );
}
