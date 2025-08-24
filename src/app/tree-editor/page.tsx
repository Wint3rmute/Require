
'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Button,
  Dialog,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Component } from '@/lib/models';
import { 
  useProject, 
  useCurrentProjectId, 
  addComponentToProject,
  updateComponentInProject 
} from '@/lib/storage';
import TreeNodeComponent from '@/components/tree_node';
import ComponentForm from '@/components/component_form';

// Extend Component interface to include children for tree display
interface TreeComponent extends Component {
  children: TreeComponent[];
}

const TreeEditorPage = () => {
  const [currentProjectId] = useCurrentProjectId();
  const { project, updateProject } = useProject(currentProjectId || '');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Build hierarchy from flat component list
  const buildHierarchy = (components: Component[]): TreeComponent[] => {
    const rootComponents = components.filter(c => !c.parentId);
    
    const addChildren = (component: Component): TreeComponent => {
      const children = components.filter(c => c.parentId === component.id);
      return {
        ...component,
        children: children.map(addChildren)
      };
    };
    
    return rootComponents.map(addChildren);
  };

  const hierarchicalComponents = project ? buildHierarchy(project.components) : [];

  const handleAddComponent = (componentData: Omit<Component, 'id'>) => {
    if (!project) return;

    const updatedProject = addComponentToProject(project, componentData);
    updateProject(updatedProject);
    
    // Reset form
    setShowAddDialog(false);
  };

  const handleUpdateComponent = (componentId: string, updates: Partial<Component>) => {
    if (!project) return;
    
    const updatedProject = updateComponentInProject(project, componentId, updates);
    updateProject(updatedProject);
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!project) return;
    
    // Remove component and any children
    const removeComponentAndChildren = (components: Component[], idToRemove: string): Component[] => {
      return components.filter(c => {
        if (c.id === idToRemove) return false;
        if (c.parentId === idToRemove) return false;
        return true;
      });
    };
    
    const updatedComponents = removeComponentAndChildren(project.components, componentId);
    const updatedProject = { ...project, components: updatedComponents };
    updateProject(updatedProject);
  };

  const handleMoveComponent = (componentId: string, direction: 'up' | 'down') => {
    if (!project) return;
    
    const component = project.components.find(c => c.id === componentId);
    if (!component) return;
    
    const siblings = project.components.filter(c => c.parentId === component.parentId);
    const currentIndex = siblings.findIndex(c => c.id === componentId);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
      newIndex = currentIndex + 1;
    }
    
    if (newIndex !== currentIndex) {
      // This is a simplified move - in a real implementation you'd want to 
      // update the order or add an explicit ordering field
      console.log(`Moving component ${componentId} ${direction}`);
    }
  };

  if (!currentProjectId) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="info">
            Please select or create a project from the System Model page to manage the component hierarchy.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">
            Project not found. Please select a valid project.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Component Hierarchy
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Project: {project.name} • Manage component tree structure and relationships
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{ mb: 2 }}
          >
            Add Component
          </Button>
          
          {hierarchicalComponents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No components yet. Add your first component to get started.
            </Typography>
          ) : (
            <Box>
              {hierarchicalComponents.map((component, index) => (
                <TreeNodeComponent
                  key={component.id}
                  component={component}
                  onUpdate={handleUpdateComponent}
                  onDelete={handleDeleteComponent}
                  onMove={handleMoveComponent}
                  isFirst={index === 0}
                  isLast={index === hierarchicalComponents.length - 1}
                  allComponents={project.components}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Add Component Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <ComponentForm 
          onSubmit={handleAddComponent}
          onCancel={() => setShowAddDialog(false)}
          availableParents={project?.components || []}
        />
      </Dialog>
    </Container>
  );
};

export default TreeEditorPage;
