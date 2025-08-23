/**
 * System Health Dashboard
 * 
 * Displays project status and metrics:
 * - Definition completeness
 * - Compatibility issues
 * - Orphaned components
 * - Overall project health
 */

'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import {
  useCurrentProjectId,
  useProject,
  calculateProjectCompleteness,
  findOrphanedComponents,
  getCompatibilityIssues
} from '@/lib/storage';

function HealthMetric({ 
  title, 
  value, 
  total, 
  color, 
  description 
}: { 
  title: string; 
  value: number; 
  total?: number; 
  color: 'success' | 'warning' | 'error' | 'info';
  description: string;
}) {
  const percentage = total ? (value / total) * 100 : value;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" color={`${color}.main`}>
            {total ? `${value}/${total}` : `${value}${title.includes('%') ? '%' : ''}`}
          </Typography>
        </Box>
        {total && (
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            color={color}
            sx={{ mb: 1 }}
          />
        )}
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function SystemHealthDashboard() {
  const [currentProjectId] = useCurrentProjectId();
  const { project } = useProject(currentProjectId);

  if (!currentProjectId || !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Select a project to view system health metrics
        </Alert>
      </Box>
    );
  }

  const completeness = calculateProjectCompleteness(project);
  const orphanedComponents = findOrphanedComponents(project);
  const compatibilityIssues = getCompatibilityIssues(project);
  const fullyDefinedConnections = project.connections.filter(c => c.isFullyDefined).length;

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Health: {project.name}
      </Typography>

      {/* Metrics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3, 
        mb: 4 
      }}>
        <HealthMetric
          title="Definition Completeness"
          value={completeness}
          color={getCompletenessColor(completeness)}
          description="Percentage of fully defined connections"
        />

        <HealthMetric
          title="Components"
          value={project.components.length}
          color="info"
          description="Total components in the system"
        />

        <HealthMetric
          title="Connections"
          value={fullyDefinedConnections}
          total={project.connections.length}
          color={project.connections.length > 0 ? 'success' : 'warning'}
          description="Fully defined vs total connections"
        />

        <HealthMetric
          title="Compatibility Issues"
          value={compatibilityIssues.length}
          color={compatibilityIssues.length === 0 ? 'success' : 'error'}
          description="Interface compatibility problems"
        />
      </Box>

      {/* Issues and Warnings */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Compatibility Issues */}
        {compatibilityIssues.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                Compatibility Issues ({compatibilityIssues.length})
              </Typography>
              <List dense>
                {compatibilityIssues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ErrorIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={issue.message}
                      secondary={`Connection: ${issue.connectionId}`}
                    />
                    <Chip 
                      label={issue.severity} 
                      color={issue.severity === 'error' ? 'error' : 'warning'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Orphaned Components */}
        {orphanedComponents.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                Orphaned Components ({orphanedComponents.length})
              </Typography>
              <List dense>
                {orphanedComponents.map((component) => (
                  <ListItem key={component.id}>
                    <ListItemIcon>
                      <WarningIcon color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={component.name}
                      secondary={`${component.type} - No connections`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {compatibilityIssues.length === 0 && orphanedComponents.length === 0 && project.connections.length > 0 && (
          <Alert severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            System is healthy! No compatibility issues or orphaned components detected.
          </Alert>
        )}

        {/* Empty State */}
        {project.connections.length === 0 && (
          <Alert severity="info">
            <InfoIcon sx={{ mr: 1 }} />
            No connections yet. Start connecting components to see system health metrics.
          </Alert>
        )}
      </Box>
    </Box>
  );
}
