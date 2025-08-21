"use client"

import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createInterfaceDefinition } from '@/lib/db';

export function CreateInterfaceForm({ project_name }: { project_name: string }) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  return <Box
    component="form"
    action={createInterfaceDefinition}
    sx={{
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 2,
      boxShadow: 1,
      mb: 4,
    }}
  >
    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
      Create New Interface
    </Typography>
    <TextField
      fullWidth
      label="Project Name"
      variant="outlined"
      value={project_name}
      disabled={true}
      sx={{ mb: 2 }} />
    <TextField
      fullWidth
      label="Interface Name"
      variant="outlined"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      sx={{ mb: 2 }} />
    <TextField
      fullWidth
      label="Description"
      variant="outlined"
      value={newDescription}
      onChange={(e) => setNewDescription(e.target.value)}
      multiline
      rows={3}
      sx={{ mb: 2 }} />
    <Button type="submit" variant="contained" color="primary">
      Add Interface
    </Button>
  </Box>;
}
