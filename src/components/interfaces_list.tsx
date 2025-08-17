import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CableIcon from '@mui/icons-material/Cable';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Note: The full icon set is no longer needed here, so they have been removed.
// The icon is now passed in from the page component.

export interface Interface {
  id: string;
  name: string;
  description: string;
  // The icon is now a string identifier instead of a React element.
  // This makes it serializable for localStorage.
  icon: string;
}

interface InterfacesListProps {
  interfaces: Interface[];
  // A map to resolve icon string identifiers to actual components.
  iconMap: { [key: string]: React.ReactElement };
  onDelete: (id: string) => void;
}

export default function InterfacesList({ interfaces, iconMap, onDelete }: InterfacesListProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        Interfaces
      </Typography>
      <List>
        {interfaces.map((interfaceItem) => (
          <ListItem
            key={interfaceItem.id}
            disablePadding
            sx={{ mb: 1 }}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(interfaceItem.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <ListItemIcon>
                {iconMap[interfaceItem.icon] || <CableIcon />}
              </ListItemIcon>
              <ListItemText
                primary={interfaceItem.name}
                secondary={interfaceItem.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
