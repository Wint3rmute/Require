/**
 * Project Management Component
 * 
 * Provides UI for:
 * - Creating new projects
 * - Listing existing projects
 * - Selecting current project
 * - Basic project metadata
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Chip,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import {
  useProjects,
  useCurrentProjectId,
  createNewProject,
  createCarTemplate,
  calculateProjectCompleteness,
  findOrphanedComponents,
  getCompatibilityIssues
} from '@/lib/storage';
import { Project } from '@/lib/models';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onEdit: (projectId: string) => void;
}

function ProjectCard({ project, isSelected, onSelect, onDelete, onEdit }: ProjectCardProps) {
  const completeness = calculateProjectCompleteness(project);
  const orphanedComponents = findOrphanedComponents(project);
  const compatibilityIssues = getCompatibilityIssues(project);
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3
        }
      }}
      onClick={() => onSelect(project.id)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {project.name}
          </Typography>
          {isSelected && (
            <Chip label="Active" color="primary" size="small" />
          )}
        </Box>
        
        {project.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Components: {project.components.length} | Connections: {project.connections.length}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label={`${completeness}% Complete`} 
            size="small" 
            color={completeness > 80 ? 'success' : completeness > 50 ? 'warning' : 'error'}
          />
          
          {orphanedComponents.length > 0 && (
            <Chip 
              label={`${orphanedComponents.length} Orphaned`} 
              size="small" 
              color="warning" 
            />
          )}
          
          {compatibilityIssues.length > 0 && (
            <Chip 
              label={`${compatibilityIssues.length} Issues`} 
              size="small" 
              color="error" 
            />
          )}
        </Box>
      </CardContent>
      
      <CardActions>
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project.id);
          }}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string, useTemplate?: boolean) => void;
}

interface EditProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  initialName: string;
  initialDescription: string;
}

export function CreateProjectDialog({ open, onClose, onSubmit }: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined, useTemplate);
      setName('');
      setDescription('');
      setUseTemplate(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description (Optional)"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
            />
          }
          label="Use Car Template"
          sx={{ mb: 1 }}
        />
        
        {useTemplate && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Creates a project with automotive components including Engine, Transmission, 
            Electrical System, Braking, Steering, Infotainment, and Body Control modules 
            to help you explore the system modeling features.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditProjectDialog({ open, onClose, onSubmit, initialName, initialDescription }: EditProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when dialog opens with initial values
  React.useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [open, initialName, initialDescription]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description (Optional)"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ProjectManager() {
  const [projects, setProjects] = useProjects();
  const [currentProjectId, setCurrentProjectId] = useCurrentProjectId();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // State for deletion confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // State for editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleCreateProject = (name: string, description?: string, useTemplate?: boolean) => {
    const newProject = useTemplate 
      ? createCarTemplate(name, description)
      : createNewProject(name, description);
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      const updatedProjects = projects.filter(p => p.id !== projectToDelete);
      setProjects(updatedProjects);
      
      // If we deleted the current project, clear the selection
      if (currentProjectId === projectToDelete) {
        setCurrentProjectId(null);
      }
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleEditClick = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectToEdit(project);
      setEditDialogOpen(true);
    }
  };

  const handleEditSubmit = (name: string, description?: string) => {
    if (projectToEdit) {
      const updatedProjects = projects.map(p => 
        p.id === projectToEdit.id 
          ? { ...p, name, ...(description ? { description } : {}) } 
          : p
      );
      setProjects(updatedProjects);
    }
    setEditDialogOpen(false);
    setProjectToEdit(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setProjectToEdit(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'text.secondary'
        }}>
          <FolderIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No Projects Yet
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Create your first project to start system modeling
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create First Project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <ProjectCard
                project={project}
                isSelected={currentProjectId === project.id}
                onSelect={handleSelectProject}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateProject}
      />

      <EditProjectDialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        onSubmit={handleEditSubmit}
        initialName={projectToEdit?.name || ''}
        initialDescription={projectToEdit?.description || ''}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this project? This action cannot be undone and will remove all components and connections.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
