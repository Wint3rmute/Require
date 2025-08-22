
'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: "parent",
    type: 'parentNode',
    position: { x: 0, y: 0 },
    data: { label: "Parent" }
  }
];
const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const ParentNode = ({ data }: { data: { label: string }}) => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} isVisible={true} />
      <Handle type="target" position={Position.Left} />
      <div >{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};


export function CustomNode() {
  return (
    <div className="custom-node">
      <div>Custom Node Content</div>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
  parentNode: ParentNode,
};

function SystemEditorFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      // const type = "customNode"
      const name = event.dataTransfer.getData('application/reactflow-name');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${name}` },
        parentId: "parent"
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default function SystemEditor() {
  return (
    <div style={{ height: '70vh' }}>
      <ReactFlowProvider>
        <SystemEditorFlow />
      </ReactFlowProvider>
    </div>
  );
}
