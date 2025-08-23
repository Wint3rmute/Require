
'use client';

import React, { useState } from 'react';
import { Component } from '@/lib/models';
import { useInterfaces } from '@/lib/storage';
import { 
  Box, 
  IconButton, 
  TextField, 
  Typography, 
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  ArrowDropDown, 
  ArrowRight, 
  ArrowUpward, 
  ArrowDownward,
  Cable
} from '@mui/icons-material';

// Extend Component interface to include children for tree display
interface TreeComponent extends Component {
  children?: TreeComponent[];
}

interface TreeNodeProps {
  component: TreeComponent;
  onUpdate: (componentId: string, updates: Partial<Component>) => void;
  onDelete: (componentId: string) => void;
  onMove: (componentId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  allComponents: Component[];
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ 
  component, 
  onUpdate, 
  onDelete, 
  onMove, 
  isFirst, 
  isLast,
  allComponents 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(component.name);
  const [isExpanded, setIsExpanded] = useState(true);
  const [interfacesExpanded, setInterfacesExpanded] = useState(false);
  const [interfaces] = useInterfaces();

  const handleUpdate = () => {
    if (newName.trim() !== component.name) {
      onUpdate(component.id, { name: newName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setNewName(component.name);
      setIsEditing(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'primary';
      case 'component': return 'default';
      default: return 'default';
    }
  };

  const hasChildren = component.children && component.children.length > 0;
  const interfaceCount = component.interfaces?.length || 0;

  // Helper function to get interface definition from global interfaces
  const getInterfaceDefinition = (interfaceDefinitionId: string) => {
    return interfaces.find(iface => iface.id === interfaceDefinitionId);
  };

  return (
    <Box sx={{ pl: 2, borderLeft: '1px solid #e0e0e0', mb: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 0.5,
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        borderRadius: 1,
        px: 1
      }}>
        {/* Expand/Collapse Button */}
        <IconButton 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)} 
          disabled={!hasChildren}
          sx={{ mr: 1 }}
        >
          {hasChildren ? (
            isExpanded ? <ArrowDropDown /> : <ArrowRight />
          ) : (
            <Box sx={{ width: 24 }} />
          )}
        </IconButton>

        {/* Component Name/Edit Field */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? (
            <TextField
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={handleKeyPress}
              size="small"
              variant="standard"
              autoFocus
              sx={{ flexGrow: 1 }}
            />
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {component.name}
              </Typography>
              <Chip 
                label={component.type} 
                size="small" 
                color={getTypeColor(component.type) as 'primary' | 'secondary' | 'default'}
                variant="outlined"
              />
              {interfaceCount > 0 && (
                <Tooltip title={`${interfaceCount} interface${interfaceCount !== 1 ? 's' : ''} - click to ${interfacesExpanded ? 'hide' : 'show'}`}>
                  <Chip 
                    icon={<Cable />}
                    label={interfaceCount} 
                    size="small" 
                    variant="outlined"
                    onClick={() => setInterfacesExpanded(!interfacesExpanded)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
            </>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit name">
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Move up">
            <IconButton 
              size="small" 
              onClick={() => onMove(component.id, 'up')} 
              disabled={isFirst}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Move down">
            <IconButton 
              size="small" 
              onClick={() => onMove(component.id, 'down')} 
              disabled={isLast}
            >
              <ArrowDownward />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete component">
            <IconButton 
              size="small" 
              onClick={() => onDelete(component.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Component Description */}
      {component.description && (
        <Box sx={{ pl: 4, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {component.description}
          </Typography>
        </Box>
      )}

      {/* Interfaces List */}
      {interfacesExpanded && interfaceCount > 0 && (
        <Box sx={{ pl: 4, pb: 1 }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, mb: 1 }}>
            Interfaces:
          </Typography>
          <List dense sx={{ pt: 0 }}>
            {component.interfaces.map((componentInterface) => {
              const interfaceDefinition = getInterfaceDefinition(componentInterface.interfaceDefinitionId);
              return (
                <ListItem key={componentInterface.id} sx={{ py: 0.25, pl: 2 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Cable sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={componentInterface.name}
                    secondary={interfaceDefinition?.name || 'Unknown Interface'}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  {componentInterface.isConnected && (
                    <Chip 
                      label="Connected" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ height: 16, fontSize: '0.65rem' }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}

      {/* Children */}
      {isExpanded && hasChildren && (
        <Box sx={{ pl: 1 }}>
          {component.children!.map((child, index) => (
            <TreeNodeComponent
              key={child.id}
              component={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMove={onMove}
              isFirst={index === 0}
              isLast={index === component.children!.length - 1}
              allComponents={allComponents}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TreeNodeComponent;
