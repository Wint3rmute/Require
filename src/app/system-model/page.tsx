"use client"
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import '@xyflow/react/dist/style.css';
import Typography from '@mui/material/Typography';
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

interface ChildSubsystem {
  subsystem: Subsystem,
  position: {
    x: number,
    y: number
  }
}

interface Subsystem {
  name: string,
  children: ChildSubsystem[]
  interfaces: Interface[]
}


const view: ChildSubsystem[] = [{
  position: { x: 10, y: 10 },
  subsystem: {
    name: "satellite",
    interfaces: [],
    children: [{
      position: { x: 0.0, y: 0.0 },
      subsystem: {
        name: "obc",
        children: [],
        interfaces: [{
          name: "spacewire"
        }
        ]
      }
    }]
  }
}, {
  position: { x: 10, y: 10 },
  subsystem: {
    name: "egse",
    interfaces: [],
    children: [
      {
        position: { x: 20.0, y: 30.0 },
        subsystem: {
          name: "star-dundee",
          interfaces: [{ name: "spacewire" }],
          children: []
        }
      }
    ]
  }
}

]

const SubsystemNode = ({ data }: { data: NodeResizerProps }) => {
  return (
    <div style={{ backgroundColor: "purple" }}>
      <NodeResizer minWidth={100} minHeight={30} isVisible={true} style={{ "background-color": "orange" }} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10, "background-color": "orange" }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div >
  );
};

function build_nodes_from_system_view(view: ChildSubsystem[], parent_id: string | null = null): Node[] {
  const nodes: Node[] = [];

  for (const parent of view) {
    if (parent_id !== null) {
      nodes.push({
        id: parent.subsystem.name,
        type: "subsystem",
        parentId: parent_id,
        extent: 'parent',
        position: parent.position,
        data: {
          label: parent.subsystem.name
        }
      })
    } else {
      nodes.push({
        id: parent.subsystem.name,
        position: { x: 0, y: 0 },
        type: "subsystem",
        data: {
          label: parent.subsystem.name
        }
      })
    }

    for (const iface of parent.subsystem.interfaces) {
      nodes.push({
        id: `${parent.subsystem.name}/${iface.name}`,
        type: "subsystem",
        parentId: parent.subsystem.name,
        position: { x: 40, y: 40 },
        data: {
          label: iface.name
        },
        extent: 'parent',
      })
    }

    nodes.push(
      ...build_nodes_from_system_view(parent.subsystem.children, parent.subsystem.name)
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
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
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
            onConnect={onConnect}
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
