import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { Project } from '@/generated/prisma';

export function ProjectsList(projects: Project[]) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        System Subsystems
      </Typography>
      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            disablePadding
            sx={{ mb: 1 }}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => { }}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <ListItemIcon>
                <ListItemButton />
              </ListItemIcon>
              <ListItemText
                primary={project.name}
                secondary={project.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
