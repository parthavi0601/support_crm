import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'secondary' | 'success' | 'error' | 'info';
  trend?: string;
}

export default function StatsCard({ label, value, icon, color, trend }: StatsCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const palette = theme.palette[color];

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? '0 1px 2px rgba(0,0,0,0.2)'
          : '0 1px 2px rgba(26,35,50,0.04)',
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(palette.main, isDark ? 0.15 : 0.1),
            color: palette.main,
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        fontWeight={600}
        letterSpacing="-0.03em"
        lineHeight={1}
        sx={{ color: 'text.primary' }}
      >
        {value ?? 0}
      </Typography>

      {trend && (
        <Typography variant="caption" sx={{ display: 'block', color: palette.main, fontWeight: 500, mt: 1 }}>
          {trend}
        </Typography>
      )}
    </Box>
  );
}
