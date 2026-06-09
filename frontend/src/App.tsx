import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode, Box, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as PaletteMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#5b6cf0',
            light: '#7b8af5',
            dark: '#4a59d9',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
          },
          success: {
            main: '#22c55e',
            light: '#4ade80',
            dark: '#16a34a',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
          },
          background: {
            default: mode === 'light' ? '#f4f6f9' : '#0a0a0a',
            paper: mode === 'light' ? '#ffffff' : '#111111',
          },
          text: {
            primary: mode === 'light' ? '#1a2332' : '#f0f0f0',
            secondary: mode === 'light' ? '#5c6b7f' : '#888888',
          },
          divider: mode === 'light' ? '#e8ecf1' : '#222222',
          action: {
            hover: mode === 'light' ? 'rgba(26, 35, 50, 0.04)' : 'rgba(255, 255, 255, 0.04)',
            selected: mode === 'light' ? 'rgba(91, 108, 240, 0.08)' : 'rgba(91, 108, 240, 0.12)',
          },
        },
        typography: {
          fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
          h4: { fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.25 },
          h5: { fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
          h6: { fontWeight: 600, letterSpacing: '-0.01em' },
          subtitle1: { fontWeight: 500 },
          subtitle2: { fontWeight: 500 },
          body2: { fontSize: '0.875rem', lineHeight: 1.55 },
          button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '8px 18px',
                fontSize: '0.875rem',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              },
              outlined: {
                borderColor: mode === 'light' ? '#d8dee8' : '#2a2a2a',
                '&:hover': {
                  borderColor: mode === 'light' ? '#c5cdd9' : '#3a3a3a',
                  backgroundColor: mode === 'light' ? 'rgba(26,35,50,0.03)' : 'rgba(255,255,255,0.04)',
                },
              },
              outlinedPrimary: {
                borderColor: mode === 'light' ? '#5b6cf0' : '#5b6cf0',
                '&:hover': {
                  backgroundColor: 'rgba(91,108,240,0.06)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
              outlined: {
                border: `1px solid ${mode === 'light' ? '#e8ecf1' : '#222222'}`,
                boxShadow: mode === 'light'
                  ? '0 1px 2px rgba(26, 35, 50, 0.04)'
                  : '0 1px 2px rgba(0, 0, 0, 0.4)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                backgroundImage: 'none',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: `1px solid ${mode === 'light' ? '#e8ecf1' : '#1e1e1e'}`,
                backgroundColor: mode === 'light' ? '#ffffff' : '#0d0d0d',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                fontSize: '0.75rem',
                borderRadius: 8,
              },
              colorSuccess: {
                backgroundColor: mode === 'light' ? '#ecfdf3' : 'rgba(34,197,94,0.12)',
                color: mode === 'light' ? '#15803d' : '#4ade80',
              },
              colorWarning: {
                backgroundColor: mode === 'light' ? '#fffbeb' : 'rgba(245,158,11,0.12)',
                color: mode === 'light' ? '#b45309' : '#fbbf24',
              },
              colorError: {
                backgroundColor: mode === 'light' ? '#fef2f2' : 'rgba(239,68,68,0.12)',
                color: mode === 'light' ? '#b91c1c' : '#f87171',
              },
              colorInfo: {
                backgroundColor: mode === 'light' ? '#eff6ff' : 'rgba(59,130,246,0.12)',
                color: mode === 'light' ? '#1d4ed8' : '#60a5fa',
              },
              colorSecondary: {
                backgroundColor: mode === 'light' ? '#f5f3ff' : 'rgba(139,92,246,0.12)',
                color: mode === 'light' ? '#6d28d9' : '#a78bfa',
              },
              colorPrimary: {
                backgroundColor: mode === 'light' ? '#eef1fe' : 'rgba(91,108,240,0.12)',
                color: mode === 'light' ? '#4a59d9' : '#7b8af5',
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                '& .MuiTableCell-head': {
                  fontWeight: 500,
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: mode === 'light' ? '#8b9cb3' : '#666666',
                  backgroundColor: mode === 'light' ? '#fafbfc' : '#0d0d0d',
                  borderBottom: `1px solid ${mode === 'light' ? '#e8ecf1' : '#1e1e1e'}`,
                  padding: '11px 20px',
                },
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:last-child td': { border: 0 },
                '&.MuiTableRow-hover:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(91,108,240,0.03)' : 'rgba(91,108,240,0.08)',
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: `1px solid ${mode === 'light' ? '#f0f3f7' : '#1a1a1a'}`,
                padding: '14px 20px',
                fontSize: '0.8125rem',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                backgroundColor: mode === 'light' ? '#fafbfc' : '#161616',
                '& fieldset': {
                  borderColor: mode === 'light' ? '#e8ecf1' : '#2a2a2a',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'light' ? '#d8dee8' : '#3a3a3a',
                },
                '&.Mui-focused': {
                  backgroundColor: mode === 'light' ? '#ffffff' : '#1a1a1a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5b6cf0',
                  borderWidth: '1.5px',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                '&:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(26,35,50,0.04)' : 'rgba(255,255,255,0.04)',
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? '#e8ecf1' : '#1e1e1e',
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                fontSize: '0.7rem',
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 14,
                border: `1px solid ${mode === 'light' ? '#e8ecf1' : '#222222'}`,
                boxShadow: mode === 'light'
                  ? '0 20px 40px rgba(26, 35, 50, 0.12)'
                  : '0 20px 40px rgba(0, 0, 0, 0.7)',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}
          data-theme={mode}
        >
          <Sidebar 
            mode={mode} 
            toggleColorMode={colorMode.toggleColorMode} 
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <Box
            component="main"
            className="app-main"
            sx={{ flexGrow: 1, overflow: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            {/* Mobile Header */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                px: 2, 
                py: 1.5, 
                alignItems: 'center', 
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper'
              }}
            >
              <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                edge="start" 
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                SupportDesk
              </Typography>
            </Box>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/ticket/:ticketId" element={<TicketDetail />} />
            </Routes>
          </Box>
        </Box>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: '"Inter", sans-serif',
              borderRadius: '12px',
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: mode === 'light'
                ? '0 8px 24px rgba(26, 35, 50, 0.08)'
                : '0 8px 24px rgba(0, 0, 0, 0.35)',
              fontSize: '0.8125rem',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
