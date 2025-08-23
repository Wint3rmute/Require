
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Toolbar, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
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
  DEFAULT_COMPONENT_SIZE,
  getCurrentSystemView,
  updateComponentPositionInSystemView,
  ensureProjectHasSystemViews,
  setCurrentSystemView,
  addSystemViewToProject
} from '@/lib/storage';
import { Component, getComponentPosition, isComponentVisible, createEmptySystemView } from '@/lib/models';

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

  // SystemView dialog state
  const [showSystemViewDialog, setShowSystemViewDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Ensure project has system views (migration helper)
  const migratedProject = useMemo(() => {
    return project ? ensureProjectHasSystemViews(project) : null;
  }, [project]);

  // Get current system view
  const currentSystemView = useMemo(() => {
    return migratedProject ? getCurrentSystemView(migratedProject) : null;
  }, [migratedProject]);

  // Convert project components to ReactFlow nodes using SystemView positions
  const nodes = useMemo(() => {
    if (!migratedProject || !currentSystemView) return [];
    
    return migratedProject.components
      .filter(component => isComponentVisible(component.id, currentSystemView))
      .map((component): Node => ({
        id: component.id,
        type: 'component',
        position: getComponentPosition(component, currentSystemView),
        data: { component },
        draggable: true,
      }));
  }, [migratedProject, currentSystemView]);

  // Convert project connections to ReactFlow edges
  const edges = useMemo(() => {
    if (!migratedProject) return [];
    
    return migratedProject.connections.map((connection): Edge => ({
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
  }, [migratedProject]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Only sync ReactFlow state when project actually changes (not during dragging)
  // This prevents unnecessary re-renders during drag operations
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

    // Handle component position changes
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    if (!migratedProject || !currentSystemView) return;
    
    onNodesChange(changes);
    
    // Update component positions in SystemView - but only when dragging ends
    // This prevents excessive localStorage writes during dragging
    const positionChanges = changes.filter((change): change is NodePositionChange => 
      change.type === 'position' && 
      'position' in change && 
      change.position !== undefined &&
      change.dragging === false // Only update when dragging ends
    );
    
    if (positionChanges.length > 0) {
      let updatedProject = migratedProject;
      
      positionChanges.forEach(change => {
        if (change.position) {
          updatedProject = updateComponentPositionInSystemView(
            updatedProject,
            currentSystemView.id,
            change.id,
            change.position
          );
        }
      });
      
      updateProject(updatedProject);
    }
  }, [migratedProject, currentSystemView, updateProject, onNodesChange]);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    if (!migratedProject || !connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
      return;
    }

    try {
      const updatedProject = createConnection(
        migratedProject,
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
  }, [migratedProject, updateProject]);

  // Handle drag and drop from interface list
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!migratedProject || !currentSystemView) return;

    const interfaceType = event.dataTransfer.getData('application/reactflow');
    const interfaceName = event.dataTransfer.getData('application/reactflow-name');

    if (!interfaceType || !interfaceName) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create new component with the dropped interface
    let updatedProject = addComponentToProject(migratedProject, {
      name: `New ${interfaceName} Component`,
      description: `Component with ${interfaceName} interface`,
      type: 'component',
      interfaces: [{
        id: generateId(),
        componentId: '', // Will be set by addComponentToProject
        interfaceDefinitionId: interfaceType,
        name: interfaceName,
        position: 'right',
        isConnected: false
      }]
    });

    // Update the position in the current system view
    const newComponent = updatedProject.components.find(c => 
      !migratedProject.components.some(existingC => existingC.id === c.id)
    );
    
    if (newComponent) {
      updatedProject = updateComponentPositionInSystemView(
        updatedProject,
        currentSystemView.id,
        newComponent.id,
        position
      );
    }

    updateProject(updatedProject);
  }, [migratedProject, currentSystemView, updateProject, screenToFlowPosition]);

  // Handle SystemView switching
  const handleSystemViewChange = useCallback((systemViewId: string) => {
    if (!migratedProject) return;
    
    const updatedProject = setCurrentSystemView(migratedProject, systemViewId);
    updateProject(updatedProject);
  }, [migratedProject, updateProject]);

  // Handle SystemView creation
  const handleCreateSystemView = useCallback(() => {
    if (!migratedProject || !newViewName.trim()) return;

    // Create positions for selected components in a grid layout
    const componentPositions: Record<string, { x: number; y: number }> = {};
    selectedComponents.forEach((componentId, index) => {
      const cols = Math.ceil(Math.sqrt(selectedComponents.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      componentPositions[componentId] = {
        x: col * 250 + 100,
        y: row * 150 + 100
      };
    });

    // Get all interfaces for selected components
    const visibleInterfaces = migratedProject.components
      .filter(c => selectedComponents.includes(c.id))
      .flatMap(c => c.interfaces.map(i => i.id));

    const newSystemView = createEmptySystemView(
      migratedProject.id,
      newViewName.trim(),
      newViewDescription.trim() || undefined
    );

    // Update the system view with selected components and positions
    newSystemView.componentPositions = componentPositions;
    newSystemView.visibleComponents = selectedComponents;
    newSystemView.visibleInterfaces = visibleInterfaces;

    const updatedProject = addSystemViewToProject(migratedProject, newSystemView);
    
    // Switch to the new view
    const finalProject = setCurrentSystemView(updatedProject, newSystemView.id);
    updateProject(finalProject);

    // Reset dialog state
    setShowSystemViewDialog(false);
    setNewViewName('');
    setNewViewDescription('');
    setSelectedComponents([]);
  }, [migratedProject, newViewName, newViewDescription, selectedComponents, updateProject]);

  // Handle opening the create dialog
  const handleOpenCreateDialog = useCallback(() => {
    if (!migratedProject) return;
    
    setNewViewName('');
    setNewViewDescription('');
    setSelectedComponents(migratedProject.components.map(c => c.id)); // Select all by default
    setShowSystemViewDialog(true);
  }, [migratedProject]);

  // Handle component selection in dialog
  const handleComponentToggle = useCallback((componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  }, []);

  if (!migratedProject) {
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* SystemView Selector Toolbar */}
      <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: 'divider', minHeight: '48px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          System Model
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>System View</InputLabel>
          <Select
            value={currentSystemView?.id || ''}
            label="System View"
            onChange={(e) => handleSystemViewChange(e.target.value)}
          >
            {migratedProject.systemViews?.map((view) => (
              <MenuItem key={view.id} value={view.id}>
                {view.name} ({view.visibleComponents.length} components)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          size="small" 
          sx={{ ml: 1 }}
          onClick={handleOpenCreateDialog}
        >
          New View
        </Button>
      </Toolbar>

      {/* ReactFlow Diagram */}
      <Box sx={{ flex: 1 }}>
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
      </Box>

      {/* SystemView Creation Dialog */}
      <Dialog 
        open={showSystemViewDialog} 
        onClose={() => setShowSystemViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New System View</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="View Name"
              fullWidth
              variant="outlined"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={newViewDescription}
              onChange={(e) => setNewViewDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Select Components to Show:
            </Typography>
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {migratedProject?.components.map((component) => (
                <ListItem 
                  key={component.id} 
                  onClick={() => handleComponentToggle(component.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedComponents.includes(component.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={component.name}
                    secondary={component.description || `${component.type} component`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSystemViewDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSystemView}
            variant="contained"
            disabled={!newViewName.trim() || selectedComponents.length === 0}
          >
            Create View
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
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
