/**
 * Landing Page Component
 * 
 * Displays a welcome page for users who don't have any projects yet.
 * Introduces the application and provides a prominent call-to-action
 * to create their first project.
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountTree as SystemIcon,
  Cable as InterfaceIcon,
  Timeline as TracingIcon,
  Add as AddIcon,
  Psychology as ModelingIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { CreateProjectDialog } from './project_manager';

interface LandingPageProps {
  onCreateProject: (name: string, description?: string, useTemplate?: boolean) => void;
}

export default function LandingPage({ onCreateProject }: LandingPageProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateProject = (name: string, description?: string, useTemplate?: boolean) => {
    onCreateProject(name, description, useTemplate);
    setCreateDialogOpen(false);
  };

  const features = [
    {
      icon: <SystemIcon />,
      title: 'System Decomposition',
      description: 'Break down complex systems into components with multiple nesting levels',
    },
    {
      icon: <InterfaceIcon />,
      title: 'Interface Management',
      description: 'Define reusable interfaces like USB, CAN, UART and manage connections between components',
    },
    {
      icon: <TracingIcon />,
      title: 'Requirements Tracing',
      description: 'Map requirements to your system model and maintain traceability throughout development',
    },
    {
      icon: <ModelingIcon />,
      title: 'Interactive Diagrams',
      description: 'Generate and explore interactive system diagrams with React Flow visualization',
    },
  ];

  const benefits = [
    'Start with incomplete models and gradually make them fully defined',
    'Check interface compatibility between components',
    'Track system completeness and identify gaps',
    'Visualize complex system architectures',
    'Maintain requirements traceability',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to Require
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          System Modeling & Requirements Tracing Application
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Require helps you define, decompose, and trace complex systems. Start by creating your first project
          to begin modeling your system architecture with components, interfaces, and connections.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          Create Your First Project
        </Button>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3">
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Benefits Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          What You Can Do
        </Typography>
        <List>
          {benefits.map((benefit, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={benefit} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Getting Started */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first project and start modeling your system architecture
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Project
        </Button>
      </Box>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateProject}
      />
    </Container>
  );
}