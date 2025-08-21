"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from "../page.module.css";
import InterfacesList from "@/components/interfaces_list";
import { type Interface } from "@/components/interfaces_list";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [interfaceToDelete, setInterfaceToDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to load interfaces from localStorage on initial render
  useEffect(() => {
    const storedInterfaces = localStorage.getItem('interfaces');
    if (storedInterfaces) {
      setInterfaces(JSON.parse(storedInterfaces));
    } else {
      setInterfaces(initialInterfaces);
    }
    setIsLoaded(true);
  }, []);

  // Effect to save interfaces to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('interfaces', JSON.stringify(interfaces));
    }
  }, [interfaces, isLoaded]);


  const handleDeleteClick = (id: string) => {
    setInterfaceToDelete(id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setInterfaceToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (interfaceToDelete) {
      const updatedInterfaces = interfaces.filter((iface) => iface.id !== interfaceToDelete);
      setInterfaces(updatedInterfaces);
    }
    handleDialogClose();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <InterfacesList interfaces={interfaces} iconMap={iconMap} onDelete={handleDeleteClick} />
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this interface? This action cannot be undone.
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



