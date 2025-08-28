'use client';

import React from 'react';
import { Container, Box, Typography, Alert, Paper } from '@mui/material';
import { useCurrentProjectId, useProject } from '@/lib/storage';
import MermaidDiagram from '@/components/mermaid_diagram';

/**
 * Mermaid Diagram Page
 * 
 * Displays a Mermaid flowchart diagram of the system component hierarchy
 * for the currently selected project.
 */
export default function MermaidDiagramPage() {
  const [currentProjectId] = useCurrentProjectId();
  const { project } = useProject(currentProjectId);

  if (!currentProjectId) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="info">
            Please select or create a project from the System Model page to view the component hierarchy diagram.
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
          System Hierarchy Diagram
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Project: {project.name} • Mermaid flowchart visualization of component relationships
        </Typography>
        
        <Paper sx={{ p: 2, mt: 2 }}>
          <MermaidDiagram project={project} />
        </Paper>
      </Box>
    </Container>
  );
}