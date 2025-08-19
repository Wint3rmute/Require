"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import SubsystemsList from "@/components/subsystems_list";
import { type Subsystem } from "@/components/subsystems_list";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Import all the icons
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

// Create a map from string identifiers to icon components
const iconMap: { [key: string]: React.ReactElement } = {
  engine: <BuildIcon />,
  processing: <ComputerIcon />,
  tires: <DriveEtaIcon />,
  power: <BatteryChargingFullIcon />,
  cooling: <AirIcon />,
  memory: <MemoryIcon />,
  security: <SecurityIcon />,
  storage: <StorageIcon />,
  communication: <NetworkWifiIcon />,
  control: <SettingsIcon />,
  default: <SettingsIcon />,
};

// This is the initial data, moved from the list component.
const initialSubsystems: Subsystem[] = [
  { id: 'engine', name: 'Engine', description: 'Primary propulsion system.', icon: 'engine' },
  { id: 'processing', name: 'Processing Unit', description: 'Central computational core.', icon: 'processing' },
  { id: 'power', name: 'Power System', description: 'Energy generation and distribution.', icon: 'power' },
  { id: 'cooling', name: 'Cooling System', description: 'Thermal management unit.', icon: 'cooling' },
  { id: 'communication', name: 'Communication', description: 'External connectivity interfaces.', icon: 'communication' },
];

export default function Page() {

  const [subsystems, setSubsystems] = useState<Subsystem[]>([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subsystemToDelete, setSubsystemToDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedSubsystems = localStorage.getItem('subsystems');
    if (storedSubsystems) {
      setSubsystems(JSON.parse(storedSubsystems));
    } else {
      setSubsystems(initialSubsystems);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('subsystems', JSON.stringify(subsystems));
    }
  }, [subsystems, isLoaded]);

  const handleCreateSubsystem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;

    const newSubsystem: Subsystem = {
      id: `subsystem-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim(),
      icon: 'default',
    };

    setSubsystems([...subsystems, newSubsystem]);
    setNewName('');
    setNewDescription('');
  };

  const handleDeleteClick = (id: string) => {
    setSubsystemToDelete(id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSubsystemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (subsystemToDelete) {
      setSubsystems(subsystems.filter((sub) => sub.id !== subsystemToDelete));
    }
    handleDialogClose();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Box
          component="form"
          onSubmit={handleCreateSubsystem}
          sx={{ width: '100%', maxWidth: 800, p: 4, borderRadius: 2, boxShadow: 1, mb: 4, bgcolor: 'background.paper' }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Create New Subsystem
          </Typography>
          <TextField
            fullWidth
            label="Subsystem Name"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Subsystem
          </Button>
        </Box>
        <SubsystemsList subsystems={subsystems} iconMap={iconMap} onDelete={handleDeleteClick} />
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this subsystem? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
