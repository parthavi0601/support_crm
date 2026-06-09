import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  PaletteMode,
  Tooltip,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  HeadsetMic as HeadsetMicIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 256;

interface SidebarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon sx={{ fontSize: 20 }} />, end: true },
];

export default function Sidebar({ mode, toggleColorMode }: SidebarProps) {
  const theme = useTheme();
  const nav = useNavigate();
  const isDark = mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center', gap: 1.75 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HeadsetMicIcon sx={{ color: '#fff', fontSize: 19 }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            lineHeight={1.2}
            letterSpacing="-0.02em"
            sx={{ color: 'text.primary' }}
          >
            SupportDesk
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            CRM Platform
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2, pt: 2.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.25,
            mb: 1.25,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontSize: '0.625rem',
          }}
        >
          Menu
        </Typography>

        <List disablePadding>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.end}
                sx={{
                  borderRadius: 2.5,
                  px: 1.5,
                  py: 1.1,
                  minHeight: 42,
                  color: 'text.secondary',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  '&.active': {
                    bgcolor: isDark ? 'rgba(91,108,240,0.12)' : 'rgba(91,108,240,0.08)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': { fontWeight: 600, color: 'primary.main' },
                  },
                  '&:hover:not(.active)': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,35,50,0.04)',
                    color: 'text.primary',
                    '& .MuiListItemIcon-root': { color: 'text.primary' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, px: 0.5 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => nav('/create')}
            sx={{
              py: 1.1,
              fontSize: '0.8125rem',
              borderRadius: 2.5,
            }}
          >
            Create Ticket
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {isDark ? 'Light mode' : 'Dark mode'}
          </Typography>
          <Tooltip title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            <IconButton
              onClick={toggleColorMode}
              size="small"
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(26,35,50,0.02)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26,35,50,0.05)',
                },
              }}
            >
              {isDark
                ? <Brightness7Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
                : <Brightness4Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}
