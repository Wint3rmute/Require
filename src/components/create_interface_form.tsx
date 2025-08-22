"use client"

import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { z } from 'zod';

const InterfaceFormSchema = z.object({
  project_name: z.string(),
  interface_name: z.string().min(3, "Interface name must be at least 3 characters long."),
  description: z.string().min(5, "Description must be at least 5 characters long."),
});

export type InterfaceFormData = z.infer<typeof InterfaceFormSchema>;

type Errors = z.inferFlattenedErrors<typeof InterfaceFormSchema>;

export function CreateInterfaceForm({
  project_name,
  onInterfaceSubmit
}: {
  project_name: string,
  onInterfaceSubmit: (data: InterfaceFormData) => void
}) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [errors, setErrors] = useState<Errors | null>(null);

  const handleFormSubmit = (formData: FormData) => {
    const data = {
      project_name: formData.get('project_name') as string,
      interface_name: formData.get('interface_name') as string,
      description: formData.get('description') as string,
    };

    const result = InterfaceFormSchema.safeParse(data);

    if (result.success) {
      onInterfaceSubmit(result.data);
      setNewName('');
      setNewDescription('');
      setErrors(null);
    } else {
      setErrors(result.error.flatten());
    }
  };

  return <Box
    component="form"
    action={handleFormSubmit}
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
    <input type="hidden" name="project_name" value={project_name} />
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
      name="interface_name"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      sx={{ mb: 2 }}
      error={!!errors?.fieldErrors.interface_name}
      helperText={errors?.fieldErrors.interface_name?.[0]}
    />
    <TextField
      fullWidth
      label="Description"
      variant="outlined"
      name="description"
      value={newDescription}
      onChange={(e) => setNewDescription(e.target.value)}
      multiline
      rows={3}
      sx={{ mb: 2 }}
      error={!!errors?.fieldErrors.description}
      helperText={errors?.fieldErrors.description?.[0]}
    />
    <Button type="submit" variant="contained" color="primary">
      Add Interface
    </Button>
  </Box>;
}