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
import SettingsIcon from '@mui/icons-material/Settings'; // Default icon

export interface Subsystem {
  id: string;
  name: string;
  description: string;
  icon: string; // Serializable icon identifier
}

interface SubsystemsListProps {
  subsystems: Subsystem[];
  iconMap: { [key: string]: React.ReactElement };
  onDelete: (id: string) => void;
}

export default function SubsystemsList({ subsystems, iconMap, onDelete }: SubsystemsListProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        System Subsystems
      </Typography>
      <List>
        {subsystems.map((subsystem) => (
          <ListItem 
            key={subsystem.id} 
            disablePadding 
            sx={{ mb: 1 }}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(subsystem.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <ListItemIcon>
                {iconMap[subsystem.icon] || <SettingsIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={subsystem.name}
                secondary={subsystem.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
