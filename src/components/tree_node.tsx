
'use client';

import React, { useState } from 'react';
import { TreeNode } from '@/app/tree-editor/page';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Add, Delete, Edit, ArrowDropDown, ArrowRight, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface TreeNodeProps {
  node: TreeNode;
  onAddChild: (parentId: string) => void;
  onUpdateLabel: (nodeId: string, newLabel: string) => void;
  onDelete: (nodeId: string) => void;
  onMove: (nodeId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, onAddChild, onUpdateLabel, onDelete, onMove, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(node.label);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = () => {
    onUpdateLabel(node.id, newLabel);
    setIsEditing(false);
  };

  const isRoot = node.id === 'root';

  return (
    <Box sx={{ pl: 2, borderLeft: '1px solid #ccc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)} disabled={node.children.length === 0}>
          {isExpanded ? <ArrowDropDown /> : <ArrowRight />}
        </IconButton>
        {isEditing ? (
          <TextField
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onBlur={handleUpdate}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            size="small"
            variant="standard"
            autoFocus
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {node.label}
          </Typography>
        )}
        <IconButton size="small" onClick={() => onAddChild(node.id)}>
          <Add />
        </IconButton>
        <IconButton size="small" onClick={() => setIsEditing(true)} disabled={isRoot}>
          <Edit />
        </IconButton>
        {!isRoot && (
          <>
            <IconButton size="small" onClick={() => onMove(node.id, 'up')} disabled={isFirst}>
              <ArrowUpward />
            </IconButton>
            <IconButton size="small" onClick={() => onMove(node.id, 'down')} disabled={isLast}>
              <ArrowDownward />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(node.id)}>
              <Delete />
            </IconButton>
          </>
        )}
      </Box>
      {isExpanded && (
        <Box sx={{ pl: 2 }}>
          {node.children.map((child, index) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onAddChild={onAddChild}
              onUpdateLabel={onUpdateLabel}
              onDelete={onDelete}
              onMove={onMove}
              isFirst={index === 0}
              isLast={index === node.children.length - 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TreeNodeComponent;
