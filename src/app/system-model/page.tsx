import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InterfacesList from '@/components/interfaces_list_DRAFT';
import SystemEditor from '@/components/system_editor';
import Paper from '@mui/material/Paper';

export default function SystemModel() {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Paper sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Interfaces
            </Typography>
            <InterfacesList />
          </Paper>
        </Grid>
        <Grid size={9}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" align="center">
              System Name
            </Typography>
            <Box
              sx={{
                height: '70vh',
                border: '1px dashed grey',
                marginTop: 2,
              }}
            >
              <SystemEditor />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
