'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import InterfacesList from '@/components/interfaces_list';
import { useLocalStorage } from '@/lib/use_local_storage';
import { type Interface } from '@/components/interfaces_list';
import React, { useState, DragEvent } from 'react';
import CableIcon from '@mui/icons-material/Cable';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const iconMap: { [key: string]: React.ReactElement } = {
  default: <CableIcon />,
};

export default function SystemModel() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [interfaces] = useLocalStorage<Interface[]>('interfaces', []);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    const label = event.dataTransfer.getData('application/label');

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type || !reactFlowInstance) {
      return;
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = {
      id: `${label}-${nodes.length + 1}`,
      type,
      position,
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          width: '250px',
          borderRight: '1px solid #ddd',
          padding: '16px',
        }}
      >
        <Typography variant="h6">Interfaces</Typography>
        <InterfacesList interfaces={interfaces} iconMap={iconMap} onDelete={() => {}} onDragStart={onDragStart} />
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
          <Typography variant="h5">System Name</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onInit={setReactFlowInstance}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
}