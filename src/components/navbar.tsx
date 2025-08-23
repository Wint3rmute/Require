"use client"

import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ButtonAppBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationLinks = [
    { name: 'Subsystems', href: '/tree-editor' },
    { name: 'Interfaces', href: '/interfaces' },
    { name: 'System Model', href: '/system-model' },
    { name: 'Login', href: '#' }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Require
            </Link>
          </Typography>

          {!isMobile && (
            <>
              <Button color="inherit" component={Link} href="/tree-editor">
                Subsystems
              </Button>
              <Button color="inherit" component={Link} href="/interfaces">
                Interfaces
              </Button>
              <Button color="inherit" component={Link} href="/system-model">
                System Model
              </Button>
              <Button color="inherit">Login</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <List>
            {navigationLinks.map((link) => (
              <ListItem key={link.name} disablePadding>
                <ListItemButton component={Link} href={link.href}>
                  <ListItemText primary={link.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
