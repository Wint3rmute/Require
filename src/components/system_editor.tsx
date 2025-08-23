
'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  useReactFlow,
  NodeChange,
  NodePositionChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { 
  useCurrentProjectId, 
  useProject, 
  addComponentToProject,
  createConnection,
  generateId,
  DEFAULT_COMPONENT_SIZE
} from '@/lib/storage';
import { Component } from '@/lib/data-models';

// ========================================
// Custom Node Components
// ========================================

interface ComponentNodeData {
  component: Component;
  onAddInterface?: (componentId: string) => void;
}

const ComponentNode = ({ data }: { data: ComponentNodeData }) => {
  const { component } = data;
  
  return (
    <>
      <NodeResizer 
        minWidth={DEFAULT_COMPONENT_SIZE.width} 
        minHeight={DEFAULT_COMPONENT_SIZE.height} 
        isVisible={true} 
      />
      
      {/* Render interface handles */}
      {component.interfaces.map((iface, index) => {
        const position = getHandlePosition(iface.position);
        const offset = calculateInterfaceOffset(iface.position, index, component.interfaces.length);
        
        return (
          <Handle
            key={iface.id}
            id={iface.id}
            type="source"
            position={position}
            style={{
              ...offset,
              background: iface.isConnected ? '#10b981' : '#6b7280',
              border: '2px solid #fff'
            }}
            title={iface.name}
          />
        );
      })}
      
      <div style={{ 
        padding: '10px', 
        background: 'white', 
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        minHeight: DEFAULT_COMPONENT_SIZE.height - 20
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {component.name}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {component.type}
        </div>
        {component.description && (
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
            {component.description}
          </div>
        )}
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px' }}>
          Interfaces: {component.interfaces.length}
        </div>
      </div>
    </>
  );
};

// Helper functions for interface positioning
function getHandlePosition(position: 'left' | 'right' | 'top' | 'bottom'): Position {
  switch (position) {
    case 'left': return Position.Left;
    case 'right': return Position.Right;
    case 'top': return Position.Top;
    case 'bottom': return Position.Bottom;
  }
}

function calculateInterfaceOffset(
  position: 'left' | 'right' | 'top' | 'bottom', 
  index: number, 
  total: number
) {
  const spacing = 30;
  const start = -(total - 1) * spacing / 2;
  const offset = start + (index * spacing);
  
  if (position === 'left' || position === 'right') {
    return { top: `calc(50% + ${offset}px)` };
  } else {
    return { left: `calc(50% + ${offset}px)` };
  }
}

const nodeTypes = {
  component: ComponentNode,
};

// ========================================
// Main SystemEditor Flow Component
// ========================================

interface SystemEditorFlowProps {
  projectId: string;
}

function SystemEditorFlow({ projectId }: SystemEditorFlowProps) {
  const { project, updateProject } = useProject(projectId);
  const { screenToFlowPosition } = useReactFlow();

  // Convert project components to ReactFlow nodes
  const nodes = useMemo(() => {
    if (!project) return [];
    
    return project.components.map((component): Node => ({
      id: component.id,
      type: 'component',
      position: component.position,
      data: { component },
      draggable: true,
    }));
  }, [project]);

  // Convert project connections to ReactFlow edges
  const edges = useMemo(() => {
    if (!project) return [];
    
    return project.connections.map((connection): Edge => ({
      id: connection.id,
      source: connection.sourceComponentId,
      target: connection.targetComponentId,
      sourceHandle: connection.sourceInterfaceId,
      targetHandle: connection.targetInterfaceId,
      style: {
        stroke: connection.compatibilityStatus === 'compatible' ? '#10b981' : 
               connection.compatibilityStatus === 'incompatible' ? '#ef4444' : '#f59e0b',
        strokeWidth: 2,
      },
      label: connection.isFullyDefined ? '✓' : '?',
      labelStyle: { 
        background: 'white', 
        padding: '2px 4px', 
        borderRadius: '4px',
        fontSize: '12px'
      }
    }));
  }, [project]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Sync ReactFlow state with project data
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

    // Handle component position changes
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    if (!project) return;
    
    onNodesChange(changes);
    
    // Update component positions in project
    const positionChanges = changes.filter((change): change is NodePositionChange => 
      change.type === 'position' && 'position' in change && change.position !== undefined
    );
    
    if (positionChanges.length > 0) {
      const updatedProject = { ...project };
      
      positionChanges.forEach(change => {
        const component = updatedProject.components.find(c => c.id === change.id);
        if (component && change.position) {
          const componentIndex = updatedProject.components.findIndex(c => c.id === change.id);
          updatedProject.components[componentIndex] = {
            ...component,
            position: change.position
          };
        }
      });
      
      updateProject(updatedProject);
    }
  }, [project, updateProject, onNodesChange]);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (!project || !connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      return;
    }

    try {
      const updatedProject = createConnection(
        project,
        connection.source,
        connection.sourceHandle,
        connection.target,
        connection.targetHandle
      );
      updateProject(updatedProject);
    } catch (error) {
      console.error('Failed to create connection:', error);
      // TODO: Show user-friendly error message
    }
  }, [project, updateProject]);

  // Handle drag and drop from interface list
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!project) return;

    const interfaceType = event.dataTransfer.getData('application/reactflow');
    const interfaceName = event.dataTransfer.getData('application/reactflow-name');

    if (!interfaceType || !interfaceName) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create new component with the dropped interface
    const updatedProject = addComponentToProject(project, {
      name: `New ${interfaceName} Component`,
      description: `Component with ${interfaceName} interface`,
      type: 'component',
      position,
      interfaces: [{
        id: generateId(),
        componentId: '', // Will be set by addComponentToProject
        interfaceDefinitionId: interfaceType,
        name: interfaceName,
        position: 'right',
        isConnected: false
      }]
    });

    updateProject(updatedProject);
  }, [project, updateProject, screenToFlowPosition]);

  if (!project) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#6b7280'
      }}>
        No project selected. Create or select a project to start modeling.
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={reactFlowNodes}
      edges={reactFlowEdges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
      fitViewOptions={{ padding: 0.2 }}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
}

// ========================================
// Main SystemEditor Component
// ========================================

export default function SystemEditor() {
  const [currentProjectId] = useCurrentProjectId();

  if (!currentProjectId) {
    return (
      <div style={{ 
        height: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f9fafb',
        border: '2px dashed #d1d5db',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>
            No Project Selected
          </div>
          <div style={{ fontSize: '14px' }}>
            Create or select a project to start system modeling
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '70vh' }}>
      <ReactFlowProvider>
        <SystemEditorFlow projectId={currentProjectId} />
      </ReactFlowProvider>
    </div>
  );
}
