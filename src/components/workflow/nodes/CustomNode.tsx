
import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node as FlowNode } from '@xyflow/react';
import { Globe, Clock, FileText, Mail, MessageSquare, Zap, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowNodeData } from '@/lib/types';

const icons: Record<string, React.ElementType> = {
    Webhook: Globe,
    Schedule: Clock,
    'Form Submit': FileText,
    'Send Email': Mail,
    'Slack Message': MessageSquare,
    'HTTP Request': Zap,
};

const CustomNode = ({ data, selected }: NodeProps<FlowNode<WorkflowNodeData>>) => {
    const Icon = icons[data.label as string] || Zap;

    // Dynamic gradient based on node type
    const gradient = data.type === 'trigger'
        ? 'from-pink-500 to-rose-500' // Trigger colors
        : 'from-blue-500 to-cyan-500'; // Action colors

    const statusColor = {
        idle: 'bg-gray-500',
        running: 'bg-yellow-500 animate-pulse',
        completed: 'bg-emerald-500',
        error: 'bg-red-500'
    }[data.status as string || 'idle'];

    return (
        <div className={cn(
            "relative min-w-[250px] rounded-xl bg-[#1A1A1E] border-2 transition-all duration-300 shadow-xl",
            selected ? "border-blue-500 shadow-blue-500/20" : "border-transparent hover:border-white/20",
        )}>
            {/* Gradient Border Effect */}
            <div className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-r opacity-50 -z-10 blur-sm transition-opacity duration-300",
                gradient,
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )} />

            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-white/5 bg-[#1A1A1E] rounded-t-lg">
                <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-br shadow-inner",
                    gradient
                )}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{data.label}</h3>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                        {data.type}
                    </p>
                </div>
                {/* Status Indicator */}
                <div className="flex gap-1">
                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-colors", statusColor)} />
                </div>
            </div>

            {/* Content Body */}
            <div className="p-3 bg-[#131316] rounded-b-lg">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                    {data.isConfigured ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Configured
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-amber-400">
                            <AlertCircle className="w-3 h-3" /> Setup Needed
                        </span>
                    )}
                </div>
            </div>

            {/* Connection Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-[#1A1A1E] !border-2 !border-gray-500 hover:!border-blue-400 transition-colors"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-[#1A1A1E] !border-2 !border-gray-500 hover:!border-blue-400 transition-colors"
            />
        </div>
    );
};

export default memo(CustomNode);
