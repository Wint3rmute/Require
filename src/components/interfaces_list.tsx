import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
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

interface Interface {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
}

const interfaces: Interface[] = [
  {
    id: 'uart',
    name: 'UART',
    description: 'Universal Asynchronous Receiver-Transmitter for serial communication between devices.',
    icon: <CableIcon />
  },
  {
    id: 'can',
    name: 'CAN Bus',
    description: 'Controller Area Network protocol for robust vehicle communications in noisy environments.',
    icon: <RouterIcon />
  },
  {
    id: 'usbc',
    name: 'USB-C',
    description: 'Universal Serial Bus Type-C connector for high-speed data transfer and power delivery.',
    icon: <UsbIcon />
  },
  {
    id: 'i2c',
    name: 'I2C',
    description: 'Inter-Integrated Circuit protocol for short-distance communication between microcontrollers and peripherals.',
    icon: <CableIcon />
  },
  {
    id: 'spi',
    name: 'SPI',
    description: 'Serial Peripheral Interface for synchronous serial communication with external devices.',
    icon: <StorageIcon />
  },
  {
    id: 'ethernet',
    name: 'Ethernet',
    description: 'Wired network interface providing reliable high-speed data transmission over local networks.',
    icon: <RouterIcon />
  },
  {
    id: 'bluetooth',
    name: 'Bluetooth',
    description: 'Short-range wireless communication protocol for connecting peripheral devices.',
    icon: <BluetoothIcon />
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    description: 'Wireless network interface enabling internet connectivity and local network access.',
    icon: <WifiIcon />
  },
  {
    id: 'sdcard',
    name: 'SD Card',
    description: 'Secure Digital memory card interface for removable storage expansion.',
    icon: <SdStorageIcon />
  },
  {
    id: 'hdmi',
    name: 'HDMI',
    description: 'High-Definition Multimedia Interface for digital audio and video transmission.',
    icon: <VideocamIcon />
  },
  {
    id: 'audio',
    name: '3.5mm Audio',
    description: 'Standard analog audio jack interface for headphones and external audio devices.',
    icon: <HeadphonesIcon />
  },
  {
    id: 'parallel',
    name: 'Parallel Port',
    description: 'Multi-wire interface for simultaneous data transmission to printers and legacy devices.',
    icon: <PrintIcon />
  }
];

export default function InterfacesList() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
        System Interfaces
      </Typography>
      <List>
        {interfaces.map((interfaceItem) => (
          <ListItem key={interfaceItem.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <ListItemIcon>
                {interfaceItem.icon}
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