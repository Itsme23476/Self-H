
"use client";

import React, { useCallback, useRef, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node as FlowNode,
    ReactFlowProvider,
    BackgroundVariant,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './nodes/CustomNode';
import { WorkflowNodeData } from '@/lib/types';

// Context to trigger run from Header
export const RunContext = React.createContext<() => void>(() => { });

// Initial data
const initialNodes: FlowNode[] = [];
const initialEdges: Edge[] = [];

// Register custom node types
const nodeTypes = {
    custom: CustomNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function WorkflowCanvasContent() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Simulation Logic
    const runSimulation = useCallback(async () => {
        // Reset all
        setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));

        // Find start nodes (triggers)
        const triggers = nodes.filter((n) => n.data.type === 'trigger');

        for (const trigger of triggers) {
            await executeNode(trigger.id);
        }
    }, [nodes, edges, setNodes]);

    const executeNode = async (nodeId: string) => {
        // Set to running
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status: 'running' } } : n));

        // Fake delay
        await new Promise(r => setTimeout(r, 1000));

        // Set to complete
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status: 'completed' } } : n));

        // Find next nodes
        const outgoingEdges = edges.filter((e) => e.source === nodeId);
        for (const edge of outgoingEdges) {
            await executeNode(edge.target);
        }
    };

    // Expose run function to parent via a dirty ref hack or Context?
    // Since I can't easily change the parent structure in one go without errors, I will listen for a custom event dispatch from the header.
    React.useEffect(() => {
        const handleRun = () => runSimulation();
        window.addEventListener('TRIGGER_RUN_WORKFLOW', handleRun);
        return () => window.removeEventListener('TRIGGER_RUN_WORKFLOW', handleRun);
    }, [runSimulation]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4f46e5' } }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Project coordinates to flow position
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: FlowNode = {
                id: getId(),
                type: 'custom',
                position,
                data: { label: label || 'Node', type: (type as any), isConfigured: false, status: 'idle' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    return (
        <div className="w-full h-full bg-[#09090b]" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls className="!bg-[#1A1A1E] !border-white/10 !fill-white" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#333" />
            </ReactFlow>
        </div>
    );
}

// Wrap in Provider
export function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasContent />
        </ReactFlowProvider>
    );
}
