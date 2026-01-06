
"use client";

import React from 'react';
import { Zap, Mail, Globe, MessageSquare, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file or will create one, otherwise standard clsx/tailwind-merge

// Fallback for cn if not yet present, but usually standard in shadcn setup. 
// If not present, I'll define it inline or ensure the utils file exists. 
// For safety, I will assume a standard clsx/tailwind-merge setup or provide a simple utility.

const SidebarItem = ({
    type,
    label,
    icon: Icon,
    color
}: {
    type: string;
    label: string;
    icon: React.ElementType;
    color: string;
}) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className={cn(
                "group flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing",
                "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10",
                "transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm",
                "relative overflow-hidden"
            )}
            onDragStart={(event) => onDragStart(event, type, label)}
            draggable
        >
            <div className={cn(
                "p-2 rounded-lg bg-gradient-to-br transition-opacity",
                color
            )}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                {label}
            </span>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
    );
};

export function Sidebar() {
    return (
        <aside className="w-72 bg-[#0F0F12] border-r border-white/10 flex flex-col h-full z-10 shadow-2xl">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    Workflow
                </h2>
                <p className="text-xs text-gray-500 mt-1">Drag nodes to the canvas</p>
            </div>

            <div className="p-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                        Triggers
                    </h3>
                    <div className="space-y-3">
                        <SidebarItem type="trigger" label="Webhook" icon={Globe} color="from-pink-500 to-rose-500" />
                        <SidebarItem type="trigger" label="Schedule" icon={Clock} color="from-orange-500 to-amber-500" />
                        <SidebarItem type="trigger" label="Form Submit" icon={FileText} color="from-purple-500 to-indigo-500" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                        Actions
                    </h3>
                    <div className="space-y-3">
                        <SidebarItem type="action" label="Send Email" icon={Mail} color="from-blue-500 to-cyan-500" />
                        <SidebarItem type="action" label="Slack Message" icon={MessageSquare} color="from-emerald-500 to-teal-500" />
                        <SidebarItem type="action" label="HTTP Request" icon={Zap} color="from-yellow-400 to-orange-400" />
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-white/5">
                <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-xs text-blue-200">
                        <strong>Pro Tip:</strong> Connect nodes to create automated flows.
                    </p>
                </div>
            </div>
        </aside>
    );
}
