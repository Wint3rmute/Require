
'use client';

import React, { useState } from 'react';
import TreeNodeComponent from '@/components/tree_node';
import { Box, Container, Typography } from '@mui/material';

export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}

const TreeEditorPage = () => {
  const [root, setRoot] = useState<TreeNode>({
    id: 'root',
    label: 'Root',
    children: [],
  });

  const handleAddChild = (parentId: string) => {
    const addChildRecursive = (node: TreeNode): TreeNode => {
      if (node.id === parentId) {
        const newNode: TreeNode = {
          id: `${parentId}-${node.children.length}`,
          label: `New Node ${node.children.length + 1}`,
          children: [],
        };
        return { ...node, children: [...node.children, newNode] };
      }
      return { ...node, children: node.children.map(addChildRecursive) };
    };
    setRoot(addChildRecursive(root));
  };

  const handleUpdateLabel = (nodeId: string, newLabel: string) => {
    const updateLabelRecursive = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return { ...node, label: newLabel };
      }
      return { ...node, children: node.children.map(updateLabelRecursive) };
    };
    setRoot(updateLabelRecursive(root));
  };

  const handleDeleteNode = (nodeId: string) => {
    const deleteNodeRecursive = (node: TreeNode): TreeNode | null => {
      if (node.id === nodeId) {
        if (node.id === 'root') return node;
        return null;
      }
      const newChildren = node.children.map(deleteNodeRecursive).filter((child): child is TreeNode => child !== null);
      return { ...node, children: newChildren };
    };
    const newRoot = deleteNodeRecursive(root);
    if (newRoot) {
      setRoot(newRoot);
    }
  };

  const handleMoveNode = (nodeId: string, direction: 'up' | 'down') => {
    const moveNodeRecursive = (node: TreeNode): TreeNode => {
      const childIndex = node.children.findIndex(c => c.id === nodeId);
      if (childIndex !== -1) {
        const newChildren = [...node.children];
        const [movedNode] = newChildren.splice(childIndex, 1);
        if (movedNode) {
          if (direction === 'up') {
            newChildren.splice(childIndex - 1, 0, movedNode);
          } else {
            newChildren.splice(childIndex + 1, 0, movedNode);
          }
        }
        return { ...node, children: newChildren };
      }
      return { ...node, children: node.children.map(moveNodeRecursive) };
    };
    setRoot(moveNodeRecursive(root));
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tree Editor
        </Typography>
        <TreeNodeComponent
          node={root}
          onAddChild={handleAddChild}
          onUpdateLabel={handleUpdateLabel}
          onDelete={handleDeleteNode}
          onMove={handleMoveNode}
          isFirst={true}
          isLast={true}
        />
      </Box>
    </Container>
  );
};

export default TreeEditorPage;
