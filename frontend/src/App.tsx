import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode, Box } from '@mui/material';

import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Sidebar from './components/Sidebar';

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as PaletteMode) || 'light';
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
            main: '#2563eb', // Tailwind blue-600
          },
          secondary: {
            main: '#7c3aed', // Tailwind violet-600
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
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
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar mode={mode} toggleColorMode={colorMode.toggleColorMode} />
          <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
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
              borderRadius: '8px',
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
