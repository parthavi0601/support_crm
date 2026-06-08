import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
  PaletteMode
} from '@mui/material';
import { Dashboard as DashboardIcon, Add as AddIcon, ConfirmationNumber as ConfirmationNumberIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function Sidebar({ mode, toggleColorMode }: SidebarProps) {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 1,
            borderRadius: 2,
            display: 'flex'
          }}
        >
          <ConfirmationNumberIcon />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1}>
            SupportDesk
          </Typography>
          <Typography variant="caption" color="text.secondary">
            CRM System
          </Typography>
        </Box>
      </Box>
      <Divider />
      
      <List sx={{ flex: 1, px: 2, pt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ pl: 2, mb: 1, display: 'block' }}>
          Menu
        </Typography>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={NavLink}
            to="/"
            end
            sx={{
              borderRadius: 2,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/create"
            sx={{
              borderRadius: 2,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Ticket" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Drawer>
  );
}
