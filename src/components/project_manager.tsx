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
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import {
  useProjects,
  useCurrentProjectId,
  createNewProject,
  calculateProjectCompleteness,
  findOrphanedComponents,
  getCompatibilityIssues
} from '@/lib/storage';
import { Project } from '@/lib/data-models';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

function ProjectCard({ project, isSelected, onSelect, onDelete }: ProjectCardProps) {
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

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
}

function CreateProjectDialog({ open, onClose, onSubmit }: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
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
        />
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

export default function ProjectManager() {
  const [projects, setProjects] = useProjects();
  const [currentProjectId, setCurrentProjectId] = useCurrentProjectId();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateProject = (name: string, description?: string) => {
    const newProject = createNewProject(name, description);
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    // If we deleted the current project, clear the selection
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
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
          onClick={() => setDialogOpen(true)}
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
            onClick={() => setDialogOpen(true)}
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
                onDelete={handleDeleteProject}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateProject}
      />
    </Box>
  );
}
