'use client';

import React from 'react';
import { Box } from '@mui/material';
import ProjectManager from '@/components/project_manager';
import SystemEditor from '@/components/system_editor';
import { useCurrentProjectId } from '@/lib/storage';

export default function SystemModel() {
  const [currentProjectId] = useCurrentProjectId();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentProjectId ? (
        // Show the system editor when a project is selected
        <SystemEditor />
      ) : (
        // Show project manager when no project is selected
        <ProjectManager />
      )}
    </Box>
  );
}