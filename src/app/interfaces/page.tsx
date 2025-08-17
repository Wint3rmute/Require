"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from "../page.module.css";
import InterfacesList from "@/components/interfaces_list";
import { type Interface } from "@/components/interfaces_list";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Import all the icons
import UsbIcon from '@mui/icons-material/Usb';
import CableIcon from '@mui/icons-material/Cable';
import RouterIcon from '@mui/icons-material/Router';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import WifiIcon from '@mui/icons-material/Wifi';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import VideocamIcon from '@mui/icons-material/Videocam';
import PrintIcon from '@mui/icons-material/Print';
import StorageIcon from '@mui/icons-material/Storage';

// Create a map from string identifiers to icon components
const iconMap: { [key: string]: React.ReactElement } = {
  'uart': <CableIcon />,
  'can': <RouterIcon />,
  'usbc': <UsbIcon />,
  'i2c': <CableIcon />,
  'spi': <StorageIcon />,
  'ethernet': <RouterIcon />,
  'bluetooth': <BluetoothIcon />,
  'wifi': <WifiIcon />,
  'sdcard': <SdStorageIcon />,
  'hdmi': <VideocamIcon />,
  'audio': <HeadphonesIcon />,
  'parallel': <PrintIcon />,
  'default': <CableIcon />,
};

// This is the initial data, moved from the list component.
const initialInterfaces: Interface[] = [
  { id: 'uart', name: 'UART', description: 'Universal Asynchronous Receiver-Transmitter.', icon: 'uart' },
  { id: 'can', name: 'CAN Bus', description: 'Controller Area Network protocol.', icon: 'can' },
  { id: 'usbc', name: 'USB-C', description: 'Universal Serial Bus Type-C.', icon: 'usbc' },
  { id: 'i2c', name: 'I2C', description: 'Inter-Integrated Circuit protocol.', icon: 'i2c' },
  { id: 'spi', name: 'SPI', description: 'Serial Peripheral Interface.', icon: 'spi' },
  { id: 'ethernet', name: 'Ethernet', description: 'Wired network interface.', icon: 'ethernet' },
];

export default function Page() {
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Effect to load interfaces from localStorage on initial render
  useEffect(() => {
    const storedInterfaces = localStorage.getItem('interfaces');
    if (storedInterfaces) {
      setInterfaces(JSON.parse(storedInterfaces));
    } else {
      setInterfaces(initialInterfaces);
    }
  }, []);

  // Effect to save interfaces to localStorage whenever they change
  useEffect(() => {
    // Don't save the initial empty array before hydration
    if (interfaces.length > 0) {
      localStorage.setItem('interfaces', JSON.stringify(interfaces));
    }
  }, [interfaces]);

  const handleCreateInterface = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return; // Prevent creating empty interfaces

    const newInterface: Interface = {
      id: `iface-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim(),
      icon: 'default', // Assign a default icon for new interfaces
    };

    setInterfaces([...interfaces, newInterface]);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Box 
          component="form" 
          onSubmit={handleCreateInterface}
          sx={{
            width: '100%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
            mb: 4,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Create New Interface
          </Typography>
          <TextField
            fullWidth
            label="Interface Name"
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
            Add Interface
          </Button>
        </Box>
        <InterfacesList interfaces={interfaces} iconMap={iconMap} />
      </main>
    </div>
  );
}