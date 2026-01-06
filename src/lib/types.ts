
export type NodeType = 'trigger' | 'action';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  icon?: string;
  isConfigured?: boolean;
  status?: 'idle' | 'running' | 'completed' | 'error';
}
