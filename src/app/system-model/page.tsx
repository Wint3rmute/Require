"use client"
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import '@xyflow/react/dist/style.css';
import Typography from '@mui/material/Typography';
import InterfacesList from '@/components/interfaces_list_DRAFT';
import SystemEditor from '@/components/system_editor';
import Paper from '@mui/material/Paper';
import { useState, useCallback } from 'react';
import {
  ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Edge, Node, NodeResizerProps,

  Background,
  BackgroundVariant,

} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const initialEdges: Edge[] = [];

interface Interface {
  name: string
}

interface Subsystem {
  name: string,
  children: Subsystem[]
  interfaces: Interface[]
}


const view: Subsystem[] = [
  {
    name: "satellite",
    interfaces: [],
    children: [
      {
        name: "obc",
        children: [],
        interfaces: [{
          name: "spacewire"
        }
        ]
      }
    ]
  },
  {
    name: "egse",
    interfaces: [],
    children: [
      {
        name: "star-dundee",
        interfaces: [{ name: "spacewire" }],
        children: []
      }
    ]
  }

]

const SubsystemNode = ({ data, selected }: { data: NodeResizerProps, selected: boolean }) => {
  return (
    <div style={{ backgroundColor: "purple" }}>
      <NodeResizer minWidth={100} minHeight={30} isVisible={selected} style={{ "background-color": "orange" }} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10, "background-color": "orange" }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div >
  );
};

function build_nodes_from_system_view(view: Subsystem[], parent_id: string | null = null): Node[] {
  const nodes: Node[] = [];

  for (const parent of view) {
    if (parent_id !== null) {
      nodes.push({
        id: parent.name,
        type: "subsystem",
        parentId: parent_id,
        extent: 'parent',
        position: { x: 0, y: 0 },
        data: {
          label: parent.name
        }
      })
    } else {
      nodes.push({
        id: parent.name,
        position: { x: 0, y: 0 },
        type: "subsystem",
        data: {
          label: parent.name
        }
      })
    }

    for (const iface of parent.interfaces) {
      nodes.push({
        id: `${parent.name}/${iface.name}`,
        parentId: parent.name,
        position: { x: 0, y: 0 },
        data: {
          label: iface.name
        },
        extent: 'parent',
      })
    }

    nodes.push(
      ...build_nodes_from_system_view(parent.children, parent.name)
    )

  }

  return nodes;
}
const initialNodes: Node[] = build_nodes_from_system_view(view);

const nodeTypes = {
  subsystem: SubsystemNode
}

export default function SystemModel() {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>

        <div style={{ width: '80vw', height: '80vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
      </Grid>
    </Box>
  );
}
