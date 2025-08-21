
'use client';

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const initialInterfaces = [
  { id: '1', name: 'Interface 1' },
  { id: '2', name: 'Interface 2' },
  { id: '3', name: 'Interface 3' },
];

export default function InterfacesList() {
  const [interfaces, setInterfaces] = useState(initialInterfaces);
  const [newInterfaceName, setNewInterfaceName] = useState('');

  const handleAddInterface = () => {
    if (newInterfaceName.trim() !== '') {
      const newInterface = {
        id: (interfaces.length + 1).toString(),
        name: newInterfaceName.trim(),
      };
      setInterfaces([...interfaces, newInterface]);
      setNewInterfaceName('');
    }
  };

  const handleRemoveInterface = (id: string) => {
    setInterfaces(interfaces.filter((iface) => iface.id !== id));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-name', nodeName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="New Interface"
          value={newInterfaceName}
          onChange={(e) => setNewInterfaceName(e.target.value)}
          size="small"
          variant="outlined"
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleAddInterface}
          startIcon={<Add />}
        >
          Add
        </Button>
      </Box>
      <List>
        {interfaces.map((iface) => (
          <ListItem
            key={iface.id}
            onDragStart={(event) => onDragStart(event, 'default', iface.name)}
            draggable
            sx={{
              cursor: 'grab',
              backgroundColor: 'background.paper',
              marginBottom: 1,
              borderRadius: 1,
            }}
          >
            <ListItemText primary={iface.name} />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleRemoveInterface(iface.id)}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
