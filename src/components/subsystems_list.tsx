import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import BuildIcon from '@mui/icons-material/Build';
import ComputerIcon from '@mui/icons-material/Computer';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import AirIcon from '@mui/icons-material/Air';
import MemoryIcon from '@mui/icons-material/Memory';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import SettingsIcon from '@mui/icons-material/Settings';

interface Subsystem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
}

const subsystems: Subsystem[] = [
  {
    id: 'engine',
    name: 'Engine',
    description: 'Primary propulsion system responsible for generating mechanical power.',
    icon: <BuildIcon />
  },
  {
    id: 'processing',
    name: 'Processing Unit',
    description: 'Central computational core handling data processing and system coordination.',
    icon: <ComputerIcon />
  },
  {
    id: 'tires',
    name: 'Tires',
    description: 'Ground contact interface providing traction and vehicle stability.',
    icon: <DriveEtaIcon />
  },
  {
    id: 'power',
    name: 'Power System',
    description: 'Energy generation and distribution network for all subsystems.',
    icon: <BatteryChargingFullIcon />
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    description: 'Thermal management unit maintaining optimal operating temperatures.',
    icon: <AirIcon />
  },
  {
    id: 'memory',
    name: 'Memory Storage',
    description: 'Data retention and retrieval system for operational information.',
    icon: <MemoryIcon />
  },
  {
    id: 'security',
    name: 'Security Module',
    description: 'Authentication and access control system protecting system integrity.',
    icon: <SecurityIcon />
  },
  {
    id: 'storage',
    name: 'Storage System',
    description: 'Physical storage compartments and retrieval mechanisms.',
    icon: <StorageIcon />
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Wireless and wired communication interfaces for external connectivity.',
    icon: <NetworkWifiIcon />
  },
  {
    id: 'control',
    name: 'Control System',
    description: 'Master control interface coordinating all subsystem operations.',
    icon: <SettingsIcon />
  }
];

export default function SubsystemsList() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        System Subsystems
      </Typography>
      <List>
        {subsystems.map((subsystem) => (
          <ListItem key={subsystem.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <ListItemIcon>
                {subsystem.icon}
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
