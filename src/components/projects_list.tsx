"use client";

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

import Link from 'next/link';

import AccountTree from '@mui/icons-material/AccountTree';

import { Project } from '@/generated/prisma';

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        Projects
      </Typography>
      <List>
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.name}`} >
            <ListItem
              disablePadding
              sx={{ mb: 1 }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => { alert("Not yet implemented") }}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <ListItemIcon>
                  <AccountTree />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  secondary={"Project ID: " + project.id}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box >
  );
}
